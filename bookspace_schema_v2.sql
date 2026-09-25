-- ============================================================
--  BOOKSPACE — SCHÉMA DE BASE DE DONNÉES v2
--  Construit à partir du Dictionnaire de Données du DAC
-- ============================================================
-- À exécuter dans Supabase → SQL Editor → New query.
--
-- Convention de lecture des commentaires :
--   [DAC]   = directement issu de ton dictionnaire de données
--   [FIX]   = correction d'une incohérence repérée (MCD vs texte,
--             ou Livre/Offre qui n'était pas relié correctement)
--   [AJOUT] = table/colonne qui n'existait pas dans ton document,
--             ajoutée parce que nécessaire techniquement
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- 1. CLIENT  [DAC + FIX]
-- ============================================================
-- Ton MCD sépare UTILISATEUR / CLIENT / ADMINISTRATEUR en 3
-- tables lié 1-1. Simplification volontaire : comme "on est
-- tout d'abord client" avant tout (règle métier de ton doc §1),
-- on fusionne UTILISATEUR + CLIENT en une seule table, et
-- ADMINISTRATEUR devient juste un booléen "est_admin" dessus.
-- auth.users (fourni par Supabase) gère déjà email + mot de
-- passe haché : pas besoin de les dupliquer ici.
create table public.client (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,                 -- [AJOUT] copie de auth.users.email, pour affichage/recherche
  nom_complet text,
  tel_client text,
  -- [DAC] cycle de vie du compte (Figure 5) : en_attente_verification
  -- tant que l'email n'est pas confirmé, puis actif, puis suspendu possible
  statut_client text not null default 'en_attente_verification'
    check (statut_client in ('en_attente_verification','actif','suspendu')),
  est_admin boolean not null default false,
  date_inscription timestamptz not null default now()
);

-- À l'inscription (auth.users), on crée automatiquement la ligne client
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.client (id, email, nom_complet, tel_client)
  values (new.id, new.email, new.raw_user_meta_data->>'nom_complet', new.raw_user_meta_data->>'tel_client');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- [AJOUT] Si l'utilisateur change son email via Supabase Auth,
-- on garde la copie dans "client" synchronisée automatiquement
create or replace function public.sync_email_client()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  update public.client set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute procedure public.sync_email_client();

-- ============================================================
-- [AJOUT — CORRECTIF DE SÉCURITÉ] Empêcher un client de
-- s'auto-promouvoir admin ou de modifier son propre statut.
-- ============================================================
-- La politique RLS plus bas autorise un client à modifier SA
-- PROPRE ligne (pour changer son nom, son téléphone...). Mais
-- RLS ne peut pas restreindre colonne par colonne : sans ce
-- trigger, rien n'empêcherait un client d'envoyer aussi
-- `est_admin = true` dans la même requête UPDATE. Ce trigger
-- annule silencieusement toute tentative de modification de
-- ces 2 colonnes par quelqu'un qui n'est pas déjà admin.
create or replace function public.proteger_colonnes_sensibles_client()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.est_admin := old.est_admin;
    new.statut_client := old.statut_client;
  end if;
  return new;
end;
$$;

create trigger avant_maj_client
  before update on public.client
  for each row execute procedure public.proteger_colonnes_sensibles_client();


-- ============================================================
-- 2. PROFIL_VENDEUR  [DAC]
-- ============================================================
create table public.profil_vendeur (
  id_vendeur uuid primary key default gen_random_uuid(),
  id_client uuid not null unique references public.client(id) on delete cascade,
  nom_commercial text not null,
  description_boutique text,
  -- [DAC] Figure 6 : non_verifie -> actif -> suspendu (et suspendu
  -- possible même après activation, pas seulement au départ)
  statut_vendeur text not null default 'non_verifie'
    check (statut_vendeur in ('non_verifie','actif','suspendu')),
  piece_identite text,              -- URL du fichier (Supabase Storage)
  numero_commercial text,           -- numéro de réception des versements
  operateur_vendeur text
    check (operateur_vendeur in ('mtn_momo','orange_money','stripe','virement')),
  motif_suspension text,
  localisation jsonb,
  type_de_structure text check (type_de_structure in ('boutique','particulier')),
  dateact timestamptz,              -- date d'activation par l'admin
  note_moyenne numeric(2,1) default 0,
  date_creation timestamptz not null default now()
);

-- [AJOUT — CORRECTIF SÉCURITÉ] Même faille que sur "client" : sans
-- ce trigger, un vendeur pourrait s'auto-approuver (statut_vendeur
-- = 'actif') via un simple UPDATE, en court-circuitant la
-- validation KYB de l'admin.
create or replace function public.proteger_colonnes_sensibles_vendeur()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.statut_vendeur := old.statut_vendeur;
    new.dateact := old.dateact;
    new.note_moyenne := old.note_moyenne;
    new.motif_suspension := old.motif_suspension;
  end if;
  return new;
end;
$$;

create trigger avant_maj_profil_vendeur
  before update on public.profil_vendeur
  for each row execute procedure public.proteger_colonnes_sensibles_vendeur();


-- ============================================================
-- 3. DEMANDE_VENDEUR  [DAC]
-- ============================================================
create table public.demande_vendeur (
  id_demande uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id) on delete cascade,
  nom_commercial text,
  type_de_structure text,
  piece_identite text,
  localisation jsonb,
  statut text not null default 'en_attente'
    check (statut in ('en_attente','approuvee','rejetee')),
  date_demande timestamptz not null default now()
);

-- [DAC] "on ne peut soumettre qu'une demande à la fois" : un seul
-- index garantit qu'un même client ne peut avoir 2 demandes "en_attente"
create unique index une_seule_demande_en_attente
  on public.demande_vendeur (id_client)
  where statut = 'en_attente';


-- ============================================================
-- 4. CATEGORIE  [DAC]
-- ============================================================
create table public.categorie (
  id serial primary key,
  nom_categorie text not null,
  slug_categorie text unique not null
);


-- ============================================================
-- 5. LIVRE  [DAC + FIX]
-- ============================================================
-- [FIX] Fiche bibliographique INDÉPENDANTE du vendeur (pas de
-- prix, pas de stock ici : ça vit dans OFFRE, ci-dessous).
create table public.livre (
  id_livre uuid primary key default gen_random_uuid(),
  id_categorie integer references public.categorie(id),
  -- [AJOUT] trace quel vendeur a créé la fiche, pour limiter qui
  -- peut la modifier (sans ça, n'importe quel vendeur pouvait
  -- éditer le titre/auteur d'un livre créé par un concurrent)
  cree_par_vendeur uuid references public.profil_vendeur(id_vendeur),
  titre_livre text not null,
  auteur_livre text not null,
  description_livre text,
  image_couverture text,      -- URL Supabase Storage
  isbn_livre text
);


-- ============================================================
-- 6. OFFRE  [DAC + FIX]
-- ============================================================
-- [FIX] C'est ICI que le lien Livre <-> Vendeur se fait. Un même
-- livre peut avoir plusieurs offres (plusieurs vendeurs).
create table public.offre (
  id_offre uuid primary key default gen_random_uuid(),
  id_livre uuid not null references public.livre(id_livre) on delete cascade,
  id_vendeur uuid not null references public.profil_vendeur(id_vendeur) on delete cascade,
  type_offre text not null check (type_offre in ('physique','numerique')),
  prix_offre numeric(10,2) not null,
  stock_offre integer,                 -- pertinent seulement si physique
  etat_article text check (etat_article in ('neuf','occasion')),
  fichier_numerique text,              -- URL si numérique (jamais en clair au client)
  statut_droits text check (statut_droits in ('domaine_public','droits_detenus')),
  justificatif_droits text,
  -- [AJOUT] nécessaire pour la modération (un admin doit pouvoir
  -- masquer une offre signalée sans la supprimer)
  statut_offre text not null default 'active'
    check (statut_offre in ('active','masquee','en_revision')),
  est_disponible boolean not null default true,
  date_creation timestamptz not null default now()
);

-- [AJOUT — CORRECTIF SÉCURITÉ] Empêche un vendeur de se
-- re-publier lui-même après une mise en masquage par l'admin
-- (modération). "est_disponible" (rupture de stock volontaire)
-- reste, lui, librement modifiable par le vendeur.
create or replace function public.proteger_statut_offre()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.statut_offre := old.statut_offre;
  end if;
  return new;
end;
$$;

create trigger avant_maj_offre
  before update on public.offre
  for each row execute procedure public.proteger_statut_offre();


-- ============================================================
-- 7. ADRESSE_LIVRAISON  [DAC]
-- ============================================================
create table public.adresse_livraison (
  id_adresse uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id) on delete cascade,
  libelle text,                 -- "Domicile", "Bureau"...
  nom_destinataire text,
  tel_livraison text,
  adresse jsonb,
  is_default boolean default false
);


-- ============================================================
-- 8. PANIER + LIGNE_PANIER  [DAC]
-- ============================================================
create table public.panier (
  id_panier uuid primary key default gen_random_uuid(),
  id_client uuid not null unique references public.client(id) on delete cascade,
  date_maj_panier timestamptz not null default now()
);

create table public.ligne_panier (
  id_ligne_panier uuid primary key default gen_random_uuid(),
  id_panier uuid not null references public.panier(id_panier) on delete cascade,
  id_offre uuid not null references public.offre(id_offre) on delete cascade,
  quantite_panier integer not null default 1,
  unique (id_panier, id_offre)
);


-- ============================================================
-- 9. COMMANDE + LIGNE_COMMANDE  [DAC]
-- ============================================================
create table public.commande (
  id_commande uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id),
  id_adresse uuid references public.adresse_livraison(id_adresse),
  statut_commande text not null default 'en_attente'
    check (statut_commande in ('en_attente','payee','expediee','livree','annulee','remboursee')),
  montant_total_commande numeric(10,2) not null default 0,
  date_commande timestamptz not null default now()
);

create table public.ligne_commande (
  id_ligne_commande uuid primary key default gen_random_uuid(),
  id_commande uuid not null references public.commande(id_commande) on delete cascade,
  id_offre uuid not null references public.offre(id_offre),
  quantite_commande integer not null default 1,
  prix_unitaire_fige numeric(10,2) not null,   -- copie du prix au moment de l'achat
  mode_livraison text not null check (mode_livraison in ('domicile','retrait','telechargement')),
  -- [DAC] Figure 7, cycle complet : payee -> en_preparation -> en_expedition
  -- -> livree -> fond_reverse (chemin normal physique)
  --           -> remboursee (refus vendeur ou délai dépassé)
  -- Pour le numérique : payee -> disponible_telechargement (immédiat)
  statut_ligne_commande text not null default 'en_attente_paiement'
    check (statut_ligne_commande in (
      'en_attente_paiement','payee','en_preparation','en_expedition','livree',
      'fond_reverse','remboursee','disponible_telechargement'
    )),
  -- [AJOUT] date limite légale pour que le vendeur accepte (15 jours,
  -- décidé ensemble) : calculée automatiquement par le trigger ci-dessous
  date_limite_acceptation timestamptz
);

-- [AJOUT] Calcule automatiquement la date limite de 15 jours,
-- uniquement pour les livraisons physiques (le numérique n'attend pas)
create or replace function public.definir_delai_acceptation()
returns trigger language plpgsql as $$
begin
  if new.mode_livraison in ('domicile','retrait') then
    new.date_limite_acceptation := now() + interval '15 days';
  end if;
  return new;
end;
$$;

create trigger avant_insertion_ligne_commande
  before insert on public.ligne_commande
  for each row execute procedure public.definir_delai_acceptation();


-- ============================================================
-- 10. PAIEMENT  [DAC + décision : multi-fournisseurs]
-- ============================================================
create table public.paiement (
  id_paiement uuid primary key default gen_random_uuid(),
  id_commande uuid not null references public.commande(id_commande) on delete cascade,
  -- décidé : PayPal + MTN MoMo + Orange Money
  fournisseur_paiement text not null
    check (fournisseur_paiement in ('mtn_momo','orange_money','paypal')),
  tel_paiement text,               -- pertinent si mobile money
  montant_paiement numeric(10,2) not null,
  statut_paiement text not null default 'en_attente'
    check (statut_paiement in ('en_attente','succes','echec')),
  id_transaction_externe text,     -- référence renvoyée par le fournisseur
  date_paiement timestamptz not null default now()
);


-- ============================================================
-- 11. BIBLIOTHEQUE_NUMERIQUE  [AJOUT]
-- ============================================================
-- N'existait pas dans le dictionnaire. Nécessaire pour distinguer
-- "j'ai le droit d'accéder à ce livre" (permanent) de "je l'affiche
-- dans ma bibliothèque" (le client peut la masquer sans perdre
-- son achat, comme décidé ensemble).
create table public.bibliotheque_numerique (
  id uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id) on delete cascade,
  id_offre uuid not null references public.offre(id_offre),
  id_ligne_commande uuid references public.ligne_commande(id_ligne_commande),
  est_masquee boolean not null default false,
  date_ajout timestamptz not null default now(),
  unique (id_client, id_offre)
);

-- [AJOUT — CORRECTIF SÉCURITÉ] L'entrée en bibliothèque n'est
-- JAMAIS insérée directement par le client (sinon il pourrait
-- s'ajouter n'importe quel livre numérique sans payer). Elle est
-- créée automatiquement par ce trigger, dès que le paiement fait
-- passer la ligne de commande à "disponible_telechargement".
create or replace function public.ajouter_a_bibliotheque()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_id_client uuid;
begin
  if new.statut_ligne_commande = 'disponible_telechargement'
     and (old.statut_ligne_commande is distinct from 'disponible_telechargement') then
    select id_client into v_id_client from public.commande where id_commande = new.id_commande;
    insert into public.bibliotheque_numerique (id_client, id_offre, id_ligne_commande)
    values (v_id_client, new.id_offre, new.id_ligne_commande)
    on conflict (id_client, id_offre) do nothing;
  end if;
  return new;
end;
$$;

create trigger apres_maj_ligne_commande_bibliotheque
  after update on public.ligne_commande
  for each row execute procedure public.ajouter_a_bibliotheque();


-- ============================================================
-- 12. AVIS  [DAC + FIX]
-- ============================================================
-- [FIX] Relié à ligne_commande (pas juste à offre) pour pouvoir
-- vérifier "cette ligne est-elle livrée ?" avant d'autoriser l'avis
-- (décision : après livraison pour le physique, immédiat pour le numérique)
create table public.avis (
  id_avis uuid primary key default gen_random_uuid(),
  id_ligne_commande uuid not null unique references public.ligne_commande(id_ligne_commande),
  id_client uuid not null references public.client(id),
  id_offre uuid not null references public.offre(id_offre),
  note_avis integer not null check (note_avis between 1 and 5),
  commentaire_avis text,
  date_avis timestamptz not null default now()
);


-- ============================================================
-- 13. DEMANDE_RETOUR  [DAC]
-- ============================================================
create table public.demande_retour (
  id_demande_retour uuid primary key default gen_random_uuid(),
  id_ligne_commande uuid not null references public.ligne_commande(id_ligne_commande),
  motif_retour text not null,
  statut_retour text not null default 'en_attente'
    check (statut_retour in ('en_attente','approuvee','rejetee','remboursee')),
  date_demande_retour timestamptz not null default now()
);


-- ============================================================
-- 14. RECLAMATION  [DAC + décision : toujours liée à une commande]
-- ============================================================
create table public.reclamation (
  id_reclamation uuid primary key default gen_random_uuid(),
  id_commande uuid not null references public.commande(id_commande),
  id_client uuid not null references public.client(id),
  sujet_reclamation text not null,
  description_reclamation text,
  statut_reclamation text not null default 'ouverte'
    check (statut_reclamation in ('ouverte','en_cours','resolue','fermee')),
  date_reclamation timestamptz not null default now()
);


-- ============================================================
-- 15. SIGNALEMENT_OFFRE  [DAC]
-- ============================================================
create table public.signalement_offre (
  id_signalement uuid primary key default gen_random_uuid(),
  id_offre uuid not null references public.offre(id_offre),
  motif_signalement text not null
    check (motif_signalement in ('violation_droits','contrefacon','contenu_inapproprie','autre')),
  description_signalement text,
  statut_signalement text not null default 'en_attente'
    check (statut_signalement in ('en_attente','en_cours','action_prise','classe_sans_suite')),
  notes_admin_signalement text,
  -- [DAC] "jamais exposé publiquement ni au vendeur" : garanti plus
  -- bas car AUCUNE politique RLS ne donne accès à cette table au vendeur
  signale_par_id uuid references public.client(id),
  date_signalement timestamptz not null default now()
);


-- ============================================================
-- 16. NOTIFICATION  [DAC]
-- ============================================================
create table public.notification (
  id_notification uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id) on delete cascade,
  type_notification text not null,
  message_notification text not null,
  est_lue_notification boolean not null default false,
  objet_lie_id uuid,
  date_notification timestamptz not null default now()
);


-- ============================================================
-- 17. VERSEMENT_VENDEUR  [AJOUT]
-- ============================================================
-- N'existait pas explicitement, mais indispensable pour tracer
-- "gestion des pourcentages" et "redistribution des dus des
-- vendeurs" mentionnés dans tes spécifications fonctionnelles.
create table public.versement_vendeur (
  id_versement uuid primary key default gen_random_uuid(),
  id_vendeur uuid not null references public.profil_vendeur(id_vendeur),
  id_ligne_commande uuid references public.ligne_commande(id_ligne_commande),
  montant numeric(10,2) not null,
  statut text not null default 'en_attente' check (statut in ('en_attente','effectue')),
  date_versement timestamptz
);


-- ============================================================
-- 18. COMMISSION  [AJOUT]
-- ============================================================
-- Requis par ta spec fonctionnelle admin : "Gestions des
-- pourcentages applicables aux commissions"
create table public.commission (
  id serial primary key,
  type_offre text not null unique check (type_offre in ('physique','numerique')),
  taux numeric(5,2) not null,
  modifie_par uuid references public.client(id),
  date_modification timestamptz not null default now()
);

insert into public.commission (type_offre, taux) values
  ('physique', 10.0),
  ('numerique', 20.0);

-- ============================================================
-- 19. LISTE_ENVIES + CHRONIQUE [AJOUT - fonctionnalites front]
-- ============================================================
create table public.liste_envies (
  id uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id) on delete cascade,
  id_livre uuid not null references public.livre(id_livre) on delete cascade,
  date_ajout timestamptz not null default now(),
  unique (id_client, id_livre)
);

create table public.chronique (
  id uuid primary key default gen_random_uuid(),
  id_vendeur uuid references public.profil_vendeur(id_vendeur) on delete set null,
  id_livre uuid references public.livre(id_livre) on delete set null,
  titre text not null,
  slug text not null unique,
  resume text,
  contenu text not null,
  image text,
  statut text not null default 'brouillon' check (statut in ('brouillon','publiee','archivee')),
  date_publication timestamptz,
  date_creation timestamptz not null default now(),
  date_modification timestamptz not null default now()
);


-- ============================================================
-- 19. FONCTIONS UTILITAIRES POUR LA SÉCURITÉ (RLS)
-- ============================================================
create or replace function public.est_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists (select 1 from public.client where id = auth.uid() and est_admin = true); $$;

create or replace function public.id_vendeur_courant()
returns uuid language sql security definer set search_path = public
as $$ select id_vendeur from public.profil_vendeur where id_client = auth.uid(); $$;


-- ============================================================
-- 20. ACTIVATION DU RLS SUR TOUTES LES TABLES
-- ============================================================
alter table public.client enable row level security;
alter table public.profil_vendeur enable row level security;
alter table public.demande_vendeur enable row level security;
alter table public.categorie enable row level security;
alter table public.livre enable row level security;
alter table public.offre enable row level security;
alter table public.adresse_livraison enable row level security;
alter table public.panier enable row level security;
alter table public.ligne_panier enable row level security;
alter table public.commande enable row level security;
alter table public.ligne_commande enable row level security;
alter table public.paiement enable row level security;
alter table public.bibliotheque_numerique enable row level security;
alter table public.avis enable row level security;
alter table public.demande_retour enable row level security;
alter table public.reclamation enable row level security;
alter table public.signalement_offre enable row level security;
alter table public.notification enable row level security;
alter table public.versement_vendeur enable row level security;
alter table public.commission enable row level security;
alter table public.liste_envies enable row level security;
alter table public.chronique enable row level security;


-- ============================================================
-- 21. POLITIQUES RLS
-- ============================================================

-- ---- CLIENT ----
create policy "lecture de son propre profil" on public.client
  for select using (id = auth.uid() or public.est_admin());
create policy "un vendeur lit les clients de ses commandes" on public.client
  for select using (
    exists (
      select 1 from public.commande c
      join public.ligne_commande lc on lc.id_commande = c.id_commande
      join public.offre o on o.id_offre = lc.id_offre
      where c.id_client = client.id and o.id_vendeur = public.id_vendeur_courant()
    )
  );
create policy "modification de son propre profil" on public.client
  for update using (id = auth.uid());

-- ---- PROFIL_VENDEUR ----
create policy "lecture publique des vendeurs actifs" on public.profil_vendeur
  for select using (statut_vendeur = 'actif' or id_client = auth.uid() or public.est_admin());
create policy "creation de sa fiche vendeur" on public.profil_vendeur
  for insert with check (public.est_admin());
create policy "modification de sa fiche vendeur" on public.profil_vendeur
  for update using (id_client = auth.uid() or public.est_admin());

-- ---- DEMANDE_VENDEUR ----
create policy "un client voit ses propres demandes" on public.demande_vendeur
  for select using (id_client = auth.uid() or public.est_admin());
create policy "un client cree sa demande" on public.demande_vendeur
  for insert with check (id_client = auth.uid() and statut = 'en_attente');
create policy "seul l'admin traite les demandes" on public.demande_vendeur
  for update using (public.est_admin());

-- ---- CATEGORIE ----
create policy "lecture publique des categories" on public.categorie for select using (true);
create policy "seul l'admin gere les categories" on public.categorie
  for all using (public.est_admin()) with check (public.est_admin());

-- ---- LIVRE ----
create policy "lecture publique des livres" on public.livre for select using (true);
create policy "un vendeur cree des fiches livre" on public.livre
  for insert with check (
    cree_par_vendeur = public.id_vendeur_courant()
    and exists (
      select 1 from public.profil_vendeur pv
      where pv.id_vendeur = public.id_vendeur_courant() and pv.statut_vendeur = 'actif'
    )
  );
create policy "seul le createur ou l'admin modifie une fiche livre" on public.livre
  for update using (cree_par_vendeur = public.id_vendeur_courant() or public.est_admin());

-- ---- OFFRE ----
create policy "lecture publique des offres actives" on public.offre
  for select using (statut_offre = 'active' or id_vendeur = public.id_vendeur_courant() or public.est_admin());
create policy "un vendeur cree ses offres" on public.offre
  for insert with check (
    id_vendeur = public.id_vendeur_courant()
    and exists (
      select 1 from public.profil_vendeur pv
      where pv.id_vendeur = id_vendeur and pv.statut_vendeur = 'actif'
    )
  );
create policy "un vendeur modifie ses offres" on public.offre
  for update using (id_vendeur = public.id_vendeur_courant() or public.est_admin());

-- ---- ADRESSE_LIVRAISON ----
create policy "un client gere ses adresses" on public.adresse_livraison
  for all using (id_client = auth.uid()) with check (id_client = auth.uid());

-- ---- PANIER / LIGNE_PANIER ----
create policy "un client gere son panier" on public.panier
  for all using (id_client = auth.uid()) with check (id_client = auth.uid());
create policy "un client gere ses lignes de panier" on public.ligne_panier
  for all using (exists (select 1 from public.panier p where p.id_panier = ligne_panier.id_panier and p.id_client = auth.uid()));

-- ---- COMMANDE ----
-- [FIX SÉCURITÉ] Pas de politique INSERT ici : la création d'une
-- commande implique de calculer un vrai total, vérifier les stocks
-- et initier un paiement — c'est de la logique métier qui passera
-- par Laravel (clé service_role, qui contourne le RLS). Le client
-- ne peut donc que LIRE ses commandes via Supabase, jamais en créer
-- directement lui-même.
create policy "voir ses commandes (client, vendeur concerne, admin)" on public.commande
  for select using (
    id_client = auth.uid() or public.est_admin()
    or exists (
      select 1 from public.ligne_commande lc join public.offre o on o.id_offre = lc.id_offre
      where lc.id_commande = commande.id_commande and o.id_vendeur = public.id_vendeur_courant()
    )
  );

-- ---- LIGNE_COMMANDE ----
-- [FIX SÉCURITÉ] Pas de politique UPDATE ici non plus : accepter
-- une commande, l'expédier, ou déclencher "fond_reverse" (déblocage
-- des fonds) suit un vrai cycle d'états avec des règles (délai de
-- 15 jours, confirmation de réception du client...) qui doit être
-- imposé par Laravel, pas laissé à un simple UPDATE du vendeur.
create policy "voir ses lignes de commande" on public.ligne_commande
  for select using (
    public.est_admin()
    or exists (select 1 from public.offre o where o.id_offre = ligne_commande.id_offre and o.id_vendeur = public.id_vendeur_courant())
    or exists (select 1 from public.commande c where c.id_commande = ligne_commande.id_commande and c.id_client = auth.uid())
  );

-- ---- PAIEMENT ----
create policy "voir le paiement de sa propre commande" on public.paiement
  for select using (
    exists (select 1 from public.commande c where c.id_commande = paiement.id_commande and c.id_client = auth.uid())
    or public.est_admin()
  );

-- ---- BIBLIOTHEQUE_NUMERIQUE ----
-- [FIX SÉCURITÉ] Le client peut CONSULTER et MASQUER un titre,
-- mais jamais en INSÉRER un lui-même (seul le trigger automatique
-- ci-dessus le fait, après paiement réellement confirmé).
create policy "un client voit sa bibliotheque" on public.bibliotheque_numerique
  for select using (id_client = auth.uid());
create policy "un client masque un titre de sa bibliotheque" on public.bibliotheque_numerique
  for update using (id_client = auth.uid()) with check (id_client = auth.uid());

-- ---- AVIS ----
-- [FIX] Vérifie vraiment la règle décidée : avis autorisé si la
-- ligne est livrée (physique) OU si l'offre est numérique et déjà
-- accessible (immédiat). Avant, n'importe quel client pouvait poser
-- un avis sur n'importe quelle ligne, livrée ou non.
create policy "lecture publique des avis" on public.avis for select using (true);
create policy "un client laisse un avis apres livraison ou achat numerique" on public.avis
  for insert with check (
    id_client = auth.uid()
    and exists (
      select 1 from public.ligne_commande lc
      join public.commande c on c.id_commande = lc.id_commande
      join public.offre o on o.id_offre = lc.id_offre
      where lc.id_ligne_commande = avis.id_ligne_commande
        and c.id_client = auth.uid()
        and (
          lc.statut_ligne_commande = 'livree'
          or (o.type_offre = 'numerique' and lc.statut_ligne_commande in ('disponible_telechargement','fond_reverse'))
        )
    )
  );

-- ---- DEMANDE_RETOUR ----
create policy "voir ses demandes de retour" on public.demande_retour
  for select using (
    public.est_admin()
    or exists (
      select 1 from public.ligne_commande lc join public.commande c on c.id_commande = lc.id_commande
      where lc.id_ligne_commande = demande_retour.id_ligne_commande and c.id_client = auth.uid()
    )
  );
create policy "un client cree une demande de retour" on public.demande_retour
  for insert with check (
    exists (
      select 1 from public.ligne_commande lc join public.commande c on c.id_commande = lc.id_commande
      where lc.id_ligne_commande = demande_retour.id_ligne_commande and c.id_client = auth.uid()
    )
  );

-- ---- RECLAMATION ----
create policy "un client voit ses reclamations" on public.reclamation
  for select using (id_client = auth.uid() or public.est_admin());
create policy "un client cree une reclamation sur sa commande" on public.reclamation
  for insert with check (
    id_client = auth.uid()
    and exists (select 1 from public.commande c where c.id_commande = id_commande and c.id_client = auth.uid())
  );
create policy "seul l'admin traite les reclamations" on public.reclamation
  for update using (public.est_admin());

-- ---- SIGNALEMENT_OFFRE ----
-- Volontairement AUCUNE politique select pour un vendeur : il ne
-- doit jamais voir qui l'a signalé, ni même qu'il est signalé,
-- avant une éventuelle action de l'admin.
create policy "un utilisateur connecte peut signaler" on public.signalement_offre
  for insert with check (auth.uid() is not null);
create policy "seul l'admin consulte les signalements" on public.signalement_offre
  for select using (public.est_admin());
create policy "seul l'admin traite les signalements" on public.signalement_offre
  for update using (public.est_admin());

-- ---- NOTIFICATION ----
create policy "un client voit ses notifications" on public.notification
  for select using (id_client = auth.uid());
create policy "un client marque ses notifications comme lues" on public.notification
  for update using (id_client = auth.uid());

-- ---- VERSEMENT_VENDEUR ----
create policy "un vendeur voit ses versements" on public.versement_vendeur
  for select using (id_vendeur = public.id_vendeur_courant() or public.est_admin());

-- ---- COMMISSION ----
create policy "seul l'admin consulte les commissions" on public.commission
  for select using (public.est_admin());
create policy "seul l'admin modifie les commissions" on public.commission
  for update using (public.est_admin());

-- ---- LISTE_ENVIES ----
create policy "un client gere sa liste d'envies" on public.liste_envies
  for all using (id_client = auth.uid()) with check (id_client = auth.uid());

-- ---- CHRONIQUE ----
create policy "lecture publique des chroniques publiees" on public.chronique
  for select using (statut = 'publiee' or public.est_admin());
create policy "un vendeur cree ses chroniques" on public.chronique
  for insert with check (id_vendeur = public.id_vendeur_courant());
create policy "un vendeur modifie ses chroniques non publiees" on public.chronique
  for update using (id_vendeur = public.id_vendeur_courant() and statut <> 'publiee');

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================

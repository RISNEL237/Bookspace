-- Renforcement RLS incrémental pour une base BookSpace v2 déjà créée.
-- À exécuter dans Supabase SQL Editor après bookspace_schema_v2_patch.sql.
-- Les requêtes sensibles de commande/paiement restent réservées à Laravel.

-- Les politiques permissives PostgreSQL sont combinées par OR. Cette migration
-- remplace les politiques applicatives connues par des règles explicites.

-- L'adresse e-mail du profil est synchronisée depuis Supabase Auth; elle ne
-- peut pas être changée en modifiant directement public.client.
create or replace function public.proteger_colonnes_sensibles_client()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.id := old.id;
    new.email := old.email;
    new.est_admin := old.est_admin;
    new.statut_client := old.statut_client;
    new.date_inscription := old.date_inscription;
  end if;
  return new;
end;
$$;

-- Création client d'une demande uniquement en attente; aucun profil vendeur
-- n'est directement créable par un compte non administrateur.
drop policy if exists "creation de sa fiche vendeur" on public.profil_vendeur;
create policy "creation de sa fiche vendeur" on public.profil_vendeur
  for insert with check (public.est_admin());
drop policy if exists "un client cree sa demande" on public.demande_vendeur;
create policy "un client cree sa demande" on public.demande_vendeur
  for insert with check (id_client = auth.uid() and statut = 'en_attente');

-- Seuls les vendeurs actifs créent des livres et des offres.
drop policy if exists "un vendeur cree des fiches livre" on public.livre;
create policy "un vendeur cree des fiches livre" on public.livre
  for insert with check (
    cree_par_vendeur = public.id_vendeur_courant()
    and exists (
      select 1 from public.profil_vendeur pv
      where pv.id_vendeur = public.id_vendeur_courant() and pv.statut_vendeur = 'actif'
    )
  );
drop policy if exists "un vendeur cree ses offres" on public.offre;
create policy "un vendeur cree ses offres" on public.offre
  for insert with check (
    id_vendeur = public.id_vendeur_courant()
    and exists (
      select 1 from public.profil_vendeur pv
      where pv.id_vendeur = offre.id_vendeur and pv.statut_vendeur = 'actif'
    )
  );

-- Les clients ne voient que les fiches livre publiées via une offre active.
drop policy if exists "lecture publique des livres" on public.livre;
create policy "lecture des livres disponibles" on public.livre
  for select using (
    public.est_admin()
    or cree_par_vendeur = public.id_vendeur_courant()
    or exists (
      select 1 from public.offre o
      join public.profil_vendeur pv on pv.id_vendeur = o.id_vendeur
      where o.id_livre = livre.id_livre
        and o.statut_offre = 'active'
        and o.est_disponible = true
        and pv.statut_vendeur = 'actif'
    )
  );

drop policy if exists "lecture publique des offres actives" on public.offre;
create policy "lecture des offres disponibles ou propres" on public.offre
  for select using (
    public.est_admin()
    or id_vendeur = public.id_vendeur_courant()
    or (
      statut_offre = 'active'
      and est_disponible = true
      and exists (
        select 1 from public.profil_vendeur pv
        where pv.id_vendeur = offre.id_vendeur and pv.statut_vendeur = 'actif'
      )
    )
  );

-- Les vendeurs ne peuvent pas transférer la propriété d'une fiche/offre
-- en changeant ses identifiants. La modération reste administrateur seulement.
create or replace function public.proteger_identite_fiche_vendeur()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.id_vendeur := old.id_vendeur;
    new.id_client := old.id_client;
  end if;
  return new;
end;
$$;
drop trigger if exists avant_maj_identite_vendeur on public.profil_vendeur;
create trigger avant_maj_identite_vendeur
  before update on public.profil_vendeur
  for each row execute procedure public.proteger_identite_fiche_vendeur();

create or replace function public.proteger_identite_livre()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.id_livre := old.id_livre;
    new.cree_par_vendeur := old.cree_par_vendeur;
  end if;
  return new;
end;
$$;
drop trigger if exists avant_maj_identite_livre on public.livre;
create trigger avant_maj_identite_livre
  before update on public.livre
  for each row execute procedure public.proteger_identite_livre();

create or replace function public.proteger_identite_offre()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.id_offre := old.id_offre;
    new.id_vendeur := old.id_vendeur;
  end if;
  return new;
end;
$$;
drop trigger if exists avant_maj_identite_offre on public.offre;
create trigger avant_maj_identite_offre
  before update on public.offre
  for each row execute procedure public.proteger_identite_offre();

-- Une entrée de bibliothèque ne peut jamais changer de bénéficiaire,
-- d'offre ou de commande d'origine : seul le masquage est modifiable.
create or replace function public.proteger_acces_bibliotheque()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.id := old.id;
    new.id_client := old.id_client;
    new.id_offre := old.id_offre;
    new.id_ligne_commande := old.id_ligne_commande;
    new.date_ajout := old.date_ajout;
  end if;
  return new;
end;
$$;
drop trigger if exists avant_maj_bibliotheque_numerique on public.bibliotheque_numerique;
create trigger avant_maj_bibliotheque_numerique
  before update on public.bibliotheque_numerique
  for each row execute procedure public.proteger_acces_bibliotheque();
drop policy if exists "un client masque un titre de sa bibliotheque" on public.bibliotheque_numerique;
create policy "un client masque un titre de sa bibliotheque" on public.bibliotheque_numerique
  for update using (id_client = auth.uid())
  with check (id_client = auth.uid());

-- Un avis doit référencer exactement la ligne ET l'offre réellement achetées.
drop policy if exists "un client laisse un avis apres livraison ou achat numerique" on public.avis;
create policy "un client laisse un avis apres livraison ou achat numerique" on public.avis
  for insert with check (
    id_client = auth.uid()
    and exists (
      select 1
      from public.ligne_commande lc
      join public.commande c on c.id_commande = lc.id_commande
      join public.offre o on o.id_offre = lc.id_offre
      where lc.id_ligne_commande = avis.id_ligne_commande
        and lc.id_offre = avis.id_offre
        and c.id_client = auth.uid()
        and (
          lc.statut_ligne_commande = 'livree'
          or (o.type_offre = 'numerique' and lc.statut_ligne_commande in ('disponible_telechargement','fond_reverse'))
        )
    )
  );

-- Le client ne peut soumettre que des demandes initialement en attente.
drop policy if exists "un client cree une demande de retour" on public.demande_retour;
create policy "un client cree une demande de retour" on public.demande_retour
  for insert with check (
    statut_retour = 'en_attente'
    and exists (
      select 1 from public.ligne_commande lc
      join public.commande c on c.id_commande = lc.id_commande
      where lc.id_ligne_commande = demande_retour.id_ligne_commande
        and c.id_client = auth.uid()
    )
  );

-- Évite l'ambiguïté SQL sur id_commande et bloque les faux statuts initiaux.
drop policy if exists "un client cree une reclamation sur sa commande" on public.reclamation;
create policy "un client cree une reclamation sur sa commande" on public.reclamation
  for insert with check (
    id_client = auth.uid()
    and statut_reclamation = 'ouverte'
    and exists (
      select 1 from public.commande c
      where c.id_commande = reclamation.id_commande and c.id_client = auth.uid()
    )
  );

drop policy if exists "un utilisateur connecte peut signaler" on public.signalement_offre;
create policy "un utilisateur connecte peut signaler" on public.signalement_offre
  for insert with check (
    auth.uid() is not null
    and signale_par_id = auth.uid()
    and statut_signalement = 'en_attente'
    and notes_admin_signalement is null
  );

-- Les clients ne peuvent modifier que le booléen de lecture d'une notification.
create or replace function public.proteger_notification_client()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.est_admin() then
    new.id_notification := old.id_notification;
    new.id_client := old.id_client;
    new.type_notification := old.type_notification;
    new.message_notification := old.message_notification;
    new.objet_lie_id := old.objet_lie_id;
    new.date_notification := old.date_notification;
  end if;
  return new;
end;
$$;
drop trigger if exists avant_maj_notification_client on public.notification;
create trigger avant_maj_notification_client
  before update on public.notification
  for each row execute procedure public.proteger_notification_client();
drop policy if exists "un client marque ses notifications comme lues" on public.notification;
create policy "un client marque ses notifications comme lues" on public.notification
  for update using (id_client = auth.uid())
  with check (id_client = auth.uid());

-- Vérifie le propriétaire et la disponibilité de l'offre sur toute écriture panier.
drop policy if exists "un client gere ses lignes de panier" on public.ligne_panier;
create policy "un client gere ses lignes de panier" on public.ligne_panier
  for all using (
    exists (
      select 1 from public.panier p
      where p.id_panier = ligne_panier.id_panier and p.id_client = auth.uid()
    )
  )
  with check (
    quantite_panier > 0
    and exists (
      select 1 from public.panier p
      where p.id_panier = ligne_panier.id_panier and p.id_client = auth.uid()
    )
    and exists (
      select 1 from public.offre o
      join public.profil_vendeur pv on pv.id_vendeur = o.id_vendeur
      where o.id_offre = ligne_panier.id_offre
        and o.statut_offre = 'active'
        and o.est_disponible = true
        and pv.statut_vendeur = 'actif'
        and (o.type_offre = 'numerique' or o.stock_offre >= ligne_panier.quantite_panier)
    )
  );

-- Tous les achats, paiements et changements de cycle restent backend-only.
-- Aucune politique INSERT/UPDATE/DELETE client n'est créée sur commande,
-- ligne_commande ou paiement.

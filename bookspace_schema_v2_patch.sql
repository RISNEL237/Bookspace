-- Migration locale des ajouts BookSpace (schema v2 déjà installé).
-- À exécuter une seule fois depuis Supabase SQL Editor.

create table if not exists public.liste_envies (
  id uuid primary key default gen_random_uuid(),
  id_client uuid not null references public.client(id) on delete cascade,
  id_livre uuid not null references public.livre(id_livre) on delete cascade,
  date_ajout timestamptz not null default now(),
  unique (id_client, id_livre)
);
alter table public.liste_envies enable row level security;
do $$ begin
  create policy "un client gere sa liste d'envies" on public.liste_envies
    for all using (id_client = auth.uid()) with check (id_client = auth.uid());
exception when duplicate_object then null; end $$;

create table if not exists public.chronique (
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
alter table public.chronique enable row level security;
do $$ begin
  create policy "lecture publique des chroniques publiees" on public.chronique
    for select using (statut = 'publiee' or public.est_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "un vendeur cree ses chroniques" on public.chronique
    for insert with check (id_vendeur = public.id_vendeur_courant());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "un vendeur modifie ses chroniques non publiees" on public.chronique
    for update using (id_vendeur = public.id_vendeur_courant() and statut <> 'publiee');
exception when duplicate_object then null; end $$;

-- Les lignes restent en attente jusqu'à confirmation effective du prestataire.
alter table public.ligne_commande drop constraint if exists ligne_commande_statut_ligne_commande_check;
alter table public.ligne_commande add constraint ligne_commande_statut_ligne_commande_check
  check (statut_ligne_commande in (
    'en_attente_paiement','payee','en_preparation','en_expedition','livree',
    'fond_reverse','remboursee','disponible_telechargement'
  ));
alter table public.ligne_commande alter column statut_ligne_commande set default 'en_attente_paiement';

-- PayPal et Orange Money sont acceptés par le schéma, même si leurs connecteurs sont à configurer.
alter table public.paiement drop constraint if exists paiement_fournisseur_paiement_check;
alter table public.paiement add constraint paiement_fournisseur_paiement_check
  check (fournisseur_paiement in ('mtn_momo','orange_money','paypal','stripe'));

-- Les e-books doivent être servis par des liens signés temporaires seulement.
-- Le bucket doit exister dans Supabase Storage avec cet identifiant.
update storage.buckets set public = false where id = 'digital-books';

-- Buckets privés pour les e-books, justificatifs d'identité et preuves de droits.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('book-covers', 'book-covers', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('digital-books', 'digital-books', false, 52428800, array['application/pdf', 'application/epub+zip']),
  ('seller-documents', 'seller-documents', false, 15728640, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Couvertures publiques : l'écriture reste réservée au dossier de l'utilisateur connecté.
drop policy if exists "deposer ses couvertures livre" on storage.objects;
create policy "deposer ses couvertures livre" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'book-covers' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Chaque compte ne peut déposer que dans son propre dossier.
drop policy if exists "deposer ses justificatifs vendeur" on storage.objects;
create policy "deposer ses justificatifs vendeur" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'seller-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
  );
drop policy if exists "consulter ses justificatifs vendeur" on storage.objects;
create policy "consulter ses justificatifs vendeur" on storage.objects
  for select to authenticated using (
    bucket_id = 'seller-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Seuls les vendeurs actifs peuvent déposer un e-book, et seulement dans leur dossier.
drop policy if exists "deposer ses livres numeriques" on storage.objects;
create policy "deposer ses livres numeriques" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'digital-books'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.profil_vendeur pv
      where pv.id_client = (select auth.uid()) and pv.statut_vendeur = 'actif'
    )
  );
drop policy if exists "consulter ses livres numeriques" on storage.objects;
create policy "consulter ses livres numeriques" on storage.objects
  for select to authenticated using (
    bucket_id = 'digital-books' and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Le parcours de demande passe par Laravel : l’utilisateur ne peut pas
-- créer directement un profil vendeur en contournant la demande.
drop policy if exists "creation de sa fiche vendeur" on public.profil_vendeur;
create policy "creation de sa fiche vendeur" on public.profil_vendeur
  for insert with check (public.est_admin());

drop policy if exists "un client cree sa demande" on public.demande_vendeur;
create policy "un client cree sa demande" on public.demande_vendeur
  for insert with check (id_client = auth.uid() and statut = 'en_attente');

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
      where pv.id_vendeur = id_vendeur and pv.statut_vendeur = 'actif'
    )
  );

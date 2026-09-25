-- ============================================================
-- BOOKSPACE — DONNÉES DE TEST
-- À exécuter dans Supabase → SQL Editor après le schéma v2.
--
-- PRÉREQUIS : créez ces trois comptes dans Supabase Auth → Users
-- (ou via votre formulaire d'inscription), puis remplacez les
-- trois adresses ci-dessous par leurs emails exacts.
-- Le trigger handle_new_user() doit avoir créé leurs lignes client.
-- L'exécution dans SQL Editor (rôle postgres) contourne RLS.
-- ============================================================

do $$
declare
  -- Modifiez ces emails pour les comptes de test créés dans Auth.
  v_admin_email text := 'risneltalla@gmail.com';
  v_vendeur_email text := 'risneltalla6@gmail.com';
  v_acheteur_email text := 'floremathan@gmail.com';

  v_admin uuid;
  v_vendeur_client uuid;
  v_acheteur uuid;
  v_profil_vendeur uuid;
  v_cat_romans integer;
  v_cat_sciences integer;
  v_livre_papier uuid := 'b0000000-0000-4000-8000-000000000001';
  v_livre_numerique uuid := 'b0000000-0000-4000-8000-000000000002';
  v_offre_papier uuid := 'b0000000-0000-4000-8000-000000000011';
  v_offre_numerique uuid := 'b0000000-0000-4000-8000-000000000012';
  v_adresse uuid := 'b0000000-0000-4000-8000-000000000021';
  v_panier uuid := 'b0000000-0000-4000-8000-000000000031';
  v_commande uuid := 'b0000000-0000-4000-8000-000000000041';
  v_ligne_physique uuid := 'b0000000-0000-4000-8000-000000000051';
  v_ligne_numerique uuid := 'b0000000-0000-4000-8000-000000000052';
begin
  select id into v_admin from auth.users where lower(email) = lower(v_admin_email) limit 1;
  select id into v_vendeur_client from auth.users where lower(email) = lower(v_vendeur_email) limit 1;
  select id into v_acheteur from auth.users where lower(email) = lower(v_acheteur_email) limit 1;

  if v_admin is null or v_vendeur_client is null or v_acheteur is null then
    raise exception 'Comptes Auth introuvables. Créez les trois utilisateurs et renseignez leurs emails au début du script.';
  end if;
  if v_admin = v_vendeur_client or v_admin = v_acheteur or v_vendeur_client = v_acheteur then
    raise exception 'Utilisez trois comptes Auth distincts pour admin, vendeur et acheteur.';
  end if;

  -- Les lignes client sont créées automatiquement par le trigger Auth.
  -- SQL Editor n'a pas auth.uid(); désactivation temporaire du trigger
  -- de protection le temps de préparer les comptes de test.
  alter table public.client disable trigger avant_maj_client;
  update public.client set est_admin = (id = v_admin), statut_client = 'actif'
  where id in (v_admin, v_vendeur_client, v_acheteur);
  update public.client set nom_complet = 'Administrateur Bookspace' where id = v_admin;
  update public.client set nom_complet = 'Amadou Diallo', tel_client = '+221770000001' where id = v_vendeur_client;
  update public.client set nom_complet = 'Aïcha Ndiaye', tel_client = '+221770000002' where id = v_acheteur;
  alter table public.client enable trigger avant_maj_client;

  insert into public.categorie (nom_categorie, slug_categorie)
  values ('Romans', 'romans'), ('Sciences et technologie', 'sciences-technologie')
  on conflict (slug_categorie) do update set nom_categorie = excluded.nom_categorie;
  select id into v_cat_romans from public.categorie where slug_categorie = 'romans';
  select id into v_cat_sciences from public.categorie where slug_categorie = 'sciences-technologie';

  alter table public.profil_vendeur disable trigger avant_maj_profil_vendeur;
  insert into public.profil_vendeur
    (id_client, nom_commercial, description_boutique, statut_vendeur,
     numero_commercial, operateur_vendeur, localisation, type_de_structure, dateact)
  values
    (v_vendeur_client, 'La Librairie du Baobab', 'Romans et ouvrages de référence.',
     'actif', '+221770000001', 'orange_money',
     '{"ville":"Dakar","pays":"Sénégal"}'::jsonb, 'boutique', now())
  on conflict (id_client) do update set
    nom_commercial = excluded.nom_commercial,
    description_boutique = excluded.description_boutique,
    statut_vendeur = 'actif', dateact = coalesce(public.profil_vendeur.dateact, now());
  alter table public.profil_vendeur enable trigger avant_maj_profil_vendeur;
  select id_vendeur into v_profil_vendeur
  from public.profil_vendeur where id_client = v_vendeur_client;

  insert into public.livre
    (id_livre, id_categorie, cree_par_vendeur, titre_livre, auteur_livre, description_livre, isbn_livre)
  values
    (v_livre_papier, v_cat_romans, v_profil_vendeur, 'Une si longue lettre', 'Mariama Bâ',
     'Roman épistolaire majeur de la littérature sénégalaise.', '978-2-0703-6050-2'),
    (v_livre_numerique, v_cat_sciences, v_profil_vendeur, 'Introduction à Python', 'Fatou Sarr',
     'Guide pratique pour découvrir la programmation.', '978-2-0000-0000-1')
  on conflict (id_livre) do update set
    id_categorie = excluded.id_categorie, cree_par_vendeur = excluded.cree_par_vendeur,
    titre_livre = excluded.titre_livre, auteur_livre = excluded.auteur_livre,
    description_livre = excluded.description_livre, isbn_livre = excluded.isbn_livre;

  insert into public.offre
    (id_offre, id_livre, id_vendeur, type_offre, prix_offre, stock_offre,
     etat_article, fichier_numerique, statut_droits, statut_offre, est_disponible)
  values
    (v_offre_papier, v_livre_papier, v_profil_vendeur, 'physique', 6500, 12,
     'neuf', null, null, 'active', true),
    (v_offre_numerique, v_livre_numerique, v_profil_vendeur, 'numerique', 3500, null,
     null, 'https://example.com/fichiers/introduction-python.pdf', 'droits_detenus', 'active', true)
  on conflict (id_offre) do update set
    id_livre = excluded.id_livre, id_vendeur = excluded.id_vendeur,
    type_offre = excluded.type_offre, prix_offre = excluded.prix_offre,
    stock_offre = excluded.stock_offre, etat_article = excluded.etat_article,
    fichier_numerique = excluded.fichier_numerique, statut_droits = excluded.statut_droits,
    statut_offre = excluded.statut_offre, est_disponible = excluded.est_disponible;

  insert into public.adresse_livraison
    (id_adresse, id_client, libelle, nom_destinataire, tel_livraison, adresse, is_default)
  values (v_adresse, v_acheteur, 'Domicile', 'Aïcha Ndiaye', '+221770000002',
    '{"pays":"Sénégal","ville":"Dakar","quartier":"Plateau","adresse_ligne":"12 rue de la Paix"}'::jsonb, true)
  on conflict (id_adresse) do update set
    id_client = excluded.id_client, libelle = excluded.libelle,
    nom_destinataire = excluded.nom_destinataire, tel_livraison = excluded.tel_livraison,
    adresse = excluded.adresse, is_default = excluded.is_default;

  insert into public.panier (id_panier, id_client) values (v_panier, v_acheteur)
  on conflict (id_client) do update set date_maj_panier = now();
  select id_panier into v_panier from public.panier where id_client = v_acheteur;
  insert into public.ligne_panier (id_panier, id_offre, quantite_panier)
  values (v_panier, v_offre_papier, 1), (v_panier, v_offre_numerique, 1)
  on conflict (id_panier, id_offre) do update set quantite_panier = excluded.quantite_panier;

  insert into public.commande
    (id_commande, id_client, id_adresse, statut_commande, montant_total_commande)
  values (v_commande, v_acheteur, v_adresse, 'payee', 10000)
  on conflict (id_commande) do update set
    id_client = excluded.id_client, id_adresse = excluded.id_adresse,
    statut_commande = excluded.statut_commande,
    montant_total_commande = excluded.montant_total_commande;

  insert into public.ligne_commande
    (id_ligne_commande, id_commande, id_offre, quantite_commande,
     prix_unitaire_fige, mode_livraison, statut_ligne_commande)
  values
    (v_ligne_physique, v_commande, v_offre_papier, 1, 6500, 'domicile', 'livree'),
    (v_ligne_numerique, v_commande, v_offre_numerique, 1, 3500, 'telechargement', 'disponible_telechargement')
  on conflict (id_ligne_commande) do update set
    id_commande = excluded.id_commande, id_offre = excluded.id_offre,
    quantite_commande = excluded.quantite_commande,
    prix_unitaire_fige = excluded.prix_unitaire_fige,
    mode_livraison = excluded.mode_livraison,
    statut_ligne_commande = excluded.statut_ligne_commande;

  insert into public.paiement
    (id_commande, fournisseur_paiement, tel_paiement, montant_paiement,
     statut_paiement, id_transaction_externe)
  select v_commande, 'orange_money', '+221770000002', 10000, 'succes', 'TEST-BOOKSPACE-001'
  where not exists (select 1 from public.paiement where id_transaction_externe = 'TEST-BOOKSPACE-001');

  -- Le trigger de bibliothèque s'exécute sur le passage de statut;
  -- cet upsert assure aussi le résultat quand on rejoue le seed.
  insert into public.bibliotheque_numerique (id_client, id_offre, id_ligne_commande)
  values (v_acheteur, v_offre_numerique, v_ligne_numerique)
  on conflict (id_client, id_offre) do update set id_ligne_commande = excluded.id_ligne_commande;

  insert into public.avis (id_ligne_commande, id_client, id_offre, note_avis, commentaire_avis)
  values (v_ligne_physique, v_acheteur, v_offre_papier, 5, 'Très bonne lecture, livre reçu en excellent état.')
  on conflict (id_ligne_commande) do update set
    note_avis = excluded.note_avis, commentaire_avis = excluded.commentaire_avis;

  insert into public.notification (id_client, type_notification, message_notification, est_lue_notification)
  select v_acheteur, 'commande', 'Votre commande de test a été confirmée.', false
  where not exists (select 1 from public.notification
    where id_client = v_acheteur and message_notification = 'Votre commande de test a été confirmée.');

  raise notice 'Seed Bookspace inséré pour vendeur %, acheteur %.', v_vendeur_email, v_acheteur_email;
end;
$$;

-- Vérification rapide du jeu de données après exécution :
-- select titre_livre, type_offre, prix_offre from public.livre l
-- join public.offre o using (id_livre) order by titre_livre;
-- select * from public.commande where id_commande = 'b0000000-0000-4000-8000-000000000041';

<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

it('returns the public catalog with books and offers from schema v2', function () {
    $clientId = (string) Str::uuid();
    $sellerId = (string) Str::uuid();
    $bookId = (string) Str::uuid();
    $offerId = (string) Str::uuid();
    $categoryId = DB::table('categorie')->insertGetId([
        'nom_categorie' => 'Roman test',
        'slug_categorie' => 'roman-test-'.strtolower(Str::random(8)),
    ]);

    try {
        DB::table('auth.users')->insert([
            'id' => $clientId,
            'aud' => 'authenticated',
            'role' => 'authenticated',
            'email' => 'catalog.'.$clientId.'@example.com',
            'encrypted_password' => password_hash('password', PASSWORD_BCRYPT),
            'email_confirmed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
            'raw_user_meta_data' => json_encode(['full_name' => 'Catalog Test']),
            'is_anonymous' => false,
        ]);

        DB::table('profil_vendeur')->insert([
            'id_vendeur' => $sellerId,
            'id_client' => $clientId,
            'nom_commercial' => 'Librairie du Quai',
            'statut_vendeur' => 'actif',
            'localisation' => json_encode(['city' => 'Paris', 'country' => 'France']),
            'type_de_structure' => 'boutique',
            'note_moyenne' => 4.8,
        ]);

        DB::table('livre')->insert([
            'id_livre' => $bookId,
            'id_categorie' => $categoryId,
            'cree_par_vendeur' => $sellerId,
            'titre_livre' => "Les Mémoires de l'Ombre",
            'auteur_livre' => 'Madeleine de Varenne',
            'description_livre' => 'Synopsis test',
            'image_couverture' => 'cv1',
            'isbn_livre' => '978-2-1234-5678-9',
        ]);

        DB::table('offre')->insert([
            'id_offre' => $offerId,
            'id_livre' => $bookId,
            'id_vendeur' => $sellerId,
            'type_offre' => 'physique',
            'prix_offre' => 19.90,
            'stock_offre' => 10,
            'statut_offre' => 'active',
            'est_disponible' => true,
        ]);

        $this->getJson('/api/books')
            ->assertOk()
            ->assertJsonPath('0.title', "Les Mémoires de l'Ombre")
            ->assertJsonPath('0.seller.shop_name', 'Librairie du Quai')
            ->assertJsonPath('0.offers.0.id', $offerId);
    } finally {
        DB::table('offre')->where('id_offre', $offerId)->delete();
        DB::table('livre')->where('id_livre', $bookId)->delete();
        DB::table('profil_vendeur')->where('id_vendeur', $sellerId)->delete();
        DB::table('categorie')->where('id', $categoryId)->delete();
        DB::table('client')->where('id', $clientId)->delete();
        DB::table('auth.users')->where('id', $clientId)->delete();
    }
});
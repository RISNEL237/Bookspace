<?php

use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

test('customer can create an order from an offer with a server-side price', function () {
    $clientId = (string) Str::uuid();
    $sellerId = (string) Str::uuid();
    $bookId = (string) Str::uuid();
    $offerId = (string) Str::uuid();
    $categoryId = DB::table('categorie')->insertGetId([
        'nom_categorie' => 'Commande test',
        'slug_categorie' => 'commande-test-'.strtolower(Str::random(8)),
    ]);

    try {
        DB::table('auth.users')->insert([
            'id' => $clientId,
            'aud' => 'authenticated',
            'role' => 'authenticated',
            'email' => 'order.'.$clientId.'@example.com',
            'encrypted_password' => password_hash('password', PASSWORD_BCRYPT),
            'email_confirmed_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
            'raw_user_meta_data' => json_encode(['full_name' => 'Order Test']),
            'is_anonymous' => false,
        ]);

        DB::table('profil_vendeur')->insert([
            'id_vendeur' => $sellerId,
            'id_client' => $clientId,
            'nom_commercial' => 'Vendeur Test',
            'statut_vendeur' => 'actif',
            'localisation' => json_encode(['city' => 'Paris', 'country' => 'France']),
            'type_de_structure' => 'boutique',
        ]);

        DB::table('livre')->insert([
            'id_livre' => $bookId,
            'id_categorie' => $categoryId,
            'cree_par_vendeur' => $sellerId,
            'titre_livre' => 'Livre de commande',
            'auteur_livre' => 'Auteur Test',
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

        $request = Request::create('/api/orders', 'POST', [
            'items' => [[
                'offer_id' => $offerId,
                'quantity' => 2,
                'unit_price' => 9999,
            ]],
        ]);
        $request->attributes->set('id_utilisateur', $clientId);

        $response = app(OrderController::class)->store($request);
        $payload = $response->getData(true);

        expect($response->status())->toBe(201)
            ->and($payload['client_id'])->toBe($clientId)
            ->and((float) $payload['total_amount'])->toBe(39.8)
            ->and($payload['items'][0]['book_id'])->toBe($bookId);

        expect(DB::table('paiement')->where('id_commande', $payload['id'])->value('statut_paiement'))->toBe('en_attente');
    } finally {
        $orderIds = DB::table('commande')->where('id_client', $clientId)->pluck('id_commande');
        DB::table('paiement')->whereIn('id_commande', $orderIds)->delete();
        DB::table('ligne_commande')->whereIn('id_commande', $orderIds)->delete();
        DB::table('commande')->whereIn('id_commande', $orderIds)->delete();
        DB::table('offre')->where('id_offre', $offerId)->delete();
        DB::table('livre')->where('id_livre', $bookId)->delete();
        DB::table('profil_vendeur')->where('id_vendeur', $sellerId)->delete();
        DB::table('categorie')->where('id', $categoryId)->delete();
        DB::table('client')->where('id', $clientId)->delete();
        DB::table('auth.users')->where('id', $clientId)->delete();
    }
});

test('stripe webhook rejects an invalid signature', function () {
    $this->postJson('/api/payments/stripe/webhook', [], [
        'Stripe-Signature' => 't=1,v1=invalid',
    ])->assertBadRequest();
});
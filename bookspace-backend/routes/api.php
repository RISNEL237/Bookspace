<?php

use App\Http\Controllers\Api\MoiController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\DigitalLibraryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API publiques
|--------------------------------------------------------------------------
| Ces endpoints sont accessibles sans authentification pour afficher le
| catalogue et la vitrine des vendeurs.
*/
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/sellers', [SellerController::class, 'index']);
Route::get('/sellers/{seller}', [SellerController::class, 'show']);
Route::post('/payments/stripe/webhook', [PaymentController::class, 'stripeWebhook']);
Route::post('/payments/camerpay/webhook', [PaymentController::class, 'camerpayWebhook']);

/*
|--------------------------------------------------------------------------
| Routes API protégées
|--------------------------------------------------------------------------
| Ces endpoints exigent un token Supabase valide fourni par le middleware
| "supabase.auth".
*/
Route::middleware('supabase.auth')->group(function () {
    // Route de test : retourne l'identité déduite du token.
    Route::get('/moi', MoiController::class);

    // Profil client / vendeur / admin
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::apiResource('addresses', AddressController::class)->only(['index', 'store']);
    Route::get('/library', [DigitalLibraryController::class, 'index']);
    Route::apiResource('profiles', ProfileController::class)->only(['index', 'show', 'update']);
    Route::get('/admin/sellers', [SellerController::class, 'adminIndex']);
    Route::patch('/admin/sellers/{seller}', [SellerController::class, 'update']);

    // Commandes
    Route::get('/seller/orders', [OrderController::class, 'sellerIndex']);
    Route::get('/seller/payouts', [PayoutController::class, 'sellerIndex']);
    Route::apiResource('orders', OrderController::class);
    Route::post('/orders/{order}/checkout-session', [PaymentController::class, 'checkout']);
    Route::post('/orders/{order}/mobile-money', [PaymentController::class, 'mobileMoney']);
    Route::get('/orders/{order}/mobile-money/{reference}', [PaymentController::class, 'mobileMoneyStatus']);

    // Liste d'envies
    Route::apiResource('wishlists', WishlistController::class);
});

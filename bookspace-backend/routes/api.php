<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Api\MoiController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChroniqueController;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\DigitalLibraryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
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
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/sellers', [SellerController::class, 'index']);
Route::get('/sellers/{seller}', [SellerController::class, 'show']);
Route::get('/chroniques', [ChroniqueController::class, 'index']);
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
    Route::patch('/profile/me', [ProfileController::class, 'updateMe']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::apiResource('addresses', AddressController::class)->only(['index', 'store', 'update']);
    Route::get('/library', [DigitalLibraryController::class, 'index']);
    Route::post('/library/{entry}/download-link', [DigitalLibraryController::class, 'download']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{book}', [WishlistController::class, 'destroy']);
    Route::get('/admin/sellers', [SellerController::class, 'adminIndex']);
    Route::patch('/admin/sellers/{seller}', [SellerController::class, 'update']);
    Route::get('/admin/commissions', [CommissionController::class, 'index']);
    Route::patch('/admin/commissions/{commission}', [CommissionController::class, 'update']);
    Route::get('/admin/reports', [ReportController::class, 'index']);
    Route::patch('/admin/reports/{report}', [ReportController::class, 'update']);
    Route::get('/seller/profile', [SellerController::class, 'me']);
    Route::patch('/seller/profile', [SellerController::class, 'updateMe']);
    Route::post('/seller/apply', [SellerController::class, 'apply']);

    // Seuls les vendeurs approuvés peuvent gérer des offres ou des commandes.
    Route::middleware('seller.approved')->group(function () {
        Route::get('/seller/offers', [BookController::class, 'sellerOffers']);
        Route::post('/seller/books', [BookController::class, 'storeSellerBook']);
        Route::get('/seller/orders', [OrderController::class, 'sellerIndex']);
        Route::patch('/seller/order-lines/{line}', [OrderController::class, 'updateSellerLine']);
        Route::get('/seller/payouts', [PayoutController::class, 'sellerIndex']);
    });
    // Le client peut créer et consulter ses commandes. Leur statut
    // est piloté uniquement par les callbacks de paiement et les flux métier.
    Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store']);
    Route::post('/orders/{order}/confirm-delivery', [OrderController::class, 'confirmDelivery']);
    Route::post('/orders/{order}/checkout-session', [PaymentController::class, 'checkout']);
    Route::post('/orders/{order}/mobile-money', [PaymentController::class, 'mobileMoney']);
    Route::get('/orders/{order}/mobile-money/{reference}', [PaymentController::class, 'mobileMoneyStatus']);

});

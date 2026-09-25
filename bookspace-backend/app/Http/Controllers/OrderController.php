<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::query()
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->with('items.offer.book', 'items.offer.seller')
            ->latest('date_commande')
            ->get();

        return response()->json($orders->map(fn (Order $order) => $this->serializeOrder($order))->values());
    }

    public function sellerIndex(Request $request)
    {
        $sellerId = DB::table('profil_vendeur')
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->value('id_vendeur');

        if (! $sellerId) {
            return response()->json(['message' => 'Aucun vendeur associé à ce compte.'], 403);
        }

        $items = OrderItem::query()
            ->whereHas('offer', fn ($query) => $query->where('id_vendeur', $sellerId))
            ->with('order.client', 'offer.book', 'offer.seller')
            ->latest('id_ligne_commande')
            ->get();

        return response()->json($items->map(fn (OrderItem $item) => $this->serializeSellerItem($item))->values());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.offer_id' => ['nullable', 'uuid'],
            'items.*.book_id' => ['nullable', 'uuid'],
            'items.*.seller_id' => ['nullable', 'uuid'],
            'items.*.format' => ['nullable', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'payment_provider' => ['nullable', 'in:paypal,mtn_momo,orange_money'],
            'payment_phone' => ['nullable', 'string', 'max:20'],
        ]);

        $clientId = $request->attributes->get('id_utilisateur');
        if (! $clientId) {
            throw ValidationException::withMessages([
                'client_id' => ['Le client est requis pour créer une commande.'],
            ]);
        }

        $resolvedItems = collect($validated['items'])->map(function (array $item) {
            $offer = $this->resolveOffer($item);

            if (! $offer || $offer->statut_offre !== 'active' || ! $offer->est_disponible) {
                throw ValidationException::withMessages([
                    'items' => ['Une offre de la commande est introuvable ou indisponible.'],
                ]);
            }

            if ($offer->type_offre === 'physique' && $offer->stock_offre !== null && $offer->stock_offre < $item['quantity']) {
                throw ValidationException::withMessages([
                    'items' => ['Le stock disponible est insuffisant pour une offre.'],
                ]);
            }

            return [
                'offer' => $offer,
                'quantity' => (int) $item['quantity'],
                'delivery_mode' => $offer->type_offre === 'numerique'
                    ? 'telechargement'
                    : 'retrait',
            ];
        });

        $total = $resolvedItems->sum(fn (array $item) => $item['offer']->prix_offre * $item['quantity']);

        return DB::transaction(function () use ($clientId, $validated, $resolvedItems, $total) {
            $order = Order::create([
                'id_commande' => (string) Str::uuid(),
                'id_client' => $clientId,
                'statut_commande' => 'en_attente',
                'montant_total_commande' => number_format($total, 0, '.', ''),
            ]);

            foreach ($resolvedItems as $item) {
                OrderItem::create([
                    'id_ligne_commande' => (string) Str::uuid(),
                    'id_commande' => $order->id_commande,
                    'id_offre' => $item['offer']->id_offre,
                    'quantite_commande' => $item['quantity'],
                    'prix_unitaire_fige' => number_format($item['offer']->prix_offre, 0, '.', ''),
                    'mode_livraison' => $item['delivery_mode'],
                    'statut_ligne_commande' => 'en_attente_paiement',
                ]);
            }

            Payment::create([
                'id_paiement' => (string) Str::uuid(),
                'id_commande' => $order->id_commande,
                'fournisseur_paiement' => $validated['payment_provider'] ?? 'mtn_momo',
                'tel_paiement' => $validated['payment_phone'] ?? null,
                'montant_paiement' => number_format($total, 2, '.', ''),
                'statut_paiement' => 'en_attente',
            ]);

            return response()->json($this->serializeOrder($order->load('items.offer.book', 'items.offer.seller')), 201);
        });
    }

    public function show(Order $order)
    {
        $this->ensureClientCanView($order);

        return response()->json($this->serializeOrder($order->load('items.offer.book', 'items.offer.seller')));
    }

    public function updateSellerLine(Request $request, OrderItem $line)
    {
        $sellerId = DB::table('profil_vendeur')->where('id_client', $request->attributes->get('id_utilisateur'))->value('id_vendeur');
        abort_unless($sellerId && $line->offer()->where('id_vendeur', $sellerId)->exists(), 403, 'Cette ligne ne relève pas de votre boutique.');
        abort_unless($line->order()->value('statut_commande') === 'payee', 422, 'Le paiement de la commande doit être confirmé avant son traitement.');
        $validated = $request->validate(['status' => ['required', 'in:en_preparation,en_expedition']]);
        $allowed = $line->statut_ligne_commande === 'payee' && $validated['status'] === 'en_preparation'
            || $line->statut_ligne_commande === 'en_preparation' && $validated['status'] === 'en_expedition';
        abort_unless($allowed, 422, 'Cette transition de statut est invalide.');

        DB::transaction(function () use ($line, $validated) {
            $line->update(['statut_ligne_commande' => $validated['status']]);
            $order = $line->order()->with('items')->first();
            $bookTitle = $line->offer()->with('book')->first()?->book?->titre_livre ?? 'Votre livre';
            $statusMessage = $validated['status'] === 'en_preparation'
                ? "Le vendeur prépare « {$bookTitle} » pour votre commande."
                : "Le vendeur a expédié « {$bookTitle} ».";
            app(NotificationService::class)->sendOnce(
                $order->id_client,
                $validated['status'] === 'en_preparation' ? 'commande_preparation' : 'commande_expediee',
                $statusMessage,
                $line->id_ligne_commande
            );
            if ($order->items->every(fn ($item) => in_array($item->statut_ligne_commande, ['en_expedition', 'livree', 'fond_reverse', 'disponible_telechargement', 'remboursee'], true))) {
                $order->update(['statut_commande' => 'expediee']);
            }
        });

        return response()->json($this->serializeSellerItem($line->fresh()->load('order.client', 'offer.book', 'offer.seller')));
    }

    public function confirmDelivery(Request $request, Order $order)
    {
        abort_unless($order->id_client === $request->attributes->get('id_utilisateur'), 403, 'Cette commande ne vous appartient pas.');
        $validated = $request->validate(['line_id' => ['required', 'uuid']]);
        $line = $order->items()->where('id_ligne_commande', $validated['line_id'])->firstOrFail();
        abort_unless($line->statut_ligne_commande === 'en_expedition', 422, 'Seule une ligne expédiée peut être marquée livrée.');

        DB::transaction(function () use ($line, $order) {
            $line->update(['statut_ligne_commande' => 'livree']);
            $sellerClientId = $line->offer()->with('seller')->first()?->seller?->id_client;
            if ($sellerClientId) {
                app(NotificationService::class)->sendOnce(
                    $sellerClientId,
                    'commande_reception_confirmee',
                    'Le client a confirmé la réception de sa commande.',
                    $line->id_ligne_commande
                );
            }
            if ($order->items()->whereNotIn('statut_ligne_commande', ['livree', 'fond_reverse', 'remboursee', 'disponible_telechargement'])->doesntExist()) {
                $order->update(['statut_commande' => 'livree']);
                app(NotificationService::class)->sendOnce(
                    $order->id_client,
                    'commande_livree',
                    'Toutes les lignes physiques de votre commande ont été livrées.',
                    $order->id_commande
                );
            }
        });

        return response()->json(['status' => 'livree']);
    }

    private function resolveOffer(array $item): ?Offer
    {
        if (! empty($item['offer_id'])) {
            return Offer::find($item['offer_id']);
        }

        if (empty($item['book_id']) || empty($item['seller_id'])) {
            return null;
        }

        $type = preg_match('/ebook|epub|pdf|numerique/i', $item['format'] ?? '')
            ? 'numerique'
            : 'physique';

        return Offer::query()
            ->where('id_livre', $item['book_id'])
            ->where('id_vendeur', $item['seller_id'])
            ->where('type_offre', $type)
            ->first();
    }

    private function ensureClientCanView(Order $order): void
    {
        abort_unless($order->id_client === request()->attributes->get('id_utilisateur'), 403, 'Cette commande ne vous appartient pas.');
    }

    private function serializeOrder(Order $order): array
    {
        return [
            'id' => $order->id_commande,
            'client_id' => $order->id_client,
            'status' => match ($order->statut_commande) {
                'payee' => 'paid',
                'expediee' => 'shipped',
                'livree' => 'delivered',
                'annulee' => 'cancelled',
                'remboursee' => 'refunded',
                default => 'pending',
            },
            'total_amount' => $order->montant_total_commande,
            'created_at' => $order->date_commande,
            'items' => $order->items->map(fn (OrderItem $item) => [
                'id' => $item->id_ligne_commande,
                'order_id' => $item->id_commande,
                'book_id' => $item->offer?->book?->id_livre,
                'seller_id' => $item->offer?->seller?->id_vendeur,
                'format' => $item->offer?->type_offre === 'numerique' ? 'E-pub / PDF' : 'Livre broché',
                'quantity' => $item->quantite_commande,
                'unit_price' => $item->prix_unitaire_fige,
                'delivery_mode' => $item->mode_livraison,
                'shipping_fee' => 0,
                'status' => $item->statut_ligne_commande,
                'book' => $item->offer?->book ? [
                    'id' => $item->offer->book->id_livre,
                    'title' => $item->offer->book->titre_livre,
                    'author' => $item->offer->book->auteur_livre,
                    'cover_style' => $item->offer->book->image_couverture,
                ] : null,
                'seller' => $item->offer?->seller ? [
                    'id' => $item->offer->seller->id_vendeur,
                    'shop_name' => $item->offer->seller->nom_commercial,
                ] : null,
            ])->values(),
        ];
    }

    private function serializeSellerItem(OrderItem $item): array
    {
        return [
            'id' => $item->id_ligne_commande,
            'order_id' => $item->id_commande,
            'quantity' => $item->quantite_commande,
            'unit_price' => $item->prix_unitaire_fige,
            'delivery_mode' => $item->mode_livraison,
            'shipping_fee' => 0,
            'status' => $item->statut_ligne_commande,
            'book' => $item->offer?->book ? [
                'id' => $item->offer->book->id_livre,
                'title' => $item->offer->book->titre_livre,
            ] : null,
            'order' => [
                'id' => $item->order?->id_commande,
                'client' => ['full_name' => $item->order?->client?->nom_complet],
            ],
        ];
    }
}

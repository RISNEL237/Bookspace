<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellerController extends Controller
{
    /**
     * Display all approved sellers.
     */
    public function index()
    {
        $sellers = Seller::query()
            ->where('statut_vendeur', 'actif')
            ->with(['offers.book.category', 'offers.book.offers.seller'])
            ->get();

        return response()->json($sellers->map(fn (Seller $seller) => $this->serializeSeller($seller))->values());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Seller $seller)
    {
        $seller->load(['offers.book.category', 'offers.book.offers.seller']);

        return response()->json($this->serializeSeller($seller));
    }

    public function adminIndex(Request $request)
    {
        $this->ensureAdmin($request);

        return response()->json(Seller::query()->latest('date_creation')->get()->map(fn (Seller $seller) => [
            ...$this->serializeSeller($seller),
            'siret' => $seller->numero_commercial,
            'documents' => $seller->piece_identite ? [$seller->piece_identite] : [],
        ])->values());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seller $seller)
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'kyb_status' => ['required', 'in:pending,approved,rejected'],
        ]);

        $status = match ($validated['kyb_status']) {
            'approved' => 'actif',
            'rejected' => 'suspendu',
            default => 'non_verifie',
        };

        $seller->update(['statut_vendeur' => $status]);

        return response()->json([
            ...$this->serializeSeller($seller->fresh()),
            'siret' => $seller->numero_commercial,
            'documents' => $seller->piece_identite ? [$seller->piece_identite] : [],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seller $seller)
    {
        //
    }

    protected function serializeSeller(Seller $seller): array
    {
        $offers = $seller->offers ?? collect();
        $books = $offers->pluck('book')->filter()->unique('id_livre')->values();

        return [
            'id' => $seller->id_vendeur,
            'shop_name' => $seller->nom_commercial,
            'legal_type' => $seller->type_de_structure,
            'country' => data_get($seller->localisation, 'country'),
            'city' => data_get($seller->localisation, 'city'),
            'description' => $seller->description_boutique,
            'kyb_status' => match ($seller->statut_vendeur) {
                'actif' => 'approved',
                'suspendu' => 'rejected',
                default => 'pending',
            },
            'rating' => (float) $seller->note_moyenne,
            'books' => $books->map(function ($book) {
                $offers = $book->offers->where('statut_offre', 'active')->where('est_disponible', true);
                return [
                    'id' => $book->id_livre,
                    'title' => $book->titre_livre,
                    'author' => $book->auteur_livre,
                    'genre' => $book->category?->nom_categorie ?? 'Divers',
                    'pricePaper' => (float) ($offers->firstWhere('type_offre', 'physique')?->prix_offre ?? 0),
                    'priceEbook' => (float) ($offers->firstWhere('type_offre', 'numerique')?->prix_offre ?? 0),
                    'cover' => $book->image_couverture ?? 'cv1',
                    'isPublished' => $offers->isNotEmpty(),
                ];
            })->values(),
        ];
    }

    private function ensureAdmin(Request $request): void
    {
        $isAdmin = DB::table('client')
            ->where('id', $request->attributes->get('id_utilisateur'))
            ->value('est_admin');

        abort_unless((bool) $isAdmin, 403, 'Accès réservé aux administrateurs.');
    }
}

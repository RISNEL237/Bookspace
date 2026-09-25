<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Offer;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookController extends Controller
{
    public function storeSellerBook(Request $request)
    {
        $seller = Seller::query()->where('id_client', $request->attributes->get('id_utilisateur'))->firstOrFail();
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categorie,id'],
            'description' => ['nullable', 'string', 'max:10000'],
            'cover' => ['nullable', 'string', 'max:2048'],
            'isbn' => ['nullable', 'string', 'max:20'],
            'offers' => ['required', 'array', 'min:1'],
            'offers.*.type' => ['required', 'in:physique,numerique'],
            'offers.*.price' => ['required', 'numeric', 'min:1'],
            'offers.*.stock' => ['nullable', 'integer', 'min:0'],
            'offers.*.digital_file' => ['nullable', 'string', 'max:2048'],
            'offers.*.rights_status' => ['nullable', 'in:domaine_public,droits_detenus'],
            'offers.*.rights_proof' => ['nullable', 'string', 'max:2048'],
        ]);

        foreach ($validated['offers'] as $offer) {
            if (! empty($offer['rights_proof'])) {
                $proofPath = str_replace('\\', '/', trim($offer['rights_proof']));
                if (str_starts_with($proofPath, '/') || Str::contains($proofPath, ['..', '?', '#']) || filter_var($proofPath, FILTER_VALIDATE_URL) || ! str_starts_with($proofPath, $seller->id_client.'/')) {
                    throw ValidationException::withMessages(['offers' => ['Le justificatif doit être un chemin interne de votre espace Storage privé.']]);
                }
            }
            if ($offer['type'] === 'physique' && ! array_key_exists('stock', $offer)) {
                throw ValidationException::withMessages(['offers' => ['Le stock est requis pour une offre physique.']]);
            }
            if ($offer['type'] === 'numerique' && empty($offer['digital_file'])) {
                throw ValidationException::withMessages(['offers' => ['Un chemin de fichier privÃ© est requis pour une offre numÃ©rique.']]);
            }
            if ($offer['type'] === 'numerique' && empty($offer['rights_status'])) {
                throw ValidationException::withMessages(['offers' => ['Le statut des droits est requis pour une offre numÃ©rique.']]);
            }
            if ($offer['type'] === 'numerique') {
                $filePath = str_replace('\\', '/', trim($offer['digital_file']));
                if (
                    str_starts_with($filePath, '/') ||
                    Str::contains($filePath, ['..', '?', '#']) ||
                    filter_var($filePath, FILTER_VALIDATE_URL) ||
                    ! str_starts_with($filePath, $seller->id_client.'/')
                ) {
                    throw ValidationException::withMessages(['offers' => ['Le fichier doit être référencé par un chemin interne du bucket privé.']]);
                }
            }
        }

        foreach ($validated['offers'] as $offer) {
            if (! empty($offer['rights_proof'])) {
                $proofPath = str_replace('\\', '/', trim($offer['rights_proof']));
                if (str_starts_with($proofPath, '/') || Str::contains($proofPath, ['..', '?', '#']) || filter_var($proofPath, FILTER_VALIDATE_URL) || ! str_starts_with($proofPath, $seller->id_client.'/')) {
                    throw ValidationException::withMessages(['offers' => ['Le justificatif doit être un chemin interne de votre espace Storage privé.']]);
                }
            }
        }
        return DB::transaction(function () use ($validated, $seller) {
            $book = Book::create([
                'id_livre' => (string) Str::uuid(),
                'id_categorie' => $validated['category_id'] ?? null,
                'cree_par_vendeur' => $seller->id_vendeur,
                'titre_livre' => $validated['title'],
                'auteur_livre' => $validated['author'],
                'description_livre' => $validated['description'] ?? null,
                'image_couverture' => $validated['cover'] ?? null,
                'isbn_livre' => $validated['isbn'] ?? null,
            ]);
            foreach ($validated['offers'] as $item) {
                Offer::create([
                    'id_offre' => (string) Str::uuid(),
                    'id_livre' => $book->id_livre,
                    'id_vendeur' => $seller->id_vendeur,
                    'type_offre' => $item['type'],
                    'prix_offre' => $item['price'],
                    'stock_offre' => $item['type'] === 'physique' ? $item['stock'] : null,
                    'fichier_numerique' => $item['type'] === 'numerique' ? $item['digital_file'] : null,
                    'statut_droits' => $item['rights_status'] ?? null,
                    'justificatif_droits' => $item['rights_proof'] ?? null,
                    'statut_offre' => 'active',
                    'est_disponible' => true,
                ]);
            }

            return response()->json(['id' => $book->id_livre], 201);
        });
    }

    public function sellerOffers(Request $request)
    {
        $sellerId = DB::table('profil_vendeur')
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->value('id_vendeur');

        abort_unless($sellerId, 403, 'Aucun vendeur associÃ© Ã  ce compte.');

        return response()->json(Offer::query()
            ->where('id_vendeur', $sellerId)
            ->with('book.category')
            ->latest('date_creation')
            ->get()
            ->map(fn ($offer) => [
                'id' => $offer->id_offre,
                'type' => $offer->type_offre,
                'price' => (float) $offer->prix_offre,
                'stock' => $offer->stock_offre,
                'status' => $offer->statut_offre,
                'available' => $offer->est_disponible,
                'file' => $offer->fichier_numerique,
                'book' => $offer->book ? [
                    'id' => $offer->book->id_livre,
                    'title' => $offer->book->titre_livre,
                    'author' => $offer->book->auteur_livre,
                    'isbn' => $offer->book->isbn_livre,
                    'cover' => $offer->book->image_couverture,
                ] : null,
            ])->values());
    }

    /**
     * Display the public catalog.
     */
    public function index()
    {
        $books = Book::query()
            ->with(['category', 'offers.seller'])
            ->whereHas('offers', fn ($query) => $query
                ->where('statut_offre', 'active')
                ->where('est_disponible', true)
                ->whereHas('seller', fn ($seller) => $seller->where('statut_vendeur', 'actif')))
            ->get();

        return response()->json($books->map(fn (Book $book) => $this->serializeBook($book))->values());
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        abort_unless($book->offers()
            ->where('statut_offre', 'active')
            ->where('est_disponible', true)
            ->whereHas('seller', fn ($query) => $query->where('statut_vendeur', 'actif'))
            ->exists(), 404);

        return response()->json($this->serializeBook($book->load(['category', 'offers.seller'])));
    }

    protected function serializeBook(Book $book): array
    {
        $offers = $book->offers
            ->where('statut_offre', 'active')
            ->where('est_disponible', true)
            ->filter(fn ($offer) => $offer->seller?->statut_vendeur === 'actif')
            ->values();
        $physical = $offers->firstWhere('type_offre', 'physique');
        $digital = $offers->firstWhere('type_offre', 'numerique');
        $seller = $offers->first()?->seller;

        return [
            'id' => $book->id_livre,
            'title' => $book->titre_livre,
            'author' => $book->auteur_livre,
            'genre' => $book->category?->nom_categorie ?? 'Divers',
            'isbn' => $book->isbn_livre,
            'synopsis' => $book->description_livre,
            'cover_style' => $book->image_couverture ?? 'cv1',
            'price_paper' => $physical?->prix_offre,
            'price_ebook' => $digital?->prix_offre,
            'stock_paper' => $physical?->stock_offre,
            'rating' => $seller?->note_moyenne ?? 0,
            'reviews_count' => 0,
            'is_published' => $offers->isNotEmpty(),
            'seller_id' => $seller?->id_vendeur,
            'seller' => $seller ? [
                'id' => $seller->id_vendeur,
                'shop_name' => $seller->nom_commercial,
                'city' => data_get($seller->localisation, 'city'),
                'country' => data_get($seller->localisation, 'country'),
            ] : null,
            'offers' => $offers->map(fn ($offer) => [
                'id' => $offer->id_offre,
                'type' => $offer->type_offre,
                'price' => $offer->prix_offre,
                'stock' => $offer->stock_offre,
                'seller_id' => $offer->id_vendeur,
                'seller' => $offer->seller ? [
                    'id' => $offer->seller->id_vendeur,
                    'name' => $offer->seller->nom_commercial,
                    'city' => data_get($offer->seller->localisation, 'city'),
                ] : null,
            ])->values(),
        ];
    }
}

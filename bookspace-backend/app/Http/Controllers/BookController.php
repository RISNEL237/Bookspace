<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display the public catalog.
     */
    public function index()
    {
        $books = Book::query()
            ->with(['category', 'offers.seller'])
            ->whereHas('offers', fn ($query) => $query
                ->where('statut_offre', 'active')
                ->where('est_disponible', true))
            ->get();

        return response()->json($books->map(fn (Book $book) => $this->serializeBook($book))->values());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $book = Book::create($request->all());

        return response()->json($book->load('seller'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        return response()->json($this->serializeBook($book->load(['category', 'offers.seller'])));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        $book->update($request->all());

        return $book->fresh()->load('seller');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->noContent();
    }

    protected function serializeBook(Book $book): array
    {
        $offers = $book->offers
            ->where('statut_offre', 'active')
            ->where('est_disponible', true)
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

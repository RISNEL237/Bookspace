<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        return DB::table('liste_envies as w')
            ->join('livre as b', 'b.id_livre', '=', 'w.id_livre')
            ->leftJoin('categorie as c', 'c.id', '=', 'b.id_categorie')
            ->where('w.id_client', $request->attributes->get('id_utilisateur'))
            ->orderByDesc('w.date_ajout')
            ->get(['w.id', 'w.date_ajout', 'b.id_livre', 'b.titre_livre', 'b.auteur_livre', 'b.description_livre', 'b.image_couverture', 'b.isbn_livre', 'c.nom_categorie'])
            ->map(fn ($item) => [
                'wishlist_id' => $item->id,
                'added_at' => $item->date_ajout,
                'id' => $item->id_livre,
                'title' => $item->titre_livre,
                'author' => $item->auteur_livre,
                'synopsis' => $item->description_livre,
                'cover' => $item->image_couverture,
                'isbn' => $item->isbn_livre,
                'genre' => $item->nom_categorie ?? 'Divers',
            ])->values();
    }

    public function store(Request $request)
    {
        $validated = $request->validate(['book_id' => ['required', 'uuid', 'exists:livre,id_livre']]);
        $clientId = $request->attributes->get('id_utilisateur');
        $id = DB::table('liste_envies')->where('id_client', $clientId)->where('id_livre', $validated['book_id'])->value('id');
        if (! $id) {
            $id = (string) Str::uuid();
            DB::table('liste_envies')->insert(['id' => $id, 'id_client' => $clientId, 'id_livre' => $validated['book_id'], 'date_ajout' => now()]);
        }

        return response()->json(['id' => $id], 201);
    }

    public function destroy(Request $request, string $book)
    {
        $deleted = DB::table('liste_envies')->where('id_client', $request->attributes->get('id_utilisateur'))->where('id_livre', $book)->delete();
        abort_unless($deleted, 404);

        return response()->noContent();
    }
}

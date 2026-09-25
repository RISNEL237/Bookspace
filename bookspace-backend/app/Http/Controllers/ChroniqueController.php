<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ChroniqueController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('chronique as a')
            ->leftJoin('profil_vendeur as s', 's.id_vendeur', '=', 'a.id_vendeur')
            ->leftJoin('livre as b', 'b.id_livre', '=', 'a.id_livre')
            ->where('a.statut', 'publiee')
            ->whereNotNull('a.date_publication')
            ->where('a.date_publication', '<=', now())
            ->orderByDesc('a.date_publication')
            ->get(['a.id', 'a.titre', 'a.slug', 'a.resume', 'a.contenu', 'a.image', 'a.date_publication', 's.nom_commercial', 'b.id_livre', 'b.titre_livre', 'b.auteur_livre', 'b.image_couverture'])
            ->map(fn ($article) => [
                'id' => $article->id,
                'title' => $article->titre,
                'slug' => $article->slug,
                'excerpt' => $article->resume,
                'content' => $article->contenu,
                'image' => $article->image,
                'published_at' => $article->date_publication,
                'seller' => $article->nom_commercial,
                'book' => $article->id_livre ? ['id' => $article->id_livre, 'title' => $article->titre_livre, 'author' => $article->auteur_livre, 'cover' => $article->image_couverture] : null,
            ])->values());
    }
}

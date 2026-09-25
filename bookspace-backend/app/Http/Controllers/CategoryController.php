<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('categorie')->orderBy('nom_categorie')->get(['id', 'nom_categorie', 'slug_categorie'])->map(fn ($category) => [
            'id' => $category->id,
            'name' => $category->nom_categorie,
            'slug' => $category->slug_categorie,
        ]));
    }
}

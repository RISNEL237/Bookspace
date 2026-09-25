<?php

namespace App\Http\Controllers;

use App\Models\DigitalLibraryEntry;
use Illuminate\Http\Request;

class DigitalLibraryController extends Controller
{
    public function index(Request $request)
    {
        return DigitalLibraryEntry::query()
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->where('est_masquee', false)
            ->with('offer.book.category', 'offer.seller')
            ->latest('date_ajout')
            ->get()
            ->map(fn (DigitalLibraryEntry $entry) => [
                'id' => $entry->id,
                'title' => $entry->offer?->book?->titre_livre,
                'author' => $entry->offer?->book?->auteur_livre,
                'cover' => $entry->offer?->book?->image_couverture ?? 'cv1',
                'format' => strtoupper($entry->offer?->type_offre ?? 'numerique'),
                'seller' => $entry->offer?->seller?->nom_commercial,
                'purchased' => $entry->date_ajout,
                'download_available' => true,
            ])->values();
    }
}
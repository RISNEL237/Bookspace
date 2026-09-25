<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Retourne le profil courant authentifié.
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => Client::findOrFail($request->attributes->get('id_utilisateur')),
        ]);
    }

    public function updateMe(Request $request)
    {
        $profile = Client::findOrFail($request->attributes->get('id_utilisateur'));

        $validated = $request->validate([
            'nom_complet' => ['sometimes', 'string', 'max:255'],
            'tel_client' => ['sometimes', 'nullable', 'string', 'max:30'],
        ]);

        $profile->update($validated);

        return response()->json($profile->fresh());
    }
}

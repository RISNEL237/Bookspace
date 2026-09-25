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

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(Client $profile)
    {
        return response()->json($profile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $profile)
    {
        abort_unless($profile->id === $request->attributes->get('id_utilisateur'), 403);

        $validated = $request->validate([
            'nom_complet' => ['sometimes', 'string', 'max:255'],
            'tel_client' => ['sometimes', 'nullable', 'string', 'max:30'],
        ]);

        $profile->update($validated);

        return response()->json($profile->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $profile)
    {
        //
    }
}

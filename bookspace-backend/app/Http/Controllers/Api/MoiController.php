<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

/**
 * Contrôleur de test pour vérifier que la chaîne complète fonctionne :
 * token Supabase → middleware → lecture en base via Laravel.
 */
class MoiController extends Controller
{
    public function __invoke(Request $request)
    {
        $idUtilisateur = $request->attributes->get('id_utilisateur');

        $client = Client::find($idUtilisateur);

        if (! $client) {
            return response()->json(['message' => 'Client introuvable en base.'], 404);
        }

        return response()->json([
            'id' => $client->id,
            'email' => $client->email,
            'nom_complet' => $client->nom_complet,
            'statut_client' => $client->statut_client,
            'est_admin' => $client->est_admin,
        ]);
    }
}

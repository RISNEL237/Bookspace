<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class RequireApprovedSeller
{
    public function handle(Request $request, Closure $next): Response
    {
        $sellerIsActive = DB::table('profil_vendeur')
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->where('statut_vendeur', 'actif')
            ->exists();

        abort_unless($sellerIsActive, 403, 'Un profil vendeur approuvé est nécessaire.');

        return $next($request);
    }
}

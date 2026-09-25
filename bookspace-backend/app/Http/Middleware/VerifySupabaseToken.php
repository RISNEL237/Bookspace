<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

/**
 * Vérifie qu'une requête contient un token Supabase valide
 * (en-tête "Authorization: Bearer <token>").
 *
 * Supabase signe ses tokens avec des clés ASYMÉTRIQUES (JWKS) :
 * la clé PUBLIQUE nécessaire à la vérification est récupérée sur
 * une URL publique de Supabase — jamais besoin de stocker un secret
 * partagé côté Laravel. On met juste cette clé en cache 1h pour ne
 * pas la re-télécharger à chaque requête.
 */
class VerifySupabaseToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Token manquant.'], 401);
        }

        try {
            $cles = $this->recupererClesPubliques();
            $decode = JWT::decode($token, $cles);

            // "iss" = qui a émis le token (doit être CE projet Supabase précis)
            $issuerAttendu = rtrim(config('services.supabase.url'), '/').'/auth/v1';
            if (($decode->iss ?? null) !== $issuerAttendu) {
                return response()->json(['message' => 'Token émis par un projet Supabase inconnu.'], 401);
            }

            // "aud" = à qui le token est destiné (Supabase met "authenticated"
            // pour tout utilisateur connecté normalement)
            if (($decode->aud ?? null) !== 'authenticated') {
                return response()->json(['message' => 'Token non destiné à un utilisateur authentifié.'], 401);
            }

            // On attache l'identité vérifiée à la requête, utilisable
            // ensuite dans n'importe quel contrôleur via $request->attributes.
            $request->attributes->set('id_utilisateur', $decode->sub);
            $request->attributes->set('email_utilisateur', $decode->email ?? null);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 401);
        }

        return $next($request);
    }

    /**
     * Récupère (et met en cache 1h) le jeu de clés publiques de
     * vérification de CE projet Supabase précis.
     *
     * @return array<string, \Firebase\JWT\Key>
     */
    private function recupererClesPubliques(): array
    {
        $urlJwks = rtrim(config('services.supabase.url'), '/').'/auth/v1/.well-known/jwks.json';

        $jwks = Cache::remember('supabase_jwks', now()->addHour(), function () use ($urlJwks) {
            return Http::get($urlJwks)->throw()->json();
        });

        return JWK::parseKeySet($jwks);
    }
}

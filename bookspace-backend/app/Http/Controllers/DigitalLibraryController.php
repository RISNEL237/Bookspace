<?php

namespace App\Http\Controllers;

use App\Models\DigitalLibraryEntry;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

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
                'download_available' => filled($entry->offer?->fichier_numerique)
                    && filled(config('services.supabase.url'))
                    && filled(config('services.supabase.service_role_key')),
            ])->values();
    }

    public function download(Request $request, string $entryId)
    {
        $clientId = $request->attributes->get('id_utilisateur');
        $entry = DigitalLibraryEntry::query()
            ->where('id', $entryId)
            ->where('id_client', $clientId)
            ->with('offer')
            ->firstOrFail();

        abort_unless($entry->offer?->type_offre === 'numerique', 404);

        $paidLineExists = OrderItem::query()
            ->where('id_ligne_commande', $entry->id_ligne_commande)
            ->where('id_offre', $entry->id_offre)
            ->whereIn('statut_ligne_commande', ['disponible_telechargement', 'fond_reverse'])
            ->whereHas('order', fn ($query) => $query->where('id_client', $clientId))
            ->exists();

        abort_unless($paidLineExists, 403, 'Aucun achat payé ne donne accès à ce fichier.');
        abort_unless(filled($entry->offer->fichier_numerique), 404, 'Fichier numérique indisponible.');

        $baseUrl = rtrim((string) config('services.supabase.url'), '/');
        $serviceKey = (string) config('services.supabase.service_role_key');
        $bucket = (string) config('services.supabase.digital_bucket');
        abort_if($baseUrl === '' || $serviceKey === '' || $bucket === '', 503, 'Le stockage privé des livres numériques n’est pas configuré.');

        $path = str_replace('\\', '/', trim($entry->offer->fichier_numerique));
        abort_if(
            Str::startsWith($path, '/') ||
            Str::contains($path, ['..', '?', '#']) ||
            filter_var($path, FILTER_VALIDATE_URL),
            422,
            'Le fichier doit être référencé par un chemin interne du bucket privé.'
        );

        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $endpoint = $baseUrl.'/storage/v1/object/sign/'.rawurlencode($bucket).'/'.$encodedPath;
        $ttl = max(30, min(300, (int) config('services.supabase.signed_url_ttl', 60)));
        $response = Http::timeout(10)
            ->withHeaders([
                'apikey' => $serviceKey,
                'Authorization' => 'Bearer '.$serviceKey,
            ])
            ->post($endpoint, ['expiresIn' => $ttl]);

        if ($response->failed() || ! $response->json('signedURL')) {
            report(new \RuntimeException('Supabase Storage n’a pas pu signer un lien numérique.'));

            return response()->json(['message' => 'Impossible de préparer le lien de téléchargement.'], 502);
        }

        $signedPath = (string) $response->json('signedURL');
        $url = Str::startsWith($signedPath, ['http://', 'https://'])
            ? $signedPath
            : $baseUrl.'/storage/v1/'.ltrim($signedPath, '/');

        return response()->json([
            'url' => $url,
            'expires_at' => now()->addSeconds($ttl)->toIso8601String(),
        ])->header('Cache-Control', 'private, no-store');
    }
}

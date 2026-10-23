<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    public function index(string $book)
    {
        $reviews = DB::table('avis as a')
            ->join('ligne_commande as lc', 'lc.id_ligne_commande', '=', 'a.id_ligne_commande')
            ->join('offre as o', 'o.id_offre', '=', 'lc.id_offre')
            ->join('client as c', 'c.id', '=', 'a.id_client')
            ->where('o.id_livre', $book)
            ->orderByDesc('a.date_avis')
            ->get(['a.note_avis', 'a.commentaire_avis', 'a.date_avis', 'c.nom_complet'])
            ->map(fn ($review) => [
                'rating' => (int) $review->note_avis,
                'comment' => $review->commentaire_avis,
                'created_at' => $review->date_avis,
                'author' => $this->displayName($review->nom_complet),
                'verified' => true,
            ]);

        return response()->json([
            'rating' => $reviews->isEmpty() ? 0 : round($reviews->avg('rating'), 1),
            'count' => $reviews->count(),
            'reviews' => $reviews->values(),
        ]);
    }

    public function store(Request $request, Order $order)
    {
        $clientId = $request->attributes->get('id_utilisateur');
        abort_unless($order->id_client === $clientId, 403, 'Cette commande ne vous appartient pas.');

        $validated = $request->validate([
            'line_id' => ['required', 'uuid'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $reviewId = (string) Str::uuid();

        try {
            DB::transaction(function () use ($validated, $order, $clientId, $reviewId) {
                $line = DB::table('ligne_commande as lc')
                    ->join('offre as o', 'o.id_offre', '=', 'lc.id_offre')
                    ->where('lc.id_ligne_commande', $validated['line_id'])
                    ->where('lc.id_commande', $order->id_commande)
                    ->lockForUpdate()
                    ->first(['lc.id_ligne_commande', 'lc.id_offre', 'lc.statut_ligne_commande', 'o.type_offre']);

                abort_unless($line, 404, 'Article introuvable dans cette commande.');
                $eligible = $line->statut_ligne_commande === 'livree'
                    || ($line->type_offre === 'numerique' && in_array($line->statut_ligne_commande, ['disponible_telechargement', 'fond_reverse'], true));
                abort_unless($eligible, 422, 'Cet article ne peut être évalué qu’après sa livraison ou sa mise à disposition numérique.');
                abort_if(DB::table('avis')->where('id_ligne_commande', $line->id_ligne_commande)->exists(), 409, 'Un avis a déjà été déposé pour cet article.');

                DB::table('avis')->insert([
                    'id_avis' => $reviewId,
                    'id_ligne_commande' => $line->id_ligne_commande,
                    'id_client' => $clientId,
                    'id_offre' => $line->id_offre,
                    'note_avis' => $validated['rating'],
                    'commentaire_avis' => $validated['comment'] ?? null,
                    'date_avis' => now(),
                ]);
            });
        } catch (QueryException $exception) {
            $isDuplicateReview = in_array((string) $exception->getCode(), ['23000', '23505'], true)
                && str_contains(strtolower($exception->getMessage()), 'id_ligne_commande');

            if (! $isDuplicateReview) {
                throw $exception;
            }

            abort(409, 'Un avis a déjà été déposé pour cet article.');
        }

        return response()->json(['id' => $reviewId, 'rating' => (int) $validated['rating']], 201);
    }

    private function displayName(?string $fullName): string
    {
        $firstName = preg_split('/\s+/', trim((string) $fullName))[0] ?? '';

        return $firstName !== '' ? $firstName : 'Acheteur vérifié';
    }
}

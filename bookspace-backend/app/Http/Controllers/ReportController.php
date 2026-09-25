<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        return DB::table('signalement_offre as r')
            ->join('offre as o', 'o.id_offre', '=', 'r.id_offre')
            ->join('livre as b', 'b.id_livre', '=', 'o.id_livre')
            ->orderByDesc('r.date_signalement')
            ->get(['r.id_signalement', 'r.id_offre', 'r.motif_signalement', 'r.description_signalement', 'r.statut_signalement', 'r.date_signalement', 'b.titre_livre'])
            ->map(fn ($report) => [
                'id' => $report->id_signalement,
                'offer_id' => $report->id_offre,
                'title' => $report->titre_livre,
                'reason' => $report->motif_signalement,
                'description' => $report->description_signalement,
                'status' => $report->statut_signalement,
                'created_at' => $report->date_signalement,
            ]);
    }

    public function update(Request $request, string $report)
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'status' => ['required', 'in:en_attente,en_cours,action_prise,classe_sans_suite'],
            'mask_offer' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        DB::transaction(function () use ($request, $report, $validated) {
            $this->setRequestClaims($request->attributes->get('id_utilisateur'));
            $item = DB::table('signalement_offre')->where('id_signalement', $report)->lockForUpdate()->first();
            abort_unless($item, 404);
            if ($validated['mask_offer'] ?? false) {
                DB::table('offre')->where('id_offre', $item->id_offre)->update(['statut_offre' => 'masquee']);
            }
            DB::table('signalement_offre')->where('id_signalement', $report)->update([
                'statut_signalement' => $validated['status'],
                'notes_admin_signalement' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json(['updated' => true]);
    }

    private function setRequestClaims(string $userId): void
    {
        $claims = json_encode(['sub' => $userId, 'role' => 'authenticated', 'aud' => 'authenticated'], JSON_THROW_ON_ERROR);
        DB::select(
            "select set_config('request.jwt.claim.sub', ?, true), set_config('request.jwt.claim.role', ?, true), set_config('request.jwt.claims', ?, true)",
            [$userId, 'authenticated', $claims]
        );
    }

    private function ensureAdmin(Request $request): void
    {
        $isAdmin = DB::table('client')->where('id', $request->attributes->get('id_utilisateur'))->value('est_admin');
        abort_unless((bool) $isAdmin, 403, 'Accès réservé aux administrateurs.');
    }
}

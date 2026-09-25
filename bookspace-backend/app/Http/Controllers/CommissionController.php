<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommissionController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        return DB::table('commission')->orderBy('type_offre')->get(['id', 'type_offre', 'taux', 'date_modification']);
    }

    public function update(Request $request, int $id)
    {
        $this->ensureAdmin($request);
        $validated = $request->validate(['taux' => ['required', 'numeric', 'min:0', 'max:100']]);
        $commission = DB::transaction(function () use ($request, $validated, $id) {
            $this->setRequestClaims($request->attributes->get('id_utilisateur'));
            $updated = DB::table('commission')->where('id', $id)->update([
                'taux' => $validated['taux'],
                'modifie_par' => $request->attributes->get('id_utilisateur'),
                'date_modification' => now(),
            ]);
            abort_unless($updated, 404);

            return DB::table('commission')->where('id', $id)->first(['id', 'type_offre', 'taux', 'date_modification']);
        });

        return response()->json($commission);
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

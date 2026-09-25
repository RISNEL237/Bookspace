<?php

namespace App\Http\Controllers;

use App\Models\Payout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PayoutController extends Controller
{
    public function sellerIndex(Request $request)
    {
        $sellerId = DB::table('profil_vendeur')
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->value('id_vendeur');

        if (! $sellerId) {
            return response()->json(['message' => 'Aucun vendeur associé à ce compte.'], 403);
        }

        return Payout::query()
            ->where('id_vendeur', $sellerId)
            ->latest('date_versement')
            ->get()
            ->map(fn (Payout $payout) => [
                'id' => $payout->id_versement,
                'net_amount' => $payout->montant,
                'currency' => 'XAF',
                'status' => $payout->statut === 'effectue' ? 'paid' : 'pending',
                'provider' => 'manual',
                'paid_at' => $payout->date_versement,
                'scheduled_at' => null,
            ]);
    }
}

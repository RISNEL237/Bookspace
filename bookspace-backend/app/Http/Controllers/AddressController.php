<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return Address::where('id_client', $request->attributes->get('id_utilisateur'))
            ->orderByDesc('is_default')
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['required', 'array'],
            'is_default' => ['boolean'],
        ]);
        $clientId = $request->attributes->get('id_utilisateur');

        return DB::transaction(function () use ($validated, $clientId) {
            if (($validated['is_default'] ?? false) === true) {
                Address::where('id_client', $clientId)->update(['is_default' => false]);
            }

            return response()->json(Address::create([
                'id_adresse' => (string) Str::uuid(),
                'id_client' => $clientId,
                'libelle' => $validated['label'],
                'nom_destinataire' => $validated['name'],
                'tel_livraison' => $validated['phone'] ?? null,
                'adresse' => $validated['address'],
                'is_default' => $validated['is_default'] ?? false,
            ]), 201);
        });
    }
}
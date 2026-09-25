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
            'address' => ['required', 'array:street,city,country'],
            'address.street' => ['required', 'string', 'max:255'],
            'address.city' => ['required', 'string', 'max:150'],
            'address.country' => ['required', 'string', 'max:150'],
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

    public function update(Request $request, string $address)
    {
        $clientId = $request->attributes->get('id_utilisateur');
        $savedAddress = Address::query()
            ->where('id_adresse', $address)
            ->where('id_client', $clientId)
            ->firstOrFail();

        $validated = $request->validate([
            'label' => ['sometimes', 'required', 'string', 'max:100'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'address' => ['sometimes', 'required', 'array:street,city,country'],
            'address.street' => ['required_with:address', 'string', 'max:255'],
            'address.city' => ['required_with:address', 'string', 'max:150'],
            'address.country' => ['required_with:address', 'string', 'max:150'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        return DB::transaction(function () use ($validated, $clientId, $savedAddress) {
            if (($validated['is_default'] ?? false) === true) {
                Address::where('id_client', $clientId)->update(['is_default' => false]);
            }

            $fields = [
                'label' => 'libelle',
                'name' => 'nom_destinataire',
                'phone' => 'tel_livraison',
                'address' => 'adresse',
                'is_default' => 'is_default',
            ];
            $attributes = [];
            foreach ($fields as $input => $column) {
                if (array_key_exists($input, $validated)) {
                    $attributes[$column] = $validated[$input];
                }
            }
            $savedAddress->update($attributes);

            return response()->json($savedAddress->fresh());
        });
    }
}

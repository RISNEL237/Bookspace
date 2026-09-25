<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SellerController extends Controller
{
    public function apply(Request $request)
    {
        $clientId = $request->attributes->get('id_utilisateur');
        $validated = $request->validate([
            'nom_commercial' => ['required', 'string', 'max:255'],
            'type_de_structure' => ['required', 'in:boutique,particulier'],
            'piece_identite' => ['required', 'string', 'max:2048'],
            'numero_commercial' => ['nullable', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:150'],
            'country' => ['required', 'string', 'max:150'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);
        $identityPath = str_replace('\\', '/', $validated['piece_identite']);
        abort_unless(
            str_starts_with($identityPath, $clientId.'/') && ! str_contains($identityPath, '..') && ! filter_var($identityPath, FILTER_VALIDATE_URL),
            422,
            'Le justificatif doit être un fichier de votre espace Storage privé.'
        );
        $validated['piece_identite'] = $identityPath;
        $existing = Seller::query()->where('id_client', $clientId)->first();
        abort_if($existing && $existing->statut_vendeur !== 'suspendu', 409, 'Une demande vendeur existe déjà pour ce compte.');

        return DB::transaction(function () use ($clientId, $validated, $existing) {
            if ($existing) {
                $seller = $existing;
                $seller->update([
                    'nom_commercial' => $validated['nom_commercial'],
                    'type_de_structure' => $validated['type_de_structure'],
                    'piece_identite' => $validated['piece_identite'],
                    'numero_commercial' => $validated['numero_commercial'] ?? null,
                    'localisation' => ['city' => $validated['city'], 'country' => $validated['country'], 'latitude' => (float) $validated['latitude'], 'longitude' => (float) $validated['longitude']],
                    'statut_vendeur' => 'non_verifie',
                    'motif_suspension' => null,
                ]);
            } else {
                $seller = Seller::create([
                    'id_vendeur' => (string) Str::uuid(),
                    'id_client' => $clientId,
                    'nom_commercial' => $validated['nom_commercial'],
                    'type_de_structure' => $validated['type_de_structure'],
                    'piece_identite' => $validated['piece_identite'],
                    'numero_commercial' => $validated['numero_commercial'] ?? null,
                    'localisation' => ['city' => $validated['city'], 'country' => $validated['country'], 'latitude' => (float) $validated['latitude'], 'longitude' => (float) $validated['longitude']],
                    'statut_vendeur' => 'non_verifie',
                ]);
            }
            $demandeId = (string) Str::uuid();
            DB::table('demande_vendeur')->insert([
                'id_demande' => $demandeId,
                'id_client' => $clientId,
                'nom_commercial' => $validated['nom_commercial'],
                'type_de_structure' => $validated['type_de_structure'],
                'piece_identite' => $validated['piece_identite'],
                'localisation' => json_encode(['city' => $validated['city'], 'country' => $validated['country'], 'latitude' => (float) $validated['latitude'], 'longitude' => (float) $validated['longitude']]),
                'statut' => 'en_attente',
                'date_demande' => now(),
            ]);
            app(NotificationService::class)->sendToAdministrators(
                'demande_vendeur',
                'Une nouvelle demande vendeur attend votre vérification.',
                $demandeId
            );

            return response()->json($this->serializeSeller($seller->fresh()), 201);
        });
    }

    public function me(Request $request)
    {
        return response()->json($this->currentSeller($request));
    }

    public function updateMe(Request $request)
    {
        $seller = $this->currentSeller($request);
        $validated = $request->validate([
            'nom_commercial' => ['sometimes', 'required', 'string', 'max:255'],
            'description_boutique' => ['sometimes', 'nullable', 'string', 'max:5000'],
                'localisation' => ['sometimes', 'array'],
            'localisation.city' => ['sometimes', 'nullable', 'string', 'max:150'],
            'localisation.country' => ['sometimes', 'nullable', 'string', 'max:150'],
            'localisation.latitude' => ['sometimes', 'required', 'numeric', 'between:-90,90'],
            'localisation.longitude' => ['sometimes', 'required', 'numeric', 'between:-180,180'],
        ]);
        $seller->update($validated);

        return response()->json($this->serializeSeller($seller->fresh()));
    }

    private function currentSeller(Request $request): Seller
    {
        $seller = Seller::query()->where('id_client', $request->attributes->get('id_utilisateur'))->first();
        abort_unless($seller, 403, 'Aucun vendeur associé à ce compte.');

        return $seller;
    }

    /**
     * Display all approved sellers.
     */
    public function index()
    {
        $sellers = Seller::query()
            ->where('statut_vendeur', 'actif')
            ->with([
                'offers' => fn ($query) => $query->where('statut_offre', 'active')->where('est_disponible', true),
                'offers.book.category',
                'offers.book.offers.seller',
            ])
            ->get();

        return response()->json($sellers->map(fn (Seller $seller) => $this->serializeSeller($seller))->values());
    }

    /**
     * Display the specified resource.
     */
    public function show(Seller $seller)
    {
        abort_unless($seller->statut_vendeur === 'actif', 404);

        $seller->load([
            'offers' => fn ($query) => $query->where('statut_offre', 'active')->where('est_disponible', true),
            'offers.book.category',
            'offers.book.offers.seller',
        ]);

        return response()->json($this->serializeSeller($seller));
    }

    public function adminIndex(Request $request)
    {
        $this->ensureAdmin($request);

        return response()->json(Seller::query()->latest('date_creation')->get()->map(fn (Seller $seller) => [
            ...$this->serializeSeller($seller),
            'siret' => $seller->numero_commercial,
            'documents' => $seller->piece_identite ? [$seller->piece_identite] : [],
        ])->values());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seller $seller)
    {
        $this->ensureAdmin($request);
        $validated = $request->validate([
            'kyb_status' => ['required', 'in:pending,approved,rejected'],
        ]);

        $status = match ($validated['kyb_status']) {
            'approved' => 'actif',
            'rejected' => 'suspendu',
            default => 'non_verifie',
        };
        $previousStatus = $seller->statut_vendeur;

        DB::transaction(function () use ($request, $seller, $status, $validated, $previousStatus) {
            $this->setRequestClaims($request->attributes->get('id_utilisateur'));
            $seller->update([
                'statut_vendeur' => $status,
                'dateact' => $status === 'actif' ? now() : null,
            ]);
            DB::table('demande_vendeur')->where('id_client', $seller->id_client)->where('statut', 'en_attente')->update([
                'statut' => $validated['kyb_status'] === 'approved' ? 'approuvee' : ($validated['kyb_status'] === 'rejected' ? 'rejetee' : 'en_attente'),
            ]);
            if ($status !== $previousStatus) {
                [$notificationType, $notificationMessage] = match ($status) {
                    'actif' => ['vendeur_approuve', 'Votre demande vendeur a été approuvée. Votre boutique est maintenant active.'],
                    'suspendu' => ['vendeur_rejete', 'Votre demande vendeur a été rejetée ou votre boutique a été suspendue.'],
                    default => ['vendeur_en_attente', 'Votre demande vendeur est en attente de vérification.'],
                };
                app(NotificationService::class)->sendOnce(
                    $seller->id_client,
                    $notificationType,
                    $notificationMessage,
                    $seller->id_vendeur
                );
            }
        });

        return response()->json([
            ...$this->serializeSeller($seller->fresh()),
            'siret' => $seller->numero_commercial,
            'documents' => $seller->piece_identite ? [$seller->piece_identite] : [],
        ]);
    }

    protected function serializeSeller(Seller $seller): array
    {
        $offers = $seller->offers ?? collect();
        $books = $offers->pluck('book')->filter()->unique('id_livre')->values();

        return [
            'id' => $seller->id_vendeur,
            'shop_name' => $seller->nom_commercial,
            'legal_type' => $seller->type_de_structure,
            'country' => data_get($seller->localisation, 'country'),
            'city' => data_get($seller->localisation, 'city'),
            'latitude' => data_get($seller->localisation, 'latitude'),
            'longitude' => data_get($seller->localisation, 'longitude'),
            'description' => $seller->description_boutique,
            'kyb_status' => match ($seller->statut_vendeur) {
                'actif' => 'approved',
                'suspendu' => 'rejected',
                default => 'pending',
            },
            'rating' => (float) $seller->note_moyenne,
            'books' => $books->map(function ($book) {
                $offers = $book->offers
                    ->where('statut_offre', 'active')
                    ->where('est_disponible', true)
                    ->filter(fn ($offer) => $offer->seller?->statut_vendeur === 'actif');

                return [
                    'id' => $book->id_livre,
                    'title' => $book->titre_livre,
                    'author' => $book->auteur_livre,
                    'genre' => $book->category?->nom_categorie ?? 'Divers',
                    'pricePaper' => (float) ($offers->firstWhere('type_offre', 'physique')?->prix_offre ?? 0),
                    'priceEbook' => (float) ($offers->firstWhere('type_offre', 'numerique')?->prix_offre ?? 0),
                    'cover' => $book->image_couverture ?? 'cv1',
                    'isPublished' => $offers->isNotEmpty(),
                ];
            })->values(),
        ];
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
        $isAdmin = DB::table('client')
            ->where('id', $request->attributes->get('id_utilisateur'))
            ->value('est_admin');

        abort_unless((bool) $isAdmin, 403, 'Accès réservé aux administrateurs.');
    }
}

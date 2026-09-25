<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function checkout(Request $request, Order $order)
    {
        $clientId = $request->attributes->get('id_utilisateur');

        abort_unless($order->id_client === $clientId, 403, 'Cette commande ne vous appartient pas.');

        $secret = config('services.stripe.secret');

        if (! $secret) {
            return response()->json([
                'message' => 'Le paiement Stripe n’est pas encore configuré sur le serveur.',
            ], 503);
        }

        $order->load('items.offer.book');
        $lineItems = [];

        foreach ($order->items as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => ['name' => $item->offer?->book?->titre_livre ?? 'Article BookSpace'],
                    'unit_amount' => (int) round((float) $item->prix_unitaire_fige * 100),
                ],
                'quantity' => $item->quantite_commande,
            ];
        }

        $response = Http::asForm()
            ->withBasicAuth($secret, '')
            ->post('https://api.stripe.com/v1/checkout/sessions', [
                'mode' => 'payment',
                'success_url' => rtrim(config('app.frontend_url'), '/').'/commande/confirmation?order_id='.$order->id_commande,
                'cancel_url' => rtrim(config('app.frontend_url'), '/').'/paiement?order_id='.$order->id_commande,
                'client_reference_id' => $order->id_commande,
                'metadata[order_id]' => $order->id_commande,
                ...collect($lineItems)->mapWithKeys(function (array $lineItem, int $index) {
                    return [
                        "line_items[{$index}][price_data][currency]" => $lineItem['price_data']['currency'],
                        "line_items[{$index}][price_data][product_data][name]" => $lineItem['price_data']['product_data']['name'],
                        "line_items[{$index}][price_data][unit_amount]" => $lineItem['price_data']['unit_amount'],
                        "line_items[{$index}][quantity]" => $lineItem['quantity'],
                    ];
                })->all(),
            ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Stripe n’a pas pu créer la session de paiement.',
            ], 502);
        }

        return response()->json([
            'url' => $response->json('url'),
            'session_id' => $response->json('id'),
        ]);
    }

    public function stripeWebhook(Request $request)
    {
        $signature = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        if (! $signature || ! $secret) {
            return response()->json(['message' => 'Signature Stripe manquante.'], 400);
        }

        [$timestamp, $signatureV1] = $this->stripeSignatureParts($signature);
        $payload = $request->getContent();
        $signedPayload = $timestamp.'.'.$payload;
        $expected = hash_hmac('sha256', $signedPayload, $secret);

        if (! $timestamp || ! $signatureV1 || abs(time() - (int) $timestamp) > 300 || ! hash_equals($expected, $signatureV1)) {
            return response()->json(['message' => 'Signature Stripe invalide.'], 400);
        }

        $event = json_decode($payload, true);
        if (($event['type'] ?? null) === 'checkout.session.completed') {
            $orderId = $event['data']['object']['metadata']['order_id'] ?? null;
            if ($orderId && ($order = Order::find($orderId))) {
                $order->update(['statut_commande' => 'payee']);
                Payment::where('id_commande', $order->id_commande)->update([
                    'statut_paiement' => 'succes',
                    'id_transaction_externe' => $event['data']['object']['id'] ?? null,
                ]);
                $order->items()->each(function ($item) {
                    $item->update([
                        'statut_ligne_commande' => $item->offer?->type_offre === 'numerique'
                            ? 'disponible_telechargement'
                            : 'en_preparation',
                    ]);
                });
            }
        }

        return response()->json(['received' => true]);
    }

    private function stripeSignatureParts(string $signature): array
    {
        $parts = collect(explode(',', $signature))->mapWithKeys(function (string $part) {
            [$key, $value] = array_pad(explode('=', $part, 2), 2, null);
            return [$key => $value];
        });

        return [$parts->get('t'), $parts->get('v1')];
    }

    public function mobileMoney(Request $request, Order $order)
    {
        $validated = $request->validate([
            'provider' => ['required', 'in:mtn,orange'],
            'phone' => ['required', 'string', 'min:8', 'max:20'],
        ]);
        $clientId = $request->attributes->get('id_utilisateur');

        abort_unless($order->id_client === $clientId, 403, 'Cette commande ne vous appartient pas.');

        if ($validated['provider'] === 'orange') {
            return response()->json([
                'message' => 'Le connecteur Orange Money doit être configuré selon les identifiants et le contrat marchand Orange.',
            ], 501);
        }

        $configuration = config('services.mtn_momo');
        if (! $configuration['subscription_key'] || ! $configuration['api_user'] || ! $configuration['api_key']) {
            return response()->json(['message' => 'MTN MoMo n’est pas encore configuré sur le serveur.'], 503);
        }

        $reference = (string) Str::uuid();
        $tokenResponse = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $configuration['subscription_key'],
        ])->withBasicAuth($configuration['api_user'], $configuration['api_key'])
            ->post(rtrim($configuration['base_url'], '/').'/collection/token');

        if ($tokenResponse->failed()) {
            return response()->json(['message' => 'MTN MoMo n’a pas délivré de jeton de paiement.'], 502);
        }

        $requestResponse = Http::withHeaders([
            'Authorization' => 'Bearer '.$tokenResponse->json('access_token'),
            'Ocp-Apim-Subscription-Key' => $configuration['subscription_key'],
            'X-Reference-Id' => $reference,
            'X-Target-Environment' => config('services.mtn_momo.target_environment', 'sandbox'),
            'Content-Type' => 'application/json',
        ])->post(rtrim($configuration['base_url'], '/').'/collection/v1_0/requesttopay', [
            'amount' => number_format((float) $order->montant_total_commande, 2, '.', ''),
            'currency' => 'EUR',
            'externalId' => $order->id_commande,
            'payer' => [
                'partyIdType' => 'MSISDN',
                'partyId' => $validated['phone'],
            ],
            'payerMessage' => 'Commande BookSpace '.$order->id_commande,
            'payeeNote' => 'BookSpace',
        ]);

        if ($requestResponse->failed()) {
            return response()->json(['message' => 'MTN MoMo n’a pas accepté la demande de paiement.'], 502);
        }

        Payment::where('id_commande', $order->id_commande)->update([
            'fournisseur_paiement' => 'mtn_momo',
            'tel_paiement' => $validated['phone'],
            'id_transaction_externe' => $reference,
        ]);

        return response()->json([
            'status' => 'pending',
            'reference' => $reference,
            'message' => 'Validez la demande de paiement reçue sur votre téléphone.',
        ], 202);
    }

    public function mobileMoneyStatus(Request $request, Order $order, string $reference)
    {
        $clientId = $request->attributes->get('id_utilisateur');
        abort_unless($order->id_client === $clientId, 403, 'Cette commande ne vous appartient pas.');

        $configuration = config('services.mtn_momo');
        $tokenResponse = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $configuration['subscription_key'],
        ])->withBasicAuth($configuration['api_user'], $configuration['api_key'])
            ->post(rtrim($configuration['base_url'], '/').'/collection/token');

        if ($tokenResponse->failed()) {
            return response()->json(['message' => 'Impossible de vérifier le paiement MTN MoMo.'], 502);
        }

        $statusResponse = Http::withHeaders([
            'Authorization' => 'Bearer '.$tokenResponse->json('access_token'),
            'Ocp-Apim-Subscription-Key' => $configuration['subscription_key'],
            'X-Target-Environment' => $configuration['target_environment'],
        ])->get(rtrim($configuration['base_url'], '/').'/collection/v1_0/requesttopay/'.$reference);

        if ($statusResponse->failed()) {
            return response()->json(['message' => 'MTN MoMo n’a pas retourné le statut du paiement.'], 502);
        }

        $providerStatus = strtoupper((string) $statusResponse->json('status', 'PENDING'));
        $orderStatus = match ($providerStatus) {
            'SUCCESSFUL' => 'payee',
            'FAILED' => 'annulee',
            default => 'en_attente',
        };

        if ($providerStatus === 'SUCCESSFUL') {
            $order->update(['statut_commande' => 'payee']);
            Payment::where('id_commande', $order->id_commande)->update(['statut_paiement' => 'succes']);
        } elseif ($providerStatus === 'FAILED') {
            $order->update(['statut_commande' => 'annulee']);
            Payment::where('id_commande', $order->id_commande)->update(['statut_paiement' => 'echec']);
        }

        return response()->json([
            'status' => $orderStatus,
            'provider_status' => $providerStatus,
        ]);
    }
    public function camerpayWebhook(Request $request){
        $hmacSecret = config('services.camerpay.hmac_secret');
        $apiToken = config('services.camerpay.api_token');

        if (! $hmacSecret || ! $apiToken) {
            return response()->json(['message' => 'CamerPay n’est pas encore configuré sur le serveur.'], 503);
        }

        $signature = $request->header('X-CamerPay-Signature');
        $payload = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $hmacSecret);

        if (! hash_equals($expectedSignature, $signature)) {
            return response()->json(['message' => 'Signature CamerPay invalide.'], 400);
        }

        $event = json_decode($payload, true);
        if (($event['type'] ?? null) === 'payment.completed') {
            $orderId = $event['data']['metadata']['order_id'] ?? null;
            if ($orderId && ($order = Order::find($orderId))) {
                $order->update(['statut_commande' => 'payee']);
                Payment::where('id_commande', $order->id_commande)->update([
                    'statut_paiement' => 'succes',
                    'id_transaction_externe' => $event['data']['id'] ?? null,
                ]);
                $order->items()->each(function ($item) {
                    $item->update([
                        'statut_ligne_commande' => $item->offer?->type_offre === 'numerique'
                            ? 'disponible_telechargement'
                            : 'en_preparation',
                    ]);
                });
            }
        }

        return response()->json(['received' => true]);
    }
    // Vérification de la signature HMAC
    // Vérification du paiement
    // Mise à jour de la commande
    // Réponse à CamerPay
}

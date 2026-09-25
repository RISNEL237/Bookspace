<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationService
{
    public function send(string $clientId, string $type, string $message, ?string $objectId = null): void
    {
        DB::table('notification')->insert([
            'id_notification' => (string) Str::uuid(),
            'id_client' => $clientId,
            'type_notification' => $type,
            'message_notification' => $message,
            'est_lue_notification' => false,
            'objet_lie_id' => $objectId,
            'date_notification' => now(),
        ]);
    }

    public function sendToAdministrators(string $type, string $message, ?string $objectId = null): void
    {
        DB::table('client')->where('est_admin', true)->pluck('id')->each(
            fn (string $clientId) => $this->send($clientId, $type, $message, $objectId)
        );
    }

    public function sendOnce(string $clientId, string $type, string $message, string $objectId): void
    {
        DB::transaction(function () use ($clientId, $type, $message, $objectId): void {
            $lockKey = implode(':', [$clientId, $type, $objectId]);
            DB::select('select pg_advisory_xact_lock(hashtextextended(?, 0))', [$lockKey]);

            $alreadySent = DB::table('notification')
                ->where('id_client', $clientId)
                ->where('type_notification', $type)
                ->where('objet_lie_id', $objectId)
                ->exists();

            if (! $alreadySent) {
                $this->send($clientId, $type, $message, $objectId);
            }
        });
    }
}

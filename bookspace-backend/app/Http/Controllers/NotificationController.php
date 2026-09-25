<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $clientId = $request->attributes->get('id_utilisateur');
        $notifications = DB::table('notification')
            ->where('id_client', $clientId)
            ->latest('date_notification')
            ->limit(100)
            ->get([
                'id_notification as id',
                'type_notification as type',
                'message_notification as message',
                'est_lue_notification as is_read',
                'objet_lie_id as object_id',
                'date_notification as created_at',
            ])
            ->map(fn (object $notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'message' => $notification->message,
                'is_read' => in_array($notification->is_read, [true, 1, '1', 't', 'true'], true),
                'object_id' => $notification->object_id,
                'created_at' => $notification->created_at,
            ]);

        return response()->json([
            'data' => $notifications,
            'unread_count' => $notifications->where('is_read', false)->count(),
        ]);
    }

    public function markRead(Request $request, string $notification)
    {
        $updated = DB::table('notification')
            ->where('id_notification', $notification)
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->update(['est_lue_notification' => true]);

        abort_unless($updated > 0, 404, 'Notification introuvable.');

        return response()->json(['updated' => true]);
    }

    public function markAllRead(Request $request)
    {
        DB::table('notification')
            ->where('id_client', $request->attributes->get('id_utilisateur'))
            ->where('est_lue_notification', false)
            ->update(['est_lue_notification' => true]);

        return response()->json(['updated' => true]);
    }
}

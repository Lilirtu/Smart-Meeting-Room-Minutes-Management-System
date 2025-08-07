<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification; // Assuming your table is linked to this model
use App\Models\Users;
use Carbon\Carbon;

class NotificationGetController extends Controller
{
    // Fetch all unread notifications for the authenticated user
    public function getUnreadNotifications()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $notifications = Notification::where('ReceivedId', $user->id)
            ->where('IsRead', false)
            ->orderBy('TimeSent', 'desc')
            ->get();
            $notificationsWithSenders = $notifications->map(function ($notification) {
            $senderName = Users::where('id', $notification->SenderId)->value('FullName');

    return [
        'id' => $notification->id,
        'SenderId' => $notification->SenderId,
        'SenderName' => $senderName ?? 'Unknown',
        'TimeSent' => $notification->TimeSent,
        'IsRead' => $notification->IsRead,
        'Content' => $notification->Content ?? '',
    ];
});

        return response()->json($notificationsWithSenders);
    }
    public function markAsRead($id)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'Unauthenticated'], 401);
    }

    $notification = Notification::where('id', $id)
        ->where('ReceivedId', $user->id)
        ->first();

    if (!$notification) {
        return response()->json(['error' => 'Notification not found'], 404);
    }

    $notification->IsRead = true;
    $notification->save();

    return response()->json(['message' => 'Notification marked as read']);
}

}

<?php
namespace App\Http\Controllers;

use App\Models\Users;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationPutController extends Controller
{
    // 🔍 Search users by FullName or Email (excluding self)
    public function searchUsers(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['message' => 'Query is required.'], 400);
        }

        $users = Users::where('id', '!=', Auth::id())
            ->where(function ($q) use ($query) {
                $q->where('FullName', 'like', "%{$query}%")
                  ->orWhere('Email', 'like', "%{$query}%");
            })
            ->select('id', 'FullName', 'Email')
            ->get();

        return response()->json($users);
    }

    // ✉️ Send a notification to another user
    public function sendNotification(Request $request)
    {
        $request->validate([
            'ReceivedId' => 'required|exists:Users,id', // ✅ lowercase 'users' for PostgreSQL
            'Content' => 'required|string|max:1000',
        ]);

        $notification = new Notification();
        $notification->SenderId = Auth::id();
        $notification->ReceivedId = $request->ReceivedId; // ✅ match DB column
        $notification->Content = $request->Content;
        $notification->TimeSent = now();
        $notification->IsRead = false;
        $notification->save();

        return response()->json(['message' => 'Notification sent successfully.']);
    }
}

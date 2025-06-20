<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // GET /api/notification
    public function index()
    {
        return response()->json(Notification::all(), 200);
    }

    // GET /api/notification/{id}
    public function show($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        return response()->json($notification, 200);
    }

    // POST /api/notification
    public function store(Request $request)
    {
        $validated = $request->validate([
            'SenderId' => 'required|integer|exists:Users,id',
            'ReceivedId' => 'required|integer|exists:Users,id',
            'TimeSent' => 'nullable|date',
            'IsRead' => 'boolean',
        ]);

        $notification = Notification::create($validated);

        return response()->json($notification, 201);
    }

    // PUT /api/notification/{id}
    public function update(Request $request, $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $validated = $request->validate([
            'SenderId' => 'required|integer|exists:Users,id',
            'ReceivedId' => 'required|integer|exists:Users,id',
            'TimeSent' => 'nullable|date',
            'IsRead' => 'boolean',
        ]);

        $notification->update($validated);

        return response()->json($notification, 200);
    }

    // DELETE /api/notification/{id}
    public function destroy($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted'], 200);
    }
}

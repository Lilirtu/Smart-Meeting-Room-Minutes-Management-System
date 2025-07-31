<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Reservation;
use App\Models\Meeting;
use App\Models\Attendance;


class ReservationController extends Controller
{
    public function index() { return Reservation::all(); }

    public function show($id) {
        $item = Reservation::find($id);
        return $item ? response()->json($item) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'Status' => 'required|max:30',
        'StartTime' => 'required|date_format:H:i',
        'EndTime' => 'required|date_format:H:i|after:StartTime',
        'Date' => 'required|date',
        'UserIds' => 'required|array|min:1',
        'UserIds.*' => 'integer|exists:Users,id',
        'RoomId' => 'required|exists:Room,id'
    ]);
    \Log::info('Booking request data:', $request->all());

    DB::beginTransaction();
    try {
        // ✅ Check if room is available (no overlapping reservations)
        $conflict = Reservation::where('RoomId', $request->RoomId)
            ->where('Date', $request->Date)
            ->where(function ($query) use ($request) {
                $query->whereBetween('StartTime', [$request->StartTime, $request->EndTime])
                    ->orWhereBetween('EndTime', [$request->StartTime, $request->EndTime])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('StartTime', '<=', $request->StartTime)
                          ->where('EndTime', '>=', $request->EndTime);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Room is already booked for this time slot'], 409);
        }

        // ✅ Create Reservation
        $reservation = Reservation::create([
            'Status' => $request->Status,
            'StartTime' => $request->StartTime,
            'EndTime' => $request->EndTime,
            'Date' => $request->Date,
            'UserId' => $request->UserIds[0], // Organizer
            'RoomId' => $request->RoomId,
        ]);

        // ✅ Create Meeting
        $meeting = Meeting::create([
            'Title' => $request->Status,
            'NumberOfAttendance' => count($request->UserIds),
            'StartTime' => $request->StartTime,
            'EndTime' => $request->EndTime,
            'Date' => $request->Date,
            'ReservationId' => $reservation->id, // lowercase id
        ]);

        // ✅ Update Reservation with MeetingId
        $reservation->update(['MeetingId' => $meeting->id]);

        // ✅ Add attendees
        foreach ($request->UserIds as $userId) {
            Attendance::create([
                'UserId' => $userId,
                'MeetingId' => $meeting->id,
            ]);
        }

        DB::commit();

        return response()->json([
            'message' => 'Booking successful',
            'reservation' => $reservation,
            'meeting' => $meeting
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Booking error: ' . $e->getMessage());
        DB::rollBack();
        return response()->json([
            'message' => 'Booking failed',
            'error' => $e->getMessage()
        ], 500);
    }
}


    public function update(Request $request, $id) {
        $item = Reservation::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'Status' => 'required|max:30',
            'StartTime' => 'required',
            'EndTime' => 'required',
            'Date' => 'required|date',
            'UserId' => 'required|integer',
            'RoomId' => 'required|integer'
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id) {
        $item = Reservation::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);
        $item->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

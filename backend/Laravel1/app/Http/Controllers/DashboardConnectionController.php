<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use App\Models\Meeting;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\GroupAssignment;
use App\Models\Assignment;
use Carbon\Carbon;

class DashboardConnectionController extends Controller
{
    /**
     * Method for CalendarWidget: Get meeting for selected date
     */
    public function show($id, Request $request)
    {
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->input('date');

        $attendance = Attendance::where('UserId', $user->id)->first();
        if (!$attendance) {
            return response()->json(['error' => 'No attendance record found for this user'], 404);
        }

        $meetingId = $attendance->MeetingId;

        $meeting = Meeting::where('id', $meetingId)
            ->whereDate('Date', $date)
            ->first();

        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found for this date'], 404);
        }

        $reservation = Reservation::where('MeetingId', $meeting->ReservationId)->first();
        if (!$reservation) {
            return response()->json(['error' => 'Reservation not found'], 404);
        }

        $room = Room::where('id', $reservation->RoomId)->first();
        if (!$room) {
            return response()->json(['error' => 'Room not found'], 404);
        }

        return response()->json([
            'meeting_title' => $meeting->Title,
            'room_name' => $room->Name,
            'room_location' => $room->Location,
        ]);
    }

}

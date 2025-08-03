<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use App\Models\Meeting;
use App\Models\Reservation;
use App\Models\Room;

class DashboardConnectionController extends Controller
{
    public function show($id, Request $request)
    {
        // Authenticate the user using JWT (api guard)
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401); // Unauthorized if no valid user found
        }

        // Validate the date input to ensure it's a valid date format
        $request->validate([
            'date' => 'required|date', // Date is required and must be a valid date
        ]);

        $date = $request->input('date'); // Get the date from the frontend

        // Fetch Attendance record for the logged-in user
        $attendance = Attendance::where('UserId', $user->id)->first();
        if (!$attendance) {
            return response()->json(['error' => 'No attendance record found for this user'], 404);
        }

        // Get the MeetingId based on the attendance record
        $meetingId = $attendance->MeetingId;

        // Fetch the Meeting based on MeetingId and the selected date
        $meeting = Meeting::where('id', $meetingId)
            ->whereDate('Date', $date) // Filter by date
            ->first();

        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found for this date'], 404);
        }

        // Get the Reservation based on the Meeting's ReservationId
        $reservation = Reservation::where('id', $meeting->ReservationId)->first();
        if (!$reservation) {
            return response()->json(['error' => 'Reservation not found'], 404);
        }

        // Get the RoomId from the Reservation
        $roomId = $reservation->RoomId;

        // Fetch the Room details (Name and Location) based on RoomId
        $room = Room::where('id', $roomId)->first();
        if (!$room) {
            return response()->json(['error' => 'Room not found'], 404);
        }

        // Return the meeting title, room name, and room location in the response
        return response()->json([
            'meeting_title' => $meeting->Title, // Meeting title
            'room_name' => $room->Name,         // Room name
            'room_location' => $room->Location, // Room location
        ]);
    }
}

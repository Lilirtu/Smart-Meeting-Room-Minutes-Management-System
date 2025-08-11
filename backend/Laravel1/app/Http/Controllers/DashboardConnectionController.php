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
        logger()->warning('Unauthorized access attempt.');
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $request->validate([
        'date' => 'required|date',
    ]);

    $date = $request->input('date');
    logger()->info("User ID {$user->id} requested meetings info for date: {$date}");

    // Get all MeetingIds the user is attending
    $meetingIds = Attendance::where('UserId', $user->id)->pluck('MeetingId');
    if ($meetingIds->isEmpty()) {
        logger()->warning("No attendance records found for user ID {$user->id}");
        return response()->json(['error' => 'No meetings found for this user'], 404);
    }
    logger()->info("User attends meetings with IDs: " . $meetingIds->implode(', '));

    // Find all meetings on that date among those meetings
    $meetings = Meeting::whereIn('id', $meetingIds)
        ->whereDate('Date', $date)
        ->get();

    if ($meetings->isEmpty()) {
        logger()->warning("No meetings found for user ID {$user->id} on date {$date}");
        return response()->json(['error' => 'No meetings found on this date'], 404);
    }

    // Prepare response data array with meeting info + room info
    $responseData = [];

    foreach ($meetings as $meeting) {
        $reservation = Reservation::where('MeetingId', $meeting->id)->first();

        if (!$reservation) {
            logger()->warning("Reservation not found for MeetingId {$meeting->id}");
            continue; // skip this meeting
        }

        $room = Room::where('id', $reservation->RoomId)->first();
        if (!$room) {
            logger()->warning("Room not found for RoomId {$reservation->RoomId}");
            continue; // skip this meeting
        }

        $responseData[] = [
            'meeting_title' => $meeting->Title,
            'room_name' => $room->Name,
            'room_location' => $room->Location,
        ];
    }

    if (empty($responseData)) {
        return response()->json(['error' => 'No valid meetings found with room information'], 404);
    }

    return response()->json(['meetings' => $responseData]);
}

}

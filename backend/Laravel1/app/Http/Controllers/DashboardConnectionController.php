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
    logger()->info("User ID {$user->id} requested meeting info for date: {$date}");

    // Get all MeetingIds the user is attending
    $meetingIds = Attendance::where('UserId', $user->id)->pluck('MeetingId');
    if ($meetingIds->isEmpty()) {
        logger()->warning("No attendance records found for user ID {$user->id}");
        return response()->json(['error' => 'No meetings found for this user'], 404);
    }
    logger()->info("User attends meetings with IDs: " . $meetingIds->implode(', '));

    // Find the first meeting on that date among those meetings
    $meeting = Meeting::whereIn('id', $meetingIds)
        ->whereDate('Date', $date)
        ->first();

    if (!$meeting) {
        logger()->warning("No meetings found for user ID {$user->id} on date {$date}");
        return response()->json(['error' => 'No meetings found on this date'], 404);
    }

    logger()->info("Meeting found: ID {$meeting->id}, Title: {$meeting->Title}, Date: {$meeting->Date}");

    $reservation = Reservation::where('MeetingId', $meeting->id)->first();
    if (!$reservation) {
        logger()->warning("Reservation not found for MeetingId {$meeting->id}");
        return response()->json(['error' => 'Reservation not found'], 404);
    }

    $room = Room::where('id', $reservation->RoomId)->first();
    if (!$room) {
        logger()->warning("Room not found for RoomId {$reservation->RoomId}");
        return response()->json(['error' => 'Room not found'], 404);
    }

    logger()->info("Room found: ID {$room->id}, Name: {$room->Name}, Location: {$room->Location}");

    return response()->json([
        'meeting_title' => $meeting->Title,
        'room_name' => $room->Name,
        'room_location' => $room->Location,
    ]);
}




}

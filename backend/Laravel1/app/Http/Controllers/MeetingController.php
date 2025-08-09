<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MeetingController extends Controller
{
    public function index()
    {
        return response()->json(Meeting::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'StartTime' => 'required|date_format:H:i',
            'EndTime' => 'required|date_format:H:i',
            'Date' => 'required|date',
            'Title' => 'required|string|max:50',
            'NumberOfAttendance' => 'required|integer',
            'ReservationId' => 'nullable|exists:reservations,Id',
            'MinutesOfMeetingId' => 'nullable|exists:minutes_of_meeting,Id',
            'AgendaId' => 'nullable|exists:agenda,Id',
        ]);

        $meeting = Meeting::create($validated);
        return response()->json($meeting, 201);
    }

    public function show($id)
    {
        $meeting = Meeting::findOrFail($id);
        return response()->json($meeting, 200);
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'StartTime' => 'sometimes|date_format:H:i',
            'EndTime' => 'sometimes|date_format:H:i',
            'Date' => 'sometimes|date',
            'Title' => 'sometimes|string|max:50',
            'NumberOfAttendance' => 'sometimes|integer',
            'ReservationId' => 'nullable|exists:reservations,Id',
            'MinutesOfMeetingId' => 'nullable|exists:minutes_of_meeting,Id',
            'AgendaId' => 'nullable|exists:agenda,Id',
        ]);

        $meeting->update($validated);
        return response()->json($meeting, 200);
    }

    public function destroy($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->delete();
        return response()->json(null, 204);
    }

    public function getUserMeetings(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $date = $request->query('date');

            $reservations = Reservation::where('UserId', $user->id)
                ->with(['meeting.agenda', 'meeting.reservation.room'])
                ->get();

            $meetings = $reservations->pluck('meeting')->filter(function ($meeting) use ($date) {
                return $meeting && $meeting->Date === $date;
            })->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->Title,
                    'start' => $meeting->StartTime,
                    'end' => $meeting->EndTime,
                    'agenda' => optional($meeting->agenda)->Title,
                    'room' => optional(optional($meeting->reservation)->room)->Name,
                ];
            })->values();

            Log::info('Fetched meetings:', $meetings->toArray());

            return response()->json($meetings);
        } catch (\Exception $e) {
            Log::error('Error in getUserMeetings: ' . $e->getMessage());
            return response()->json(['error' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function getUpcomingMeetingsForUser()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $now = now();

            $reservations = Reservation::where('UserId', $user->id)
                ->with(['meeting.agenda', 'meeting.reservation.room'])
                ->get();

            $upcomingMeetings = $reservations->pluck('meeting')->filter(function ($meeting) use ($now) {
                if (!$meeting) return false;

                $meetingDateTime = Carbon::parse($meeting->Date . ' ' . $meeting->StartTime);
                return $meetingDateTime->greaterThanOrEqualTo($now);
            })->sortBy(function ($meeting) {
                return Carbon::parse($meeting->Date . ' ' . $meeting->StartTime);
            })->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->Title,
                    'date' => $meeting->Date,
                    'start' => $meeting->StartTime,
                    'end' => $meeting->EndTime,
                    'agenda' => optional($meeting->agenda)->Title,
                    'room' => optional(optional($meeting->reservation)->room)->Name,
                ];
            })->values();

            return response()->json($upcomingMeetings);
        } catch (\Exception $e) {
            Log::error('Error fetching upcoming meetings: ' . $e->getMessage());
            return response()->json(['error' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }
}

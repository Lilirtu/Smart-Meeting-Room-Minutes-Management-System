<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Meeting;
use App\Models\Reservation;
use Carbon\Carbon;

class MeetingController extends Controller
{
    /**
     * Get meetings for the authenticated user on a specific date.
     */
    public function getUserMeetings(Request $request)
    {
        $user = Auth::user();
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
                'location' => optional(optional($meeting->reservation)->room)->Location,
            ];
        })->values();

        return response()->json($meetings);
    }

    /**
     * Get upcoming meetings for the authenticated user.
     */
    public function getUpcomingMeetingsForUser()
    {
        $user = Auth::user();
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
                'location' => optional(optional($meeting->reservation)->room)->Location,
            ];
        })->values();

        return response()->json($upcomingMeetings);
    }

    /**
     * Store a new meeting.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Title' => 'required|string|max:255',
            'Date' => 'required|date',
            'StartTime' => 'required',
            'EndTime' => 'required',
            'agenda_id' => 'nullable|exists:agendas,id',
        ]);

        $meeting = Meeting::create([
            'Title' => $validated['Title'],
            'Date' => $validated['Date'],
            'StartTime' => $validated['StartTime'],
            'EndTime' => $validated['EndTime'],
            'AgendaId' => $validated['agenda_id'] ?? null,
        ]);

        return response()->json(['message' => 'Meeting created successfully', 'meeting' => $meeting], 201);
    }

    /**
     * Update an existing meeting.
     */
    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'Title' => 'sometimes|string|max:255',
            'Date' => 'sometimes|date',
            'StartTime' => 'sometimes',
            'EndTime' => 'sometimes',
            'agenda_id' => 'nullable|exists:agendas,id',
        ]);

        $meeting->update([
            'Title' => $validated['Title'] ?? $meeting->Title,
            'Date' => $validated['Date'] ?? $meeting->Date,
            'StartTime' => $validated['StartTime'] ?? $meeting->StartTime,
            'EndTime' => $validated['EndTime'] ?? $meeting->EndTime,
            'AgendaId' => $validated['agenda_id'] ?? $meeting->AgendaId,
        ]);

        return response()->json(['message' => 'Meeting updated successfully', 'meeting' => $meeting]);
    }

    /**
     * Delete a meeting.
     */
    public function destroy($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->delete();

        return response()->json(['message' => 'Meeting deleted successfully']);
    }
}

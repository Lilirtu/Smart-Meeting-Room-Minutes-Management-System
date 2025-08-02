<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;
use Illuminate\Support\Facades\DB;

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
            'ReservationId' => 'nullable|exists:reservation,Id',
            'MinutesOfMeetingId' => 'nullable|exists:minutesofmeeting,Id',
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
            'ReservationId' => 'nullable|exists:reservation,Id',
            'MinutesOfMeetingId' => 'nullable|exists:minutesofmeeting,Id',
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

    /* ========== ActiveMeetingScreen Methods ========== */

    public function getMeetingWithAttendees($id)
    {
        $meeting = DB::table('meeting as m')
            ->leftJoin('attendance as a', 'a.MeetingId', '=', 'm.Id')
            ->leftJoin('users as u', 'u.Id', '=', 'a.UserId')
            ->select(
                'm.Id',
                'm.Title',
                'm.StartTime',
                'm.EndTime',
                'm.Date',
                DB::raw('COALESCE(array_agg(u.FullName), ARRAY[]::VARCHAR[]) AS attendees')
            )
            ->where('m.Id', $id)
            ->groupBy('m.Id')
            ->first();

        if (!$meeting) {
            return response()->json(['message' => 'Meeting not found'], 404);
        }

        return response()->json($meeting);
    }

    public function startMeeting($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->StartTime = now()->format('H:i');
        $meeting->save();

        return response()->json(['message' => 'Meeting started', 'StartTime' => $meeting->StartTime]);
    }

    public function endMeeting($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->EndTime = now()->format('H:i');
        $meeting->save();

        return response()->json(['message' => 'Meeting ended', 'EndTime' => $meeting->EndTime]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;
use Illuminate\Support\Facades\DB;

class MeetingController extends Controller
{
    /* ===== Standard CRUD ===== */

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

    /* ===== Endpoints used by ActiveMeetingScreen ===== */

    // GET /api/meetings/{id}/details
    // MySQL/MariaDB compatible (uses GROUP_CONCAT). Normalized keys for React.
    public function getMeetingWithAttendees($id)
    {
        $row = DB::table('meeting as m')
            ->leftJoin('attendance as a', 'a.MeetingId', '=', 'm.Id')
            ->leftJoin('users as u', 'u.Id', '=', 'a.UserId')
            ->select(
                DB::raw('m.Id as id'),
                DB::raw('m.Title as title'),
                DB::raw('m.StartTime as starttime'),
                DB::raw('m.EndTime as endtime'),
                DB::raw('m.Date as date'),
                // Use a delimiter unlikely to appear in names
                DB::raw("GROUP_CONCAT(u.FullName SEPARATOR '||') as attendees_str")
            )
            ->where('m.Id', $id)
            // Avoid ONLY_FULL_GROUP_BY complaints
            ->groupBy('m.Id', 'm.Title', 'm.StartTime', 'm.EndTime', 'm.Date')
            ->first();

        if (!$row) {
            return response()->json(['message' => 'Meeting not found'], 404);
        }

        $attendees = [];
        if (!empty($row->attendees_str)) {
            // split and trim; also filter out empties
            $attendees = array_values(array_filter(array_map('trim', explode('||', $row->attendees_str))));
        }

        return response()->json([
            'id'        => $row->id,
            'title'     => $row->title,
            'date'      => $row->date,
            'starttime' => $row->starttime,
            'endtime'   => $row->endtime,
            'attendees' => $attendees,
        ]);
    }

    // PUT /api/meetings/{id}/start
    public function startMeeting($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->StartTime = now()->format('H:i');
        $meeting->save();

        return response()->json([
            'message'   => 'Meeting started',
            'starttime' => $meeting->StartTime,
        ]);
    }

    // PUT /api/meetings/{id}/end
    public function endMeeting($id)
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->EndTime = now()->format('H:i');
        $meeting->save();

        return response()->json([
            'message' => 'Meeting ended',
            'endtime' => $meeting->EndTime,
        ]);
    }
}

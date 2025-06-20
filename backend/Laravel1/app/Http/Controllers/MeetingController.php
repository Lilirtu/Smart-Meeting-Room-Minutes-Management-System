<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;


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
}

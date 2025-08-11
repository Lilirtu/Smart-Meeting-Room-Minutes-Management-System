<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Models\MinutesOfMeeting;
use App\Models\Meeting;

class MinutesOfMeetingController extends Controller
{
    /**
     * GET /api/meetings/{id}/details
     * Returns basic info needed by the frontend to validate time window.
     */
    public function details($id): JsonResponse
    {
        // IMPORTANT: Meeting model must have: protected $table = 'Meeting';
        $meeting = Meeting::query()->find($id);

        if (!$meeting) {
            return response()->json([
                'message' => 'Meeting not found',
            ], 404);
        }

        return response()->json([
            'id'        => $meeting->id,
            'Date'      => $meeting->Date ?? null,
            'StartTime' => $meeting->StartTime ?? null,
            'EndTime'   => $meeting->EndTime ?? null,
            // Add anything else your UI might rely on:
            'Title'     => $meeting->Title ?? null,
            'UserId'    => $meeting->UserId ?? null,
        ]);
    }

    /**
     * GET /api/meetings/{id}/minutes
     * Returns all minutes rows for a given meeting id.
     */
    public function indexForMeeting($id): JsonResponse
    {
        // Validate that the meeting exists (helps avoid foreign key confusion)
        $meeting = Meeting::query()->find($id);
        if (!$meeting) {
            return response()->json([
                'message' => 'Meeting not found',
            ], 404);
        }

        $minutes = MinutesOfMeeting::query()
            ->where('MeetingId', $meeting->id)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($minutes);
    }

    /**
     * POST /api/minutes_of_meeting
     * Body: { MeetingId, Topic, Summary, DecisionMade }
     */
    public function store(Request $request): JsonResponse
    {
        // Basic validation
        $validator = Validator::make($request->all(), [
            'MeetingId'     => ['required', 'integer'],
            'Topic'         => ['required', 'string', 'max:255'],
            'Summary'       => ['required', 'string'],
            'DecisionMade'  => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Ensure meeting exists (table name is handled in Meeting model)
        $meeting = Meeting::query()->find($request->input('MeetingId'));
        if (!$meeting) {
            return response()->json([
                'message' => 'Meeting not found',
            ], 404);
        }

        // Create minutes row
        $minutes = new MinutesOfMeeting();
        $minutes->MeetingId    = $meeting->id;
        $minutes->Topic        = $request->input('Topic');
        $minutes->Summary      = $request->input('Summary');
        $minutes->DecisionMade = $request->input('DecisionMade');

        // If your MinutesOfMeeting table doesn't have timestamps, make sure
        // the model has: public $timestamps = false;
        $minutes->save();

        return response()->json([
            'message' => 'Minutes saved successfully',
            'data'    => $minutes,
        ], 201);
    }
}

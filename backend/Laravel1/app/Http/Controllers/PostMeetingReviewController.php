<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Meeting;
use App\Models\MinutesOfMeeting;
use App\Models\Attachment;
use App\Models\Assignment;
use App\Models\GroupAssignment;

class PostMeetingReviewController extends Controller
{
    public function show($id)
    {
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $meeting = Meeting::find($id);
        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found'], 404);
        }

        // ✅ Get the minutes by MeetingId
        $minutes = MinutesOfMeeting::where('MeetingId', $id)->first();

        // ✅ Get attachments using MinutesOfMeetingId
        $attachments = [];
        if ($minutes) {
            $attachments = Attachment::where('MinutesOfMeetingId', $minutes->id)->get();
        }

        // ✅ Get assignment IDs from GroupAssignment for this user
        $assignmentIds = GroupAssignment::where('UserId', $user->id)
            ->pluck('AssignmentId');

        // ✅ Get assignments for this meeting and user
        $assignments = Assignment::where('MeetingId', $id)
            ->whereIn('id', $assignmentIds)
            ->get();

        return response()->json([
            'meeting' => $meeting,
            'minutes' => $minutes,
            'attachments' => $attachments,
            'assignments' => $assignments,
        ]);
    }
}

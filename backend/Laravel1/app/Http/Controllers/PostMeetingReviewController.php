<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Meeting;
use App\Models\MinutesOfMeeting;
use App\Models\Attachment;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\GroupAssignment;

class PostMeetingReviewController extends Controller
{
    public function show(Request $request, $meetingId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Step 1: Check if user attended the meeting
        $attended = Attendance::where("UserId", $user->id)
                              ->where("MeetingId", $meetingId)
                              ->exists();

        if (!$attended) {
            return response()->json(['error' => 'Access denied. You did not attend this meeting.'], 403);
        }

        // Step 2: Fetch Meeting
        $meeting = Meeting::find($meetingId);
        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found.'], 404);
        }

        // Step 3: Fetch Minutes of Meeting
        $minutes = MinutesOfMeeting::where("MeetingId", $meetingId)->first();

        // Step 4: Fetch Attachments
        $attachments = $minutes
            ? Attachment::where("MinutesOfMeetingId", $minutes->id)->get()
            : [];

        // Step 5: Fetch Assignments assigned to logged-in user via GroupAssignment
        $assignmentIds = GroupAssignment::where("UserId", $user->id)->pluck("AssignmentId");

        $assignments = Assignment::whereIn("id", $assignmentIds)
                                 ->where("MeetingId", $meetingId)
                                 ->get();

        return response()->json([
            'meeting' => $meeting,
            'minutes' => $minutes,
            'attachments' => $attachments,
            'assignments' => $assignments,
        ]);
    }
}

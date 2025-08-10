<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\GroupAssignment;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    public function getAssignments(Request $request)
    {
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = $user->id;

        // Get all AssignmentIds for this user from GroupAssignment
        $assignmentIds = GroupAssignment::where('UserId', $userId)
            ->pluck('AssignmentId');  // Get the AssignmentIds associated with this user

        // Fetch matching assignments from the Assignment table
        $assignments = Assignment::query()
            ->whereIn('id', $assignmentIds)  // Filter assignments based on the user's AssignmentIds
            ->select('id', 'Description', 'DueDate', 'Submission') // select relevant columns
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($assignments, 200);  // Return the assignments in JSON format
    }

    // POST /api/assignments/{id}/submit
    public function submitWork(Request $request, $id)
    {
        // Validate the file input (must be a file and match the specified formats)
        $validated = $request->validate([
            'submission' => 'required|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:2048',
        ]);

        // Find the assignment by ID
        $assignment = Assignment::find($id);
        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);  // If assignment does not exist
        }

        // Store the file in the 'Submission' directory
        $path = $request->file('submission')->store('Submission');

        // Update the 'Submission' column with the file path
        $assignment->Submission = $path;
        $assignment->save();  // Save the assignment with the new file path

        return response()->json(['message' => 'File submitted successfully', 'path' => $path], 200);  // Return success response
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\GroupAssignment;
use App\Models\Assignment;
use Carbon\Carbon;

class UpcomingEventsConnectionController extends Controller
{
    public function getUpcomingEvents(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Validate date input
        $request->validate([
            'date' => 'required|date', // Ensure the date parameter is passed and valid
        ]);

        // Get the date from the query string
        $date = $request->input('date');

        // Parse and format the date using Carbon to ensure it is in the correct format
        try {
            $formattedDate = Carbon::parse($date)->toDateString();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format'], 400);
        }

        // Get assignmentIds related to the authenticated user
        $assignmentIds = GroupAssignment::where('UserId', $user->id)
            ->pluck('AssignmentId');

        // Fetch assignments where DueDate is after the provided date
        $assignments = Assignment::whereIn('id', $assignmentIds)
            ->where('DueDate', '>', $formattedDate)  // Filter assignments based on the formatted date
            ->get(['Description', 'DueDate']);

        // Format the assignments to a cleaner response
        $formatted = $assignments->map(function ($assignment) {
            // Check if DueDate is a valid date and format it
            $dueDate = Carbon::parse($assignment->DueDate); // Ensure it's parsed into Carbon instance

            return [
                'Description' => $assignment->description,
                'DueDate' => $dueDate->toDateString(), // Get only the date part in 'YYYY-MM-DD' format
            ];
        });

        return response()->json($formatted);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;

class AssignmentController extends Controller
{
    // GET /api/assignment
    public function index()
    {
        return response()->json(Assignment::all(), 200);
    }

    // GET /api/assignment/{id}
    public function show($id)
    {
        $assignment = Assignment::find($id);

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        return response()->json($assignment, 200);
    }

    // POST /api/assignment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'NotificationId' => 'required|integer|exists:Notification,id',
            'MeetingId' => 'required|integer|exists:Meeting,id',
            'Description' => 'required|string',
            'DueDate' => 'required|date',
        ]);

        $assignment = Assignment::create($validated);

        return response()->json($assignment, 201);
    }

    // PUT /api/assignment/{id}
    public function update(Request $request, $id)
    {
        $assignment = Assignment::find($id);

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        $validated = $request->validate([
            'NotificationId' => 'required|integer|exists:Notification,id',
            'MeetingId' => 'required|integer|exists:Meeting,id',
            'Description' => 'required|string',
            'DueDate' => 'required|date',
        ]);

        $assignment->update($validated);

        return response()->json($assignment, 200);
    }

    // DELETE /api/assignment/{id}
    public function destroy($id)
    {
        $assignment = Assignment::find($id);

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted'], 200);
    }
}

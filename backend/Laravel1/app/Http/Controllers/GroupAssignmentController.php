<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GroupAssignment;

class GroupAssignmentController extends Controller
{
    // GET /api/groupassignment
    public function index()
    {
        return response()->json(GroupAssignment::all(), 200);
    }

    // GET /api/groupassignment/{id}
    public function show($id)
    {
        $groupAssignment = GroupAssignment::find($id);

        if (!$groupAssignment) {
            return response()->json(['message' => 'Group assignment not found'], 404);
        }

        return response()->json($groupAssignment, 200);
    }

    // POST /api/groupassignment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'AssignmentId' => 'required|integer|exists:Assignment,id',
            'UserId' => 'required|integer|exists:Users,id',
        ]);

        $groupAssignment = GroupAssignment::create($validated);

        return response()->json($groupAssignment, 201);
    }

    // PUT /api/groupassignment/{id}
    public function update(Request $request, $id)
    {
        $groupAssignment = GroupAssignment::find($id);

        if (!$groupAssignment) {
            return response()->json(['message' => 'Group assignment not found'], 404);
        }

        $validated = $request->validate([
            'AssignmentId' => 'required|integer|exists:Assignment,id',
            'UserId' => 'required|integer|exists:Users,id',
        ]);

        $groupAssignment->update($validated);

        return response()->json($groupAssignment, 200);
    }

    // DELETE /api/groupassignment/{id}
    public function destroy($id)
    {
        $groupAssignment = GroupAssignment::find($id);

        if (!$groupAssignment) {
            return response()->json(['message' => 'Group assignment not found'], 404);
        }

        $groupAssignment->delete();

        return response()->json(['message' => 'Group assignment deleted'], 200);
    }
}

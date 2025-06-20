<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MinutesOfMeeting;

class MinutesOfMeetingController extends Controller
{
    public function index() { return MinutesOfMeeting::all(); }

    public function show($id) {
        $item = MinutesOfMeeting::find($id);
        return $item ? response()->json($item) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'Topic' => 'required|max:100',
            'Summary' => 'required|max:500',
            'DecisionMade' => 'required|max:100'
        ]);
        return response()->json(MinutesOfMeeting::create($validated), 201);
    }

    public function update(Request $request, $id) {
        $item = MinutesOfMeeting::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'Topic' => 'required|max:100',
            'Summary' => 'required|max:500',
            'DecisionMade' => 'required|max:100'
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id) {
        $item = MinutesOfMeeting::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);
        $item->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;

class AttendanceController extends Controller
{
    public function index() { return Attendance::all(); }

    public function show($id) {
        $item = Attendance::find($id);
        return $item ? response()->json($item) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'UserId' => 'required|integer',
            'MeetingId' => 'required|integer'
        ]);
        return response()->json(Attendance::create($validated), 201);
    }

    public function update(Request $request, $id) {
        $item = Attendance::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'UserId' => 'required|integer',
            'MeetingId' => 'required|integer'
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id) {
        $item = Attendance::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);
        $item->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

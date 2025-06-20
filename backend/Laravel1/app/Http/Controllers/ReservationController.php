<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function index() { return Reservation::all(); }

    public function show($id) {
        $item = Reservation::find($id);
        return $item ? response()->json($item) : response()->json(['message' => 'Not found'], 404);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'Status' => 'required|max:30',
            'StartTime' => 'required',
            'EndTime' => 'required',
            'Date' => 'required|date',
            'UserId' => 'required|integer',
            'RoomId' => 'required|integer'
        ]);
        return response()->json(Reservation::create($validated), 201);
    }

    public function update(Request $request, $id) {
        $item = Reservation::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'Status' => 'required|max:30',
            'StartTime' => 'required',
            'EndTime' => 'required',
            'Date' => 'required|date',
            'UserId' => 'required|integer',
            'RoomId' => 'required|integer'
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy($id) {
        $item = Reservation::find($id);
        if (!$item) return response()->json(['message' => 'Not found'], 404);
        $item->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

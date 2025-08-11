<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller {

    public function store(Request $request) {
        $request->validate([
            'Name' => 'required|string|max:255',
            'Location' => 'required|string|max:255',
            'Capacity' => 'required|integer',
            'Image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('Image')) {
            $imagePath = $request->file('Image')->store('rooms', 'public');
        }

        $room = Room::create([
            'Name' => $request->Name,
            'Location' => $request->Location,
            'Capacity' => $request->Capacity,
            'Image' => $imagePath,
        ]);

        $room->ImageUrl = $imagePath ? asset('storage/' . $imagePath) : null;

        return response()->json($room);
    }

    public function index() {
        return Room::all();
    }

    public function index1() {
        $rooms = Room::select('id', 'name')->get();
        return response()->json(['status' => 200, 'rooms' => $rooms]);
    }

    public function show($id) {
        $room = Room::with('features')->find($id);
        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }
        $imageUrl = $room->Image ? asset('storage/' . $room->Image) : null;
        return response()->json([
            'id' => $room->id,
            'Name' => $room->Name,
            'Location' => $room->Location,
            'Capacity' => $room->Capacity,
            'ImageUrl' => $imageUrl,
            'features' => $room->features ? $room->features->map(fn($feature) => [
                'id' => $feature->id,
                'FeatureName' => $feature->FeatureName
            ]) : [],
        ]);
    }

    public function update(Request $request, $Id) {
        $room = Room::findOrFail($Id);
        $room->update($request->all());
        return response()->json($room);
    }

    public function destroy($Id) {
        $room = Room::findOrFail($Id);
        $room->delete();
        return response()->json(null, 204);
    }
}

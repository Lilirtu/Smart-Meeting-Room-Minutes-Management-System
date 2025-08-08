<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\Room; // import the user class to use it's methodes
use Illuminate\Http\Request; // To be able to use the request to access the data sent with the request

class RoomController extends Controller {

    //Create a new Room (CREATE)
    public function store(Request $request)
{
    $request->validate([
        'Name' => 'required|string|max:255',
        'Location' => 'required|string|max:255',
        'Capacity' => 'required|integer',
        'Image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $imagePath = null;

    if ($request->hasFile('Image')) {
        // Store image in 'public/rooms', get relative path
        $imagePath = $request->file('Image')->store('rooms', 'public');
    }

    $room = Room::create([
        'Name' => $request->Name,
        'Location' => $request->Location,
        'Capacity' => $request->Capacity,
        'Image' => $imagePath, // Save relative path
    ]);

    // Send full URL in response
    $room->ImageUrl = $imagePath ? asset('storage/' . $imagePath) : null;

    return response()->json($room);
}


    //Get the Room (READ ALL)
    public function index(){
        return Room::all(); // return all Room as JSON. Default methode in laravel
    }

    public function index1()
    {
        $rooms = Room::select('id', 'name')->get();

        return response()->json([
            'status' => 200,
            'rooms' => $rooms
        ]);
    }



    //Get a specific Room by Id (READ ONE)
    public function show($id)
{
    $room = Room::with('features')->find($id);

    if (!$room) {
        return response()->json(['message' => 'Room not found'], 404);
    }

    // Build full image URL if Image is set
    $imageUrl = $room->Image ? asset('storage/' . $room->Image) : null;

    return response()->json([
        'id' => $room->id,
        'Name' => $room->Name,
        'Location' => $room->Location,
        'Capacity' => $room->Capacity,
        'ImageUrl' => $imageUrl,  // ✅ full image URL for frontend
        'features' => $room->features ? $room->features->map(function ($feature) {
            return [
                'id' => $feature->id,
                'FeatureName' => $feature->FeatureName
            ];
        }) : [],
    ]);
}




    //update a Room (UPDATE)
    public function update(Request $request, $Id){
        $room = Room::findOrFail($Id);
        $room->update($request->all());
        return response()->json($room); // by default 200
    }

    //Delete a Room (DELETE)
    public function destroy($Id){
        $room = Room::findOrFail($Id);
        $room>delete();
        return response()->json(null,204); // 204 successfully deleted and nothing to return
    }

} 
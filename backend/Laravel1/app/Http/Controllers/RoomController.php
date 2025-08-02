<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\Room; // import the Room model to use its methods
use Illuminate\Http\Request; // To be able to use the Request class for accessing data sent with the request

class RoomController extends Controller
{
    /**
     * Create a new Room (CREATE)
     */
    public function store(Request $request)
    {
        // Validate input (optional but recommended)
        $validated = $request->validate([
            'Name' => 'required|string|max:100',
            'Location' => 'required|string|max:100',
            'Capacity' => 'required|integer'
        ]);

        // Create a new Room using validated data
        $room = Room::create($validated);

        // Return the new Room as JSON with status code 201 (Created)
        return response()->json($room, 201);
    }

    /**
     * Get all Rooms (READ ALL)
     */
    public function index()
    {
        // Return all Rooms as JSON
        return Room::all();
    }

    /**
     * Get a specific Room by Id (READ ONE)
     */
    public function show($Id)
    {
        // Find Room by ID or throw 404 error if not found
        return Room::findOrFail($Id);
    }

    /**
     * Update a Room (UPDATE)
     */
    public function update(Request $request, $Id)
    {
        // Find the Room or throw 404 error
        $room = Room::findOrFail($Id);

        // Validate data before updating
        $validated = $request->validate([
            'Name' => 'sometimes|string|max:100',
            'Location' => 'sometimes|string|max:100',
            'Capacity' => 'sometimes|integer'
        ]);

        // Update Room with validated data
        $room->update($validated);

        // Return updated Room as JSON (default status 200)
        return response()->json($room);
    }

    /**
     * Delete a Room (DELETE)
     */
    public function destroy($Id)
    {
        // Find Room by ID or throw 404 error
        $room = Room::findOrFail($Id);

        // Delete the Room
        $room->delete();

        // Return 204 (No Content) to indicate successful deletion
        return response()->json(null, 204);
    }
}

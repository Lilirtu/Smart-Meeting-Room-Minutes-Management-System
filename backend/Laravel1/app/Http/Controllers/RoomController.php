<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\Room; // import the user class to use it's methodes
use Illuminate\Http\Request; // To be able to use the request to access the data sent with the request

class RoomController extends Controller {

    //Create a new Room (CREATE)
    public function store(Request $request){
        $data = $request->all(); // get all the data in the request
        $room = Room::create($data); // create a Roomfrom the class Room with the data info that we got from request
        return response()->json($room, 201); // Return the new Room as JSON 
        // and with the code 201 to say something was ceated. 200 is the one by default it just say ok all was good, 404 for not found, 500 server error
        // response() is a methode in laravel that help create an http response to give back to the client
    }

    //Get the Room (READ ALL)
    public function index(){
        return Room::all(); // return all Room as JSON. Default methode in laravel
    }

    //Get a specific Room by Id (READ ONE)
    public function show($Id){
        return Room::findOrFail($Id); //return the found Room by it's id and if not found throws a 404 errors
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
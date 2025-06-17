<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\RoomFeature; // import the RoomFeature class to use it's methodes
use Illuminate\Http\Request; // To be able to use the request to access the data sent with the request

class RoomFeatureController extends Controller {

    //Create a new RoomFeature (CREATE)
    public function store(Request $request){
        $data = $request->all(); // get all the data in the request
        $room_feature = RoomFeature::create($data); // create a RoomFeature from the class RoomFeature with the data info that we got from request
        return response()->json($room_feature, 201); // Return the new RoomFeature as JSON 
        // and with the code 201 to say something was ceated. 200 is the one by default it just say ok all was good, 404 for not found, 500 server error
        // response() is a methode in laravel that help create an http response to give back to the client
    }

    //Get the RoomFeature (READ ALL)
    public function index(){
        return RoomFeature::all(); // return all RoomFeature as JSON. Default methode in laravel
    }

    //Get a specific RoomFeatureby Id (READ ONE)
    public function show($Id){
        return RoomFeature::findOrFail($Id); //return the found RoomFeature by it's id and if not found throws a 404 errors
    }

    //update a RoomFeature (UPDATE)
    public function update(Request $request, $Id){
        $room_feature= RoomFeature::findOrFail($Id);
        $room_feature->update($request->all());
        return response()->json($room_feature); // by default 200
    }

    //Delete a RoomFeature (DELETE)
    public function destroy($Id){
        $room_feature = RoomFeature::findOrFail($Id);
        $room_feature->delete();
        return response()->json(null,204); // 204 successfully deleted and nothing to return
    }

} 
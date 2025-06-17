<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\Feature; // import the user class to use it's methodes
use Illuminate\Http\Request; // To be able to use the request to access the data sent with the request

class FeatureController extends Controller {

    //Create a new Feature (CREATE)
    public function store(Request $request){
        $data = $request->all(); // get all the data in the request
        $feature = Feature::create($data); // create a Feature from the class Feature with the data info that we got from request
        return response()->json($feature, 201); // Return the new Feature as JSON 
        // and with the code 201 to say something was ceated. 200 is the one by default it just say ok all was good, 404 for not found, 500 server error
        // response() is a methode in laravel that help create an http response to give back to the client
    }

    //Get the Feature (READ ALL)
    public function index(){
        return Feature::all(); // return all Feature as JSON. Default methode in laravel
    }

    //Get a specific Feature by Id (READ ONE)
    public function show($Id){
        return Feature::findOrFail($Id); //return the found user by it's id and if not found throws a 404 errors
    }

    //update a user (UPDATE)
    public function update(Request $request, $Id){
        $feature = Feature::findOrFail($Id);
        $feature->update($request->all());
        return response()->json($feature); // by default 200
    }

    //Delete a user (DELETE)
    public function destroy($Id){
        $feature = Feature::findOrFail($Id);
        $feature->delete();
        return response()->json(null,204); // 204 successfully deleted and nothing to return
    }

} 
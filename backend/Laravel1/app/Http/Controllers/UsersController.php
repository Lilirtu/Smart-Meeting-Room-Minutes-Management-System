<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\Users; // import the user class to use it's methodes
use Illuminate\Http\Request; // To be able to use the request to access the data sent with the request

class UsersController extends Controller {

    //Create a new User (CREATE)
    public function store(Request $request){
        $data = $request->all(); // get all the data in the request
        $user = Users::create($data); // create a user from the class Users with the data info that we got from request
        return response()->json($user, 201); // Return the new user as JSON 
        // and with the code 201 to say something was ceated. 200 is the one by default it just say ok all was good, 404 for not found, 500 server error
        // response() is a methode in laravel that help create an http response to give back to the client
    }

    //Get the users (READ ALL)
    public function index(){
        return Users::all(); // return all users as JSON. Default methode in laravel
    }

    //Get a specific user by Id (READ ONE)
    public function show($Id){
        return Users::findOrFail($Id); //return the found user by it's id and if not found throws a 404 errors
    }

    //update a user (UPDATE)
    public function update(Request $request, $Id){
        $user = Users::findOrFail($Id);
        $user->update($request->all());
        return response()->json($user); // by default 200
    }

    //Delete a user (DELETE)
    public function destroy($Id){
        $user = Users::findOrFail($Id);
        $user->delete();
        return response()->json(null,204); // 204 successfully deleted and nothing to return
    }

} 
<?php

namespace App\Http\Controllers; // this file is in this folder

use App\Models\Role; // import the user class to use it's methodes
use Illuminate\Http\Request; // To be able to use the request to access the data sent with the request

class RoleController extends Controller {

    //Create a new Role (CREATE)
    public function store(Request $request){
        $data = $request->all(); // get all the data in the request
        $role = Role::create($data); // create a Role from the class Role with the data info that we got from request
        return response()->json($role, 201); // Return the new Role as JSON 
        // and with the code 201 to say something was ceated. 200 is the one by default it just say ok all was good, 404 for not found, 500 server error
        // response() is a methode in laravel that help create an http response to give back to the client
    }

    //Get the Role (READ ALL)
    public function index(){
        return Role::all(); // return all Role as JSON. Default methode in laravel
    }

    //Get a specific Role by Id (READ ONE)
    public function show($Id){
        return Role::findOrFail($Id); //return the found Role by it's id and if not found throws a 404 errors
    }

    //update a Role (UPDATE)
    public function update(Request $request, $Id){
        $role = Role::findOrFail($Id);
        $role->update($request->all());
        return response()->json($role); // by default 200
    }

    //Delete a Role (DELETE)
    public function destroy($Id){
        $role = Role::findOrFail($Id);
        $role->delete();
        return response()->json(null,204); // 204 successfully deleted and nothing to return
    }

} 
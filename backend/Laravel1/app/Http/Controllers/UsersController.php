<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;


class UsersController extends Controller
{
    // Create a new User (CREATE)
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FullName' => 'required|string|max:255',
            'Email' => 'required|email|unique:Users,Email',
            'Password' => 'required|string|min:6',
            'RoleId' => 'required|integer|exists:Role,id', //Role,ID 
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors'=> $validator->errors()],422);
        }
        
        
        $user = Users::create([
            'FullName' => $request->FullName,
            'Email' => $request->Email,
            'Password' => Hash::make($request->Password),
            'RoleId' => $request->RoleId
        ]); 

        $token = JWTAuth::fromUser($user);

        return response()->json(['message' => 'User Registered',
        'user'=>$user,
        'token'=>$token
        ],201);
        
    }

    public function login(Request $request){

        $request->validate([
            'Email' => 'required|email',
            'Password' => 'required|string|min:6',
        ]);
        
        $user = Users::where('Email', $request->Email)->first();

        if(!$user){
            return response()->json(['error'=> 'Invalid Email'],401);
        }
        elseif(!Hash::check($request->Password, $user->password)){
            return response()->json(['error'=> 'Incorrect Password'],401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json(['message' => 'Login Successfully',
        'user'=>$user->makeHidden(['Password']),
        'token'=>$token
        ],201);
    }

    public function dashboard(){
        try{
            $user = JWTAuth::parseToken()->authenticate();
        }
        catch(\Tymon\JWTAuth\Exceptions\TokenExpiredException $e){
            return response()->json(['error'=> 'Token Invalid'],401);
        }
        catch(\Tymon\JWTAuth\Exceptions\TokenExpiredException $e){
            return response()->json(['error'=> 'Token is Expired'],401);
        }

        return response()->json(['message' => 'Welcome to your Dashboard',
        'user'=>$user,
        ]);
    }

    public function logout(){
        try{
            $token = JWTAuth::getToken();
            if(!$token){
                return response()->json(['error'=> 'Token not Provided'],401);
            }

            JWTAuth::invalidate($token);
            return response()->json(['message'=> 'Log Out Successfully'],401);    
        }
        catch(\Tymon\JWTAuth\Exceptions\JWTException $e){
            return response()->json(['error'=> 'Failed to Logout Invalid'],401);
        }
    }

    // Get all users (READ ALL)
    public function index()
    {
        return Users::all();
    }

    // Get a specific user by id (READ ONE)
    public function show($id)
    {
        return Users::findOrFail($id);
    }

    // Update a user (UPDATE)
    public function update(Request $request, $id)
    {
        $user = Users::findOrFail($id);

        $validated = $request->validate([
            'FullName' => 'sometimes|required|string|max:255',
            'Email' => 'sometimes|required|email|unique:Users,Email,' . $id . ',id',
            'Password' => 'sometimes|required|string|min:6',
            'RoleId' => 'sometimes|required|integer|exists:Role,ID',
        ]);

        if (isset($validated['Password'])) {
            $validated['Password'] = Hash::make($validated['Password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // Delete a user (DELETE)
    public function destroy($id)
    {
        $user = Users::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\JWTException;

class UsersController extends Controller
{
    // ✅ Register a new user
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FullName' => 'required|string|max:255',
            'Email' => 'required|email|unique:Users,Email',
            'Password' => 'required|string|min:6',
            'RoleId' => 'required|integer|exists:Role,id', // adjust if your Role table uses a different primary key
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

        return response()->json([
            'message' => 'User Registered Successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // ✅ Login user
    public function login(Request $request)
    {
        $request->validate([
            'Email' => 'required|email',
            'Password' => 'required|string|min:6',
        ]);

        $user = Users::where('Email', $request->Email)->first();

        if(!$user){
            return response()->json(['error'=> 'Invalid Email'],401);
        }
        elseif(!Hash::check($request->Password, $user->Password)){
            return response()->json(['error'=> 'Incorrect Password'],401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Login Successful',
            'user' => $user->makeHidden(['Password']),
            'token' => $token
        ], 200);
    }

    // ✅ Dashboard (protected route)
    public function dashboard()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenInvalidException $e) {
            return response()->json(['error'=> 'Token Invalid'],401);
        } catch (TokenExpiredException $e) {
            return response()->json(['error'=> 'Token Expired'],401);
        } catch (JWTException $e) {
            return response()->json(['error'=> 'Token Not Found'],401);
        }

        return response()->json([
            'message' => 'Welcome to your Dashboard',
            'user' => $user
        ]);
    }

    // ✅ Logout user
    public function logout()
    {
        try {
            $token = JWTAuth::getToken();
            if(!$token){
                return response()->json(['error'=> 'Token not Provided'],400);
            }

            JWTAuth::invalidate($token);
            return response()->json(['message'=> 'Logged Out Successfully'],200);
        } catch (JWTException $e) {
            return response()->json(['error'=> 'Failed to Logout'],500);
        }
    }

    // ✅ Convert emails to user IDs
    public function getUsersIds(Request $request)
    {
        $request->validate([
            'emails' => 'required|array',
            'emails.*' => 'email'
        ]);

        $users = Users::whereIn('Email', $request->emails)->pluck('id');

        return response()->json($users);
    }

    // ✅ Get all users
    public function index()
    {
        return Users::all();
    }

    // ✅ Get single user
    public function show($id)
    {
        return Users::findOrFail($id);
    }

    // ✅ Update user
    public function update(Request $request, $id)
    {
        $user = Users::findOrFail($id);

        $validated = $request->validate([
            'FullName' => 'sometimes|required|string|max:255',
            'Email' => 'sometimes|required|email|unique:Users,Email,' . $id . ',id',
            'Password' => 'sometimes|required|string|min:6',
            'RoleId' => 'sometimes|required|integer|exists:Role,id',
        ]);

        if (isset($validated['Password'])) {
            $validated['Password'] = Hash::make($validated['Password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // ✅ Delete user
    public function destroy($id)
    {
        $user = Users::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }
}

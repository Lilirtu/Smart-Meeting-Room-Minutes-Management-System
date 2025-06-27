<?php

namespace App\Http\Controllers;

use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    // Create a new User (CREATE)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'FullName' => 'required|string|max:255',
            'Email' => 'required|email|unique:Users,Email',
            'Password' => 'required|string|min:6',
            'RoleId' => 'required|integer|exists:Role,ID',
        ]);

        $validated['Password'] = Hash::make($validated['Password']);

        $user = Users::create($validated);

        return response()->json($user, 201);
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

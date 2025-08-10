<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProfileConnectionController extends Controller
{
    public function show(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Users table: id, FullName, Email, Password, RoleId
        $user = DB::table('Users')->where('id', $userId)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // RoleId on Users may be "RoleId"
        $roleId = $user->RoleId ?? $user->role_id ?? $user->roleid ?? null;

        // Role table: id, RoleName, Description
        $role = null;
        if ($roleId !== null) {
            $role = DB::table('Role')->where('id', $roleId)->first();
        }

        return response()->json([
            'user' => [
                'id'        => $user->id,
                'fullName'  => $user->FullName ?? null,
                'email'     => $user->Email ?? null,
                'roleId'    => $roleId,
                'createdAt' => $user->created_at ?? null,
                'updatedAt' => $user->updated_at ?? null,
            ],
            'role' => $role ? [
                'id'          => $role->id,
                'roleName'    => $role->RoleName ?? null,
                'description' => $role->Description ?? null,
            ] : null,
        ]);
    }
}

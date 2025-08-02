<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Users;
use App\Models\Role;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // Get authenticated user (assuming you have login + token/session)
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Load user's role
        $role = Role::find($user->RoleId);

        if (!$role || $role->RoleName !== 'Admin') {
            return response()->json(['message' => 'Forbidden: Admins only'], 403);
        }

        return $next($request);
    }
}

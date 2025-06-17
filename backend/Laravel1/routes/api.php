<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\RoomFeatureController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', UsersController::class);
Route::apiResource('role', RoleController::class);
Route::apiResource('room', RoomController::class);
Route::apiResource('feature', FeatureController::class);
Route::apiResource('room_feature', RoomFeatureController::class);


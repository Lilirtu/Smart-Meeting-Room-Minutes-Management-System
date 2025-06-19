<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsersController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\RoomFeatureController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MinutesOfMeetingController;
use App\Http\Controllers\MeetingController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// CRUD API routes
Route::apiResource('users', UsersController::class);
Route::apiResource('role', RoleController::class);
Route::apiResource('room', RoomController::class);
Route::apiResource('feature', FeatureController::class);
Route::apiResource('room_feature', RoomFeatureController::class);
Route::apiResource('agenda', AgendaController::class);
Route::apiResource('attendance', AttendanceController::class);
Route::apiResource('reservation', ReservationController::class);
Route::apiResource('minutes', MinutesOfMeetingController::class);
Route::apiResource('meeting', MeetingController::class);

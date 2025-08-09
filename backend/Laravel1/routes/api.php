<?php

use Illuminate\Http\Request;

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
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationGetController;
use App\Http\Controllers\NotificationPutController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\DashboardConnectionController;
use App\Http\Controllers\GroupAssignmentController;
use App\Http\Controllers\PostMeetingReviewController;
use App\Http\Controllers\UpcomingEventsConnectionController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
});

// CRUD API routes
Route::apiResource('users', UsersController::class);
Route::post('usersIds', [UsersController::class, 'getUsersIds']);

Route::apiResource('role', RoleController::class);

Route::apiResource('room', RoomController::class);
Route::get('/roomIndex', [RoomController::class, 'index']);
Route::get('/rooms', [RoomController::class, 'index1']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);



Route::apiResource('feature', FeatureController::class);

Route::apiResource('room_feature', RoomFeatureController::class);

Route::apiResource('agenda', AgendaController::class);

Route::apiResource('attendance', AttendanceController::class);

Route::apiResource('reservation', ReservationController::class);
Route::post('/booking', [ReservationController::class, 'store']);

Route::apiResource('minutes', MinutesOfMeetingController::class);
Route::post('/minutes_of_meeting', [MinutesOfMeetingController::class, 'store']);

Route::apiResource('meeting', MeetingController::class);

Route::apiResource('attachment', AttachmentController::class);

Route::apiResource('notification', NotificationController::class);

Route::apiResource('assignment', AssignmentController::class);

Route::apiResource('groupassignment', GroupAssignmentController::class);

Route::middleware('auth:api')->get('/post-meeting-review/{id}', [PostMeetingReviewController::class, 'show']);
Route::get('DashboardConnection/{userId}', [DashboardConnectionController::class, 'show']);

Route::middleware('auth:api')->get('/upcoming-events', [UpcomingEventsConnectionController::class, 'getUpcomingEvents']);
Route::middleware('auth:api')->get('/notifications/unread', [NotificationGetController::class, 'getUnreadNotifications']);
Route::middleware('auth:api')->put('/notifications/{id}/read', [NotificationGetController::class, 'markAsRead']);


Route::middleware('auth:api')->group(function () {
    Route::get('/notifications/search-users', [NotificationPutController::class, 'searchUsers']);
    Route::post('/notifications/send', [NotificationPutController::class, 'sendNotification']);
});

Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::get('/dashboard', [UsersController::class, 'dashboard']);
Route::post('/logout', [UsersController::class, 'logout']);

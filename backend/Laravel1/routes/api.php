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
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationGetController;
use App\Http\Controllers\NotificationPutController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\DashboardConnectionController;
use App\Http\Controllers\GroupAssignmentController;
use App\Http\Controllers\PostMeetingReviewController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\UpcomingEventsConnectionController;
use App\Http\Controllers\ProfileConnectionController;
// If you use sanctum/passport user() helper:
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * Public (no auth)
 */
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);
Route::post('/logout', [UsersController::class, 'logout']); // You can also require auth for logout if you prefer

// Feature list can be public if you want the form to load before auth; otherwise move to the auth group.
Route::apiResource('feature', FeatureController::class)->only(['index','show']);

/**
 * Authenticated API
 */
Route::middleware('auth:api')->group(function () {
    // Users / Roles
    Route::apiResource('users', UsersController::class);
    Route::post('usersIds', [UsersController::class, 'getUsersIds']);
    Route::apiResource('role', RoleController::class);
    Route::apiResource('room', RoomController::class);




    Route::apiResource('room_feature', RoomFeatureController::class);


    // Booking / Reservations
    Route::apiResource('reservation', ReservationController::class);
    Route::post('/booking', [ReservationController::class, 'store']); // keep only if frontend uses /booking

    // Meetings / Minutes / Agenda / Attendance / Attachments
    Route::apiResource('meeting', MeetingController::class);
    Route::apiResource('minutes', MinutesOfMeetingController::class);
    Route::post('/minutes_of_meeting', [MinutesOfMeetingController::class, 'store']); // alias; remove if not needed
    Route::apiResource('agenda', AgendaController::class);
    Route::apiResource('attendance', AttendanceController::class);
    Route::apiResource('attachment', AttachmentController::class);

    // Dashboard data
    Route::get('/dashboard', [UsersController::class, 'dashboard']); // your frontend calls /api/dashboard
    Route::get('DashboardConnection/{userId}', [DashboardConnectionController::class, 'show']);

    // Notifications
    Route::apiResource('notification', NotificationController::class);
    Route::get('/notifications/unread', [NotificationGetController::class, 'getUnreadNotifications']);
    Route::put('/notifications/{id}/read', [NotificationGetController::class, 'markAsRead']);
    Route::get('/notifications/search-users', [NotificationPutController::class, 'searchUsers']);
    Route::post('/notifications/send', [NotificationPutController::class, 'sendNotification']);

    // Assignments / Submissions
    Route::apiResource('assignment', AssignmentController::class);
    Route::apiResource('groupassignment', GroupAssignmentController::class);
    Route::get('/assignments', [SubmissionController::class, 'getAssignments']);
    Route::post('/assignments/{id}/submit', [SubmissionController::class, 'submitWork']);

    // Post Meeting Review
    Route::get('/post-meeting-review/{id}', [PostMeetingReviewController::class, 'show']);

    // Upcoming events
    Route::get('/upcoming-events', [UpcomingEventsConnectionController::class, 'getUpcomingEvents']);
    Route::middleware('auth:api')->get('/profile', [ProfileConnectionController::class, 'show']);

    Route::get('roomIndex', [RoomController::class, 'index']);
    Route::apiResource('room', RoomController::class);

    Route::middleware('auth:api')->group(function () {
    Route::get('/meetings/{id}/details', [MinutesOfMeetingController::class, 'details']);
    Route::get('/meetings/{id}/minutes', [MinutesOfMeetingController::class, 'indexForMeeting']);
    Route::post('/meetings/{id}/minutes', [MinutesOfMeetingController::class, 'storeForMeeting']);
    Route::put('/meetings/{id}/start', [MinutesOfMeetingController::class, 'startMeeting']);
    Route::put('/meetings/{id}/end', [MinutesOfMeetingController::class, 'endMeeting']);
});


});

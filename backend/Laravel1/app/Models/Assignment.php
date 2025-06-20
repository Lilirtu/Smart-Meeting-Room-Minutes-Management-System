<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $table = 'Assignment';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'NotificationId',
        'MeetingId',
        'Description',
        'DueDate',
    ];

    public function notification()
    {
        return $this->belongsTo(Notification::class, 'NotificationId');
    }

    public function meeting()
    {
        return $this->belongsTo(Meeting::class, 'MeetingId');
    }

    public function groupAssignments()
    {
        return $this->hasMany(GroupAssignment::class, 'AssignmentId');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'GroupAssignment', 'AssignmentId', 'UserId');
    }
}

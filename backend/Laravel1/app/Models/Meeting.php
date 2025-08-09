<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $table = 'Meeting';

    protected $primaryKey = 'id';
    public $timestamps = false;
    protected $fillable = [
        'StartTime',
        'EndTime',
        'Date',
        'Title',
        'NumberOfAttendance',
        'ReservationId',
        'MinutesOfMeetingId',
        'AgendaId',
    ];

    public function reservation()
    {
        return $this->hasOne(Reservation::class, 'MeetingId'); // optional
    }

    public function attendees() {
        return $this->hasMany(Attendance::class, 'MeetingId');
    }

    public function minutesOfMeeting()
    {
        return $this->belongsTo(MinutesOfMeeting::class, 'MinutesOfMeetingId');
    }

   public function agenda()
    {
    return $this->hasOne(Agenda::class, 'MeetingId', 'id');
    }
}

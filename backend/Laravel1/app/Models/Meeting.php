<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

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
        return $this->belongsTo(Reservation::class, 'ReservationId');
    }

    public function minutesOfMeeting()
    {
        return $this->belongsTo(MinutesOfMeeting::class, 'MinutesOfMeetingId');
    }

    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'AgendaId');
    }
}

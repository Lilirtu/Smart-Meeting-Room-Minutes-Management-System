<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $table = 'Attachment';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'Link',
        'FileName',
        'MinutesOfMeetingId'
    ];

    public function minutesOfMeeting()
    {
        return $this->belongsTo(MinutesOfMeeting::class, 'MinutesOfMeetingId');
    }
}

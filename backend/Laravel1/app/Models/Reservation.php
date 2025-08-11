<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'Reservation';
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = ['Status', 'StartTime', 'EndTime', 'Date', 'UserId', 'RoomId', 'MeetingId'];

    public function meeting() {
        return $this->hasOne(Meeting::class, 'ReservationId');
    }

    public function room() {
        return $this->belongsTo(Room::class, 'RoomId');
    }
}

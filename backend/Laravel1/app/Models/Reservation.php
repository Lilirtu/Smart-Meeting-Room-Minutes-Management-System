<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'Reservation';
    public $timestamps = false;
    protected $primaryKey = 'Id';
    protected $fillable = ['Status', 'StartTime', 'EndTime', 'Date', 'UserId', 'RoomId'];
}

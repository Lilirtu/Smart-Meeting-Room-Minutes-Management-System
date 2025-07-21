<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'Attendance';
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = ['UserId', 'MeetingId'];
}


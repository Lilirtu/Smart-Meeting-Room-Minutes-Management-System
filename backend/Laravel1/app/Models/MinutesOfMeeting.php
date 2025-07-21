<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MinutesOfMeeting extends Model
{
    protected $table = 'MinutesOfMeeting';
    public $timestamps = false;
    protected $primaryKey = 'id';
    protected $fillable = ['Topic', 'Summary', 'DecisionMade'];
}

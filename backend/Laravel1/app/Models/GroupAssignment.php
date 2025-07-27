<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupAssignment extends Model
{
    protected $table = 'GroupAssignment';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'AssignmentId',
        'UserId',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class, 'AssignmentId');
    }

    public function user()
    {
        return $this->belongsTo(Users::class, 'UserId');
    }
}

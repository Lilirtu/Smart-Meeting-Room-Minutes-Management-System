<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'Notification';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'SenderId',
        'ReceivedId',
        'TimeSent',
        'IsRead',
    ];

    public function sender()
    {
        return $this->belongsTo(Users::class, 'SenderId');
    }

    public function receiver()
    {
        return $this->belongsTo(Users::class, 'ReceivedId');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'NotificationId');
    }
}

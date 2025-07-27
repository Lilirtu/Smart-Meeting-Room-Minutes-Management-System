<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    // Table name must match exactly
    protected $table = 'Agenda';
    public $timestamps = false; // No created_at or updated_at columns
    protected $primaryKey = 'Id'; // Primary key column

    // Allow mass assignment on these fields
    protected $fillable = ['Title', 'Description'];
    public function agenda()
{
    // The foreign key in Agenda is 'MeetingId', the local key in Meeting is 'id'
    return $this->hasOne(Agenda::class, 'MeetingId', 'id');
}
}

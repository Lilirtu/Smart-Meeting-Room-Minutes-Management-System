<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    // Table name must match exactly
    protected $table = 'Agenda';
    public $timestamps = false; // No created_at or updated_at columns
    protected $primaryKey = 'id'; // Primary key column

    // Allow mass assignment on these fields
    protected $fillable = ['Title', 'Description'];
}
<?php 

namespace App\Models; // Where the file lives

use Illuminate\Database\Eloquent\Model; // Allows the class to talk to the database and use Eloquent ORM functions

class Room extends Model 
{ 
    protected $table = 'Room'; 
    
    protected $primaryKey = 'Id'; 
    
    public $timestamps = false; 
    
    protected $fillable = ['Name', 'Location', 'Capacity']; 

   
    public function features() 
    {
        return $this->belongsToMany(Feature::class, 'RoomFeature', 'RoomId', 'FeatureId');
    }

    public function meetings()
    {
        return $this->hasMany(Meeting::class, 'RoomId');
    }
}

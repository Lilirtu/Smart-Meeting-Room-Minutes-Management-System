<?php 

namespace App\Models; // Where the file lives

use Illuminate\Database\Eloquent\Model; // it make the class to be able to talk to the database and use functions

class Feature extends Model { 

    protected $table = 'Feature'; // let laravel know in which table we work to avoid confusion because laravel take the default exemple users for User and here we use Users so to not make confusion
    protected $primaryKey = 'Id'; // same idea by default laravel take th ename of the primary key id not Id so to avoid errors and not found columns
    public $timestamps = false; // Laravel automatically expects and manages two timestamp columns: created_at and updated_at. If your table does not have these columns, you set this to false to prevent errors.
    protected $fillable = ['FeatureName', 'Description']; // to let laravel know which columns can be filled because by defaults it blocks the assignment on all field

    public function rooms() {
        return $this->belongsToMany(Room::class, 'RoomFeature', 'FeatureId', 'RoomId');

        // belongsToMany defines a many-to-many relationship between Feature and Room.
        //'Room::class' is the related model.
        // 'RoomFeature' is again the table where the data will be retrived.
        //'FeatureId' is the foreign key in the table where the data will be retrived referring to the current model (Feature).
        //'RoomId' is the foreign key in the table where the data will be retrived referring to the related model (Room).
        // If you have a feature, you can do $feature->rooms and get a collection of all rooms that have that feature 
    }   

}
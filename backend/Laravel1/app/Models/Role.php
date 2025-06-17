<?php 

namespace App\Models; // Where the file lives

use Illuminate\Database\Eloquent\Model; // it make the class to be able to talk to the database and use functions

class Role extends Model { 

    protected $table = 'Role'; // let laravel know in which table we work to avoid confusion because laravel take the default
    protected $primaryKey = 'Id'; // same idea by default laravel take th name of the primary key id not Id so to avoid errors and not found columns
    public $timestamps = false; // Laravel automatically expects and manages two timestamp columns: created_at and updated_at. If your table does not have these columns, you set this to false to prevent errors.
    protected $fillable = ['RoleName', 'Description']; // to let laravel know which columns can be filled because by defaults it blocks the assignment on all field
    
    public function users(){
        return $this->hasMany(Users::class, 'RoleId', 'Id');
        // this method list all the users that has this role id
        // Users::calss is the child model that use role 
        // RoleId is the name of the foreign key in the Users 
        //Id is the name of the primary key in Role table
    }

}
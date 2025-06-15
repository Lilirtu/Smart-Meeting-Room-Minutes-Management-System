<?php 

namespace App\Models; // Where the file lives

use Illuminate\Database\Eloquent\Model; // it make the class to be able to talk to the database and use functions

class Users extends Model { 

    protected $table = 'Users'; // let laravel know in which table we work to avoid confusion because laravel take the default exemple users for User and here we use Users so to not make confusion
    protected $primaryKey = 'Id'; // same idea by default laravel take th ename of the primary key id not Id so to avoid errors and not found columns
    public $timestamps = false; // Laravel automatically expects and manages two timestamp columns: created_at and updated_at. If your table does not have these columns, you set this to false to prevent errors.
    protected $fillable = ['FullName', 'Email', 'Password', 'RoleId']; // to let laravel know which columns can be filled because by defaults it blocks the assignment on all field
    protected $hidden = ['Password']; // to hide some sensitive information and not share it raw 

    //This methods in laravel i used to define a many to many relationship in terms of sql
    public function role(){
        return $this->belongsTo(Role::class, 'RoleId', 'Id');
        // this has a foreign key that belongs to the Role model class (table). 
        // RoleId is the foreign key in the current model (Users) 
        // Id is the primary key in the model it belongs to 
    }

}





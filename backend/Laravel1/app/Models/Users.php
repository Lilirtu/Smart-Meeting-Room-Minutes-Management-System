<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Users extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'Users';  // your table name
    protected $primaryKey = 'id';  // keep your primary key if it's lowercase 'id'; if your DB has 'ID', set 'ID'

    public $timestamps = false;  // as you said, your table doesn’t have created_at/updated_at

    protected $fillable = ['FullName', 'Email', 'Password', 'RoleId'];  // correct fillables

    protected $hidden = ['Password'];  // hide hashed password

    /*protected function casts(): array
    {
        return [
            'Password' => 'hashed',
        ];
    }*/

    /**
     * Override the method that tells Laravel which column is the username identifier.
     */
    public function getAuthIdentifierName()
    {
        return 'id';  // matches your DB column exactly (case-sensitive)
    }

    /**
     * Override the method to tell Laravel how to get the password field.
     */
    public function getAuthPassword()
    {
        return $this->Password;  // matches your DB column exactly (case-sensitive)
    }

    /**
     * Add accessors & mutators so Laravel can read/write to your uppercase columns properly.
     */
    public function getEmailAttribute()
    {
        return $this->attributes['Email'] ?? null;
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['Email'] = $value;
    }

    public function getPasswordAttribute()
    {
        return $this->attributes['Password'] ?? null;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['Password'] = $value;
    }

    public function getFullNameAttribute()
    {
        return $this->attributes['FullName'] ?? null;
    }

    public function setFullNameAttribute($value)
    {
        $this->attributes['FullName'] = $value;
    }

    /**
     * Define your relationship to the Role model.
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'RoleId', 'Id');
    }
}

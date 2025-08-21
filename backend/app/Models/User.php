<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = ['email', 'password','role_id'];


    public $incrementing = false; // Disable auto-increment
    protected $keyType = 'string'; // Key type is string



    protected static function boot()
    {
        parent::boot();

        // Generate UUID when creating a new user
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    // Optional: Relationship to Role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

       public function clinic()
    {
        return $this->hasOne(Clinic::class);
    }
}

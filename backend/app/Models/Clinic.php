<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clinic extends Model
{
    use HasFactory;

    // Fields allowed for mass assignment
    protected $fillable = [
        'clinic_name',
        'adress',
        'phone_number_1',
        'phone_number_2',
        'wilaya_number',
        'clinic_email',
        'clinic_logo_512',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class); //
    }

    // Encrypt sensitive fields automatically
    protected $casts = [
        'adress' => 'encrypted',
        'phone_number_1' => 'encrypted',
        'phone_number_2' => 'encrypted',
        'clinic_email' => 'encrypted',
    ];
}

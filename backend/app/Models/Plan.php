<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Plan extends Model
{
    // it has factory of deafult plans

     use HasFactory;


    protected $fillable = ["plan_name"];

    //plan has muiltiple subscriptions

    public function Subscriptions (){
        return $this->hasMany(Subscription::class);
    }
}

<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
});

// this is signup of clinic
// version : 1
// auth : false
// role : null
// subscription : null
Route::post('/v1/clinic',[ClinicController::class , 'store']);




// get all clinics in the db
// version : 1
// auth : true
// role : super_admin
// subscription : null
Route::get('/v1/clinic',[ClinicController::class , 'index']);



// this is one somone pay or want ot add subscription
// version : 1
// auth : true
// roles : superAdmin
// subscription : null
Route::post('/v1/subscription',[SubscriptionController::class , 'store']);

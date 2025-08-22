<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web'])->group(function () {
    // this is to enter ur account
    // version : 1
    // auth : false
    // role : null
    // subscription : null
    // midlware : web cuz its http only cookie auth
    // note : need to be fixed to return the plan and subscripton and the role
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




// this is update  clinic
// version : 1
// auth : true
// role : super_admin , clinic (it self)
// subscription : all
Route::post('/v1/clinic-update/{id}',[ClinicController::class , 'update']);




// version : 1
// delete clinics in the db
// auth : true
// role : super_admin
// subscription : null
// note : to do is make it soft delete

Route::delete('/v1/clinic/{id}',[ClinicController::class , 'destroy']);


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



// this when admin want ot chnage subscription
// version : 1
// auth : true
// roles : superAdmin
// subscription : null

Route::put('/v1/subscription/{id}',[SubscriptionController::class , 'update']);

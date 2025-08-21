<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClinicController;
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

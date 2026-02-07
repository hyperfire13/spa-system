<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReservationController;

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services-with-schedules', [ServiceController::class, 'withSchedules']);
Route::get('/services/{service}/slots', [ServiceController::class, 'slots']);
Route::post('/reservations', [ReservationController::class, 'store']);



Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('admin/services', ServiceController::class)
        ->except(['index','show']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

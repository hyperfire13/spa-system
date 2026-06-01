<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AdminAuthController;

Route::middleware('throttle:api')->group(function () {
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services-with-schedules', [ServiceController::class, 'withSchedules']);
    Route::get(
    '/services/curated-skincare',
    [ServiceController::class, 'curatedSkincare']
);
});
Route::get('/services/{service}/slots', [ServiceController::class, 'slots'])->middleware('throttle:slot-query');
Route::post('/reservations', [ReservationController::class, 'store'])->middleware('throttle:reservation');
// throttle is related to the rate limiters defined in AppServiceProvider.php
Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:login');

Route::middleware(['auth:sanctum','throttle:admin-write'])->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);
    // Route::apiResource('admin/services', ServiceController::class)
    //     ->except(['index','show']);
    Route::get('/admin/services', [ServiceController::class,'adminIndex']);
    Route::post('/admin/services', [ServiceController::class,'store']);
    Route::put('/admin/services/{service}', [ServiceController::class,'update']);
    Route::delete('/admin/services/{service}', [ServiceController::class,'destroy']);
    Route::get('/admin/reservations',
        [ReservationController::class, 'adminIndex']
    );
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

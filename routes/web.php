<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingPageController;


// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', function () {
    return view('welcome');
});

// Route::resource('admin/services',LandingPageController::class);


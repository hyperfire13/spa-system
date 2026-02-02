<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingPageController;


// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');

// Route::resource('admin/services',LandingPageController::class);


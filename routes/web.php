<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingPageController;


// Route::get('/', function () {
//     return view('welcome');
// });

// this will make sure that when the page reloads, laravel will not render UI from its controllers
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');

// Route::resource('admin/services',LandingPageController::class);


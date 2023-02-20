<?php

use App\Http\Controllers\BrandsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('cashregister');
})->name('cashregister');

Route::get('/brands', [BrandsController::class, 'index'])->name('brands');
Route::get('/brands/{id}/{lang?}', [BrandsController::class, 'show'])->name('brands.show');
Route::post('/brands/update/{id}', [BrandsController::class, 'update'])->name('brands.update');




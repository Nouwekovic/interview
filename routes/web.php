<?php

use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\ShopController;
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
});

Route::get('/api/cashregisters/fk/{foreignKey}', [CashRegisterController::class, 'index']);
Route::get('/api/cashregisters/{id}', [CashRegisterController::class, 'show']);
Route::put('/api/cashregisters/up/{id}', [CashRegisterController::class, 'update']);
Route::get('/api/shops/{id}', [ShopController::class, 'show']);
Route::get('/api/shops/', [ShopController::class, 'index']);

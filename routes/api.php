<?php

use App\Http\Controllers\CashRegisterController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UsersCashRegisterController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('cashregisters/fk/{foreignKey}', [CashRegisterController::class, 'index']);
Route::get('cashregisters/{id}', [CashRegisterController::class, 'show']);
Route::put('cashregisters/up/{id}', [CashRegisterController::class, 'update']);
Route::get('shops/{id}', [ShopController::class, 'show']);
Route::get('shops/', [ShopController::class, 'index']);
Route::get('users/', [UsersController::class, 'index']);
Route::put('users-cashregisters/{userId}/{cashRegisterId}', [UsersCashRegisterController::class, 'store']);

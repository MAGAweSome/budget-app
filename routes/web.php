<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncomeController;
use Illuminate\Support\Facades\Route;

// This is the root URL. If the user is authenticated, it will show the dashboard.
// Otherwise, the 'auth' middleware will redirect them to the login page.
Route::get('/', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('budget-dashboard');

// This is the API route for adding a new income source.
// It uses the same 'auth' middleware to protect it.
Route::post('/incomes', [IncomeController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('incomes.store');

Route::get('/user/incomes', [DashboardController::class, 'getIncomes'])
    ->middleware(['auth', 'verified'])
    ->name('incomes.get');

// The following route files will be loaded as well.
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
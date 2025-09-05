<?php

use App\Http\Controllers\AllocationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::apiResource('allocations', AllocationController::class);
});

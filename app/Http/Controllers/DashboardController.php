<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Income;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the user's budgeting dashboard.
     */
    public function index(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Fetch the user's incomes
        $incomes = $user->incomes()->get();
        $totalIncome = $incomes->sum('amount');

        // Pass all the data to the Inertia page.
                return Inertia::render('dashboard', [
            'incomes' => $incomes,
            'totalIncome' => $totalIncome
        ]);
    }

    /**
     * Get the user's incomes as a JSON response.
     */
    public function getIncomes(Request $request)
    {
        $user = $request->user();
        $incomes = $user->incomes()->get();
        $totalIncome = $incomes->sum('amount');

        return response()->json([
            'incomes' => $incomes,
            'totalIncome' => $totalIncome
        ]);
    }
}
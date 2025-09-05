<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    /**
     * Store a new income source in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|string|in:monthly,bi-weekly,weekly,one-time',
        ]);

        // 2. Create a new Income record for the authenticated user
        $income = Auth::user()->incomes()->create($validatedData);

        // 3. Return a JSON response to the front end
        return response()->json([
            'message' => 'Income added successfully!',
            'income' => $income,
        ], 201);
    }
}

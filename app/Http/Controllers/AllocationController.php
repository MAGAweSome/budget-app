<?php

namespace App\Http\Controllers;

use App\Models\Allocation;
use Illuminate\Http\Request;

class AllocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $request->user()->allocations()->with(['category', 'income'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'income_id' => 'required|exists:incomes,id',
            'category_id' => 'required|exists:categories,id',
            'percentage_allocated' => 'nullable|numeric|min:0|max:100',
            'amount_allocated' => 'nullable|numeric|min:0',
        ]);

        // Ensure only one of percentage_allocated or amount_allocated is provided
        if (isset($validated['percentage_allocated']) && isset($validated['amount_allocated'])) {
            return response()->json(['message' => 'Cannot allocate by both percentage and amount.'], 422);
        }

        if (!isset($validated['percentage_allocated']) && !isset($validated['amount_allocated'])) {
            return response()->json(['message' => 'Either percentage or amount must be allocated.'], 422);
        }

        $allocation = $request->user()->allocations()->create($validated);

        return $allocation->load(['category', 'income']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Allocation $allocation)
    {
        $this->authorize('update', $allocation);

        $validated = $request->validate([
            'income_id' => 'required|exists:incomes,id',
            'category_id' => 'required|exists:categories,id',
            'percentage_allocated' => 'nullable|numeric|min:0|max:100',
            'amount_allocated' => 'nullable|numeric|min:0',
        ]);

        // Ensure only one of percentage_allocated or amount_allocated is provided
        if (isset($validated['percentage_allocated']) && isset($validated['amount_allocated'])) {
            return response()->json(['message' => 'Cannot allocate by both percentage and amount.'], 422);
        }

        if (!isset($validated['percentage_allocated']) && !isset($validated['amount_allocated'])) {
            return response()->json(['message' => 'Either percentage or amount must be allocated.'], 422);
        }

        $allocation->update($validated);

        return $allocation->load(['category', 'income']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Allocation $allocation)
    {
        $this->authorize('delete', $allocation);

        $allocation->delete();

        return response()->noContent();
    }
}

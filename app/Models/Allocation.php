<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Allocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'income_id',
        'category_id',
        'percentage_allocated',
        'amount_allocated',
        'user_id'
    ];

    /**
     * An allocation belongs to a specific income source.
     */
    public function income()
    {
        return $this->belongsTo(Income::class);
    }

    /**
     * An allocation belongs to a specific category.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * An allocation belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
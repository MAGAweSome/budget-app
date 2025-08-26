<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'amount',
        'frequency',
        'user_id'
    ];

    /**
     * An income belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * An income can be allocated to many categories.
     */
    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'target_amount',
        'current_amount',
        'target_date',
        'user_id'
    ];

    /**
     * A goal belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

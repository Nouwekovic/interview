<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cashregister extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'data'
    ];

    protected $casts = [
        'data' => 'json',
    ];


    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}

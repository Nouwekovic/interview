<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsersCashregister extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'cash_register_id',
    ];

    public function users()
    {
        return $this->belongsToMany(Users::class);
    }

    public function cashRegisters()
    {
        return $this->belongsToMany(CashRegister::class);
    }

}

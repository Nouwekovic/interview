<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users_cashregisters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('cash_register_id');
            $table->json('total')->nullable();
            $table->json('reserve')->nullable();
            $table->json('bank')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users_cashregisters');
    }
};

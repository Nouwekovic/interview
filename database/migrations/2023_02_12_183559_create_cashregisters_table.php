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
        Schema::create('cashregisters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id');
            $table->json('data')->nullable();
            $table->timestamps();
            $table->foreign('shop_id')
                ->references('id')->on('shops')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cashregisters');
    }
};

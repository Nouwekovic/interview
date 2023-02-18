<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Cashregister;
use App\Models\Shop;
use App\Models\Users;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        Shop::factory(3)->create();
        for($i=0 ; $i <= 9 ; $i++)
        {
            Cashregister::factory()->create([
                'shop_id' => fake()->numberBetween(1,3)
            ]);
        }
         Users::factory(10)->create();
    }
}

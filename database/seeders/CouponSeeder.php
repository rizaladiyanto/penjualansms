<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Coupon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Coupon::create([
            'code' => 'POTONG10K',
            'discount_amount' => 10000,
            'valid_until' => now()->addDays(10),
            'quota' => 100,
        ]);        
    }
}

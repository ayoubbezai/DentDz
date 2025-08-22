<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $plans = ["basic", "pro", "enterprise"];

foreach ($plans as $plan) {
    \App\Models\Plan::create([
        'plan_name' => $plan,
    ]);
}
    }
}

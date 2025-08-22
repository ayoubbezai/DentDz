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
        $plans = [
            ['name' => 'basic', 'value' => 1],
            ['name' => 'pro', 'value' => 2],
            ['name' => 'enterprise', 'value' => 3]
        ];

        foreach ($plans as $plan) {
            \App\Models\Plan::create([
                'plan_name' => $plan['name'],
                'value' => $plan['value'],
            ]);
        }
    }
}

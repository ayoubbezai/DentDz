<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

$roles = ["super_admin", "clinic", "dentist", "receptionist", "patient"];

foreach ($roles as $role) {
    \App\Models\Role::create([
        'name' => $role,
    ]);
}}
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Spatie\Permission\Models\Role::findOrCreate('root');
        \Spatie\Permission\Models\Role::findOrCreate('super admin');
        \Spatie\Permission\Models\Role::findOrCreate('manager');
        \Spatie\Permission\Models\Role::findOrCreate('user');
        \Spatie\Permission\Models\Role::findOrCreate('smm');
        \Spatie\Permission\Models\Role::findOrCreate('ppc');
        \Spatie\Permission\Models\Role::findOrCreate('content');
        \Spatie\Permission\Models\Role::findOrCreate('designer');
        \Spatie\Permission\Models\Role::findOrCreate('developer');
        \Spatie\Permission\Models\Role::findOrCreate('seo');
        \Spatie\Permission\Models\Role::findOrCreate('video editor');
        \Spatie\Permission\Models\Role::findOrCreate('web designer');
        \Spatie\Permission\Models\Role::findOrCreate('web developer');
        \Spatie\Permission\Models\Role::findOrCreate('accountant');
        \Spatie\Permission\Models\Role::findOrCreate('sales');
        \Spatie\Permission\Models\Role::findOrCreate('customer service');
        \Spatie\Permission\Models\Role::findOrCreate('hr');
        \Spatie\Permission\Models\Role::findOrCreate('project manager');
        \Spatie\Permission\Models\Role::findOrCreate('demo');
    }
}

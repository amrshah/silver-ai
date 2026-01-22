<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AppletSeeder::class,
        ]);

        $user = User::updateOrCreate(
            ['email' => 'amr.shah@gmail.com'],
            [
                'name' => 'Amr Shah',
                'password' => bcrypt('Password123'),
                'is_admin' => true,
                'role' => 'CEO / Founder'
            ]
        );
        \Amrshah\Arbac\Facades\Arbac::assignRole($user, 'root');

        $demoUsers = [
            'root'            => ['name' => 'Root Admin',      'email' => 'root@elara.com',    'title' => 'System Root'],
            'super admin'     => ['name' => 'Admin User',      'email' => 'admin@elara.com',   'title' => 'Administrator'],
            'manager'         => ['name' => 'Manager User',    'email' => 'manager@elara.com', 'title' => 'General Manager'],
            'smm'             => ['name' => 'SMM Expert',      'email' => 'smm@elara.com',     'title' => 'SMM Specialist'],
            'ppc'             => ['name' => 'PPC Pro',         'email' => 'ppc@elara.com',     'title' => 'PPC Expert'],
            'content'         => ['name' => 'Content Creator', 'email' => 'content@elara.com', 'title' => 'Content Creator'],
            'developer'       => ['name' => 'Dev Guru',        'email' => 'dev@elara.com',     'title' => 'Web Developer'],
            'seo'             => ['name' => 'SEO Strategist',  'email' => 'seo@elara.com',     'title' => 'SEO Strategist'],
            'sales'           => ['name' => 'Sales Lead',      'email' => 'sales@elara.com',   'title' => 'Sales Executive'],
            'hr'              => ['name' => 'HR Manager',      'email' => 'hr@elara.com',      'title' => 'Human Resources'],
            'project manager' => ['name' => 'PM Lead',         'email' => 'pm@elara.com',      'title' => 'Project Manager'],
        ];

        foreach ($demoUsers as $roleName => $data) {
            $u = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => bcrypt('12345678'),
                    'is_admin' => in_array($roleName, ['root', 'super admin']),
                    'role' => $data['title']
                ]
            );
            \Amrshah\Arbac\Facades\Arbac::assignRole($u, $roleName);
        }
    }
}

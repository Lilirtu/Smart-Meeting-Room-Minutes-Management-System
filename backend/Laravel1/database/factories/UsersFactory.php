<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Role;
class UsersFactory extends Factory
{
    protected $model = \App\Models\Users::class;

    public function definition()
    {
        return [
            'FullName' => $this->faker->name(),
            'Email' => $this->faker->unique()->safeEmail(),
            'Password' => bcrypt('password'), // default password
            'RoleId' => Role::inRandomOrder()->first()->id,
        ];
    }
}

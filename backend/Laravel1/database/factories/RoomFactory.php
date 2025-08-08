<?php
    namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Room;  // ADD THIS LINE

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition()
    {
        return [
            'Name' => $this->faker->company . ' Room',
            'Location' => $this->faker->address,
            'Capacity' => $this->faker->numberBetween(4, 20),
            'Image' => 'https://picsum.photos/seed/' . $this->faker->unique()->word . '/600/400',
        ];
    }
}

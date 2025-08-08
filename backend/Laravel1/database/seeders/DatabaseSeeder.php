<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Users;
use App\Models\Room;
use App\Models\Role;
use App\Models\Feature;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // ✅ Create Roles
        $rolesData = [
            ['RoleName' => 'Admin', 'Description' => 'Full control of the system'],
            ['RoleName' => 'Employee', 'Description' => 'Can book rooms'],
            ['RoleName' => 'Guest', 'Description' => 'Can view rooms only'],
        ];
        Role::insert($rolesData);
        // ✅ Create 10 Users
        Users::factory(10)->create();

        // ✅ Create 5 Rooms with random images
        $rooms = Room::factory(5)->create();

        // ✅ Insert 5 Features
        $featuresData = [
    ['FeatureName' => 'Projector', 'Description' => 'High-resolution projector for presentations'],
    ['FeatureName' => 'Whiteboard', 'Description' => 'Large whiteboard with markers included'],
    ['FeatureName' => 'Video Conference', 'Description' => 'HD video conferencing setup with microphone'],
    ['FeatureName' => 'Air Conditioning', 'Description' => 'Climate-controlled room for comfort'],
    ['FeatureName' => 'High-Speed WiFi', 'Description' => 'Reliable, fast internet connection'],
];

        Feature::insert($featuresData);

        $featureIds = Feature::pluck('id');

        // ✅ Attach random features to rooms
        foreach ($rooms as $room) {
            $randomFeatures = $featureIds->random(rand(2, 5));
            foreach ($randomFeatures as $featureId) {
                DB::table('RoomFeature')->insert([
                    'RoomId' => $room->id,
                    'FeatureId' => $featureId,
                ]);
            }
        }
    }
}

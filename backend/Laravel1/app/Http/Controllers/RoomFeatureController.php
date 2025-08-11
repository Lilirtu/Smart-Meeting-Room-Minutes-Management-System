<?php

namespace App\Http\Controllers;

use App\Models\RoomFeature;
use Illuminate\Http\Request;

class RoomFeatureController extends Controller {

    public function index() {
        return RoomFeature::all();
    }

    public function show($id) {
        return RoomFeature::findOrFail($id);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'RoomId'    => 'required|integer|exists:rooms,id',
            'FeatureId' => 'required|integer|exists:features,id',
        ]);

        $roomFeature = RoomFeature::create($data);
        return response()->json($roomFeature, 201);
    }

    public function update(Request $request, $id) {
        $roomFeature = RoomFeature::findOrFail($id);

        $data = $request->validate([
            'RoomId'    => 'sometimes|integer|exists:rooms,id',
            'FeatureId' => 'sometimes|integer|exists:features,id',
        ]);

        $roomFeature->update($data);

        return response()->json($roomFeature);
    }

    public function destroy($id) {
        $roomFeature = RoomFeature::findOrFail($id);
        $roomFeature->delete();

        return response()->json(null, 204);
    }
}

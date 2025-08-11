<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use Illuminate\Http\Request;

class FeatureController extends Controller {

    public function index() {
        return Feature::all();
    }

    public function show($id) {
        return Feature::findOrFail($id);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'FeatureName' => 'required|string|max:255',
        ]);

        $feature = Feature::create($data);

        return response()->json($feature, 201);
    }

    public function update(Request $request, $id) {
        $feature = Feature::findOrFail($id);

        $data = $request->validate([
            'FeatureName' => 'required|string|max:255',
        ]);

        $feature->update($data);

        return response()->json($feature);
    }

    public function destroy($id) {
        $feature = Feature::findOrFail($id);
        $feature->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class FeatureController extends Controller
{
    // GET /api/feature
    public function index()
    {
        return DB::table('Feature')
            ->select('id', 'FeatureName')
            ->orderBy('FeatureName')
            ->get();
    }

    // GET /api/feature/{id}
    public function show($id)
    {
        return DB::table('Feature')
            ->select('id', 'FeatureName', 'Description')
            ->where('id', $id)
            ->first();
    }
}

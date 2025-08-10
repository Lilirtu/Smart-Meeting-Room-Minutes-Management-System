<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomFeatureController extends Controller
{
    // GET /api/room/{roomId}/features
    public function listForRoom($roomId)
    {
        $rows = DB::table('RoomFeature as rf')
            ->join('Feature as f', 'rf.FeatureId', '=', 'f.id')
            ->where('rf.RoomId', $roomId)
            ->select('rf.FeatureId', 'f.FeatureName')
            ->orderBy('f.FeatureName')
            ->get();

        return [
            'RoomId'     => (int)$roomId,
            'FeatureIds' => $rows->pluck('FeatureId')->map(fn($v) => (int)$v)->values(),
            'Features'   => $rows->pluck('FeatureName')->values(),
        ];
    }

    // POST /api/room/{roomId}/features
    // body: { "FeatureIds": [1,2,3] }
    public function syncForRoom($roomId, Request $req)
    {
        $data = $req->validate([
            'FeatureIds'   => 'array',
            'FeatureIds.*' => 'integer|exists:Feature,id',
        ]);

        DB::table('RoomFeature')->where('RoomId', $roomId)->delete();

        if (!empty($data['FeatureIds'])) {
            $rows = array_map(fn($fid) => ['RoomId' => (int)$roomId, 'FeatureId' => (int)$fid], $data['FeatureIds']);
            DB::table('RoomFeature')->insert($rows);
        }

        return response()->json(['ok' => true]);
    }
}

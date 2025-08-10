<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    // GET /api/room
    public function index()
    {
        // 1) Get all rooms
        $rooms = Room::select('id', 'Name', 'Location', 'Capacity')->get();

        // 2) Build features per room (names + ids)
        $featureRows = DB::table('RoomFeature as rf')
            ->join('Feature as f', 'rf.FeatureId', '=', 'f.id')
            ->select('rf.RoomId', 'rf.FeatureId', 'f.FeatureName')
            ->get();

        $featuresByRoom = [];
        foreach ($featureRows as $row) {
            $rid = (int)$row->RoomId;
            $featuresByRoom[$rid]['names'][] = $row->FeatureName;
            $featuresByRoom[$rid]['ids'][]   = (int)$row->FeatureId;
        }

        // 3) Return PascalCase + Features/FeatureIds
        return $rooms->map(function ($r) use ($featuresByRoom) {
            $rid = (int)$r->id;
            $f   = $featuresByRoom[$rid] ?? ['names' => [], 'ids' => []];

            return [
                'Id'         => $rid,
                'Name'       => $r->Name,
                'Location'   => $r->Location,
                'Capacity'   => (int)$r->Capacity,
                'Features'   => array_values($f['names']),
                'FeatureIds' => array_values($f['ids']),
            ];
        });
    }

    // GET /api/room/{room}
    public function show(Room $room)
    {
        $rid = (int)$room->id;

        $featureRows = DB::table('RoomFeature as rf')
            ->join('Feature as f', 'rf.FeatureId', '=', 'f.id')
            ->where('rf.RoomId', $rid)
            ->select('rf.FeatureId', 'f.FeatureName')
            ->get();

        return [
            'Id'         => $rid,
            'Name'       => $room->Name,
            'Location'   => $room->Location,
            'Capacity'   => (int)$room->Capacity,
            'Features'   => $featureRows->pluck('FeatureName')->values(),
            'FeatureIds' => $featureRows->pluck('FeatureId')->map(fn($v) => (int)$v)->values(),
        ];
    }

    // POST /api/room
    public function store(Request $req)
    {
        $data = $req->validate([
            'Name'         => 'required|string|max:255',
            'Location'     => 'required|string|max:255',
            'Capacity'     => 'required|integer|min:1',
            'FeatureIds'   => 'array',
            'FeatureIds.*' => 'integer|exists:Feature,id',
        ]);

        $room = new Room();
        $room->Name     = $data['Name'];
        $room->Location = $data['Location'];
        $room->Capacity = $data['Capacity'];
        $room->save();

        if (!empty($data['FeatureIds'])) {
            $rows = array_map(fn($fid) => ['RoomId' => $room->id, 'FeatureId' => (int)$fid], $data['FeatureIds']);
            DB::table('RoomFeature')->insert($rows);
        }

        return response()->json(['Id' => (int)$room->id], 201);
    }

    // PUT /api/room/{room}
    public function update(Request $req, Room $room)
    {
        $data = $req->validate([
            'Name'         => 'required|string|max:255',
            'Location'     => 'required|string|max:255',
            'Capacity'     => 'required|integer|min:1',
            'FeatureIds'   => 'array',
            'FeatureIds.*' => 'integer|exists:Feature,id',
        ]);

        $room->Name     = $data['Name'];
        $room->Location = $data['Location'];
        $room->Capacity = $data['Capacity'];
        $room->save();

        if (array_key_exists('FeatureIds', $data)) {
            DB::table('RoomFeature')->where('RoomId', $room->id)->delete();
            if (!empty($data['FeatureIds'])) {
                $rows = array_map(fn($fid) => ['RoomId' => $room->id, 'FeatureId' => (int)$fid], $data['FeatureIds']);
                DB::table('RoomFeature')->insert($rows);
            }
        }

        return response()->json(['ok' => true]);
    }

    // DELETE /api/room/{room}
    public function destroy(Room $room)
    {
        DB::table('RoomFeature')->where('RoomId', $room->id)->delete();
        $room->delete();
        return response()->json(['ok' => true]);
    }

    // Optional: simple stats without Status
    public function stats()
    {
        $total = Room::count();
        return [
            'totalRooms'     => $total,
            'bookedRooms'    => 0,
            'availableRooms' => $total,
        ];
    }
}

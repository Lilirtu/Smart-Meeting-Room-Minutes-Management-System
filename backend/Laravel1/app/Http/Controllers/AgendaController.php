<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    // GET /api/agenda
    public function index()
    {
        return response()->json(Agenda::all(), 200);
    }

    // GET /api/agenda/{id}
    public function show($id)
    {
        $agenda = Agenda::find($id);

        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }

        return response()->json($agenda, 200);
    }

    // POST /api/agenda
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'meeting_id' => 'required|integer',
        ]);

        $agenda = Agenda::create($request->all());

        return response()->json($agenda, 201);
    }

    // PUT /api/agenda/{id}
    public function update(Request $request, $id)
    {
        $agenda = Agenda::find($id);

        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }

        $agenda->update($request->all());

        return response()->json($agenda, 200);
    }

    // DELETE /api/agenda/{id}
    public function destroy($id)
    {
        $agenda = Agenda::find($id);

        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }

        $agenda->delete();

        return response()->json(['message' => 'Agenda deleted'], 200);
    }
}

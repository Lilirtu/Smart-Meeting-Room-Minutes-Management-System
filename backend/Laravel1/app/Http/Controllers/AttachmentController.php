<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attachment;

class AttachmentController extends Controller
{
    // GET /api/attachment
    public function index()
    {
        return response()->json(Attachment::all(), 200);
    }

    // GET /api/attachment/{id}
    public function show($id)
    {
        $attachment = Attachment::find($id);

        if (!$attachment) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        return response()->json($attachment, 200);
    }

    // POST /api/attachment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Link' => 'nullable|string',
            'FileName' => 'nullable|string|max:255',
            'MinutesOfMeetingId' => 'required|integer|exists:MinutesOfMeeting,id',
        ]);

        $attachment = Attachment::create($validated);

        return response()->json($attachment, 201);
    }

    // PUT /api/attachment/{id}
    public function update(Request $request, $id)
    {
        $attachment = Attachment::find($id);

        if (!$attachment) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        $validated = $request->validate([
            'Link' => 'nullable|string',
            'FileName' => 'nullable|string|max:255',
            'MinutesOfMeetingId' => 'required|integer|exists:MinutesOfMeeting,id',
        ]);

        $attachment->update($validated);

        return response()->json($attachment, 200);
    }

    // DELETE /api/attachment/{id}
    public function destroy($id)
    {
        $attachment = Attachment::find($id);

        if (!$attachment) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted'], 200);
    }
}

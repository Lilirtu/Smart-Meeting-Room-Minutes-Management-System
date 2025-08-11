import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { API_BASE, authHeaders } from '../../helpers/api';


export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/room`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rooms;
    return rooms.filter((r) => {
      const name = String(r.Name ?? r.name ?? '').toLowerCase();
      const loc  = String(r.Location ?? r.location ?? '').toLowerCase();
      return name.includes(term) || loc.includes(term);
    });
  }, [rooms, q]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      const res = await fetch(`${API_BASE}/room/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRooms((prev) => prev.filter((r) => (r.Id ?? r.id) !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEdit = (room) => {
    navigate({
      pathname: '/add-room',
      search: createSearchParams({ id: room.Id ?? room.id }).toString(),
    });
  };

  if (loading) return <div className="card">Loading rooms…</div>;
  if (error) return <div className="card">Error: {error}</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Rooms</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="search"
            placeholder="Search name or location…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              minWidth: 220,
            }}
          />
          <button
            type="button"
            onClick={() => navigate('/add-room')}
            className="primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #2563eb',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <FaPlus aria-hidden />
            Add Room
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ marginTop: 16 }}>No rooms found.</p>
      ) : (
        <table className="table" style={{ marginTop: 16, width: '100%' }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Features</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((room) => {
              const id = room.Id ?? room.id;
              const name = room.Name ?? room.name;
              const location = room.Location ?? room.location;
              const capacity = room.Capacity ?? room.capacity;
              const features = room.Features ?? room.features ?? [];

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{location}</td>
                  <td>{capacity}</td>
                  <td>
                    {features.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {features.map((f, i) => (
                          <span
                            key={`${id}-f-${i}`}
                            className="chip"
                            style={{
                              padding: '4px 8px',
                              borderRadius: 999,
                              border: '1px solid #d1d5db',
                              background: '#f3f4f6',
                              fontSize: 12,
                              whiteSpace: 'nowrap',
                            }}
                            title={f}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="actions">
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(room)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          color: '#111827',
                          cursor: 'pointer',
                        }}
                        aria-label={`Edit room ${name}`}
                        title="Edit"
                      >
                        <FaEdit aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid #ef4444',
                          background: '#fff',
                          color: '#b91c1c',
                          cursor: 'pointer',
                        }}
                        aria-label={`Delete room ${name}`}
                        title="Delete"
                      >
                        <FaTrash aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button
        type="button"
        onClick={() => navigate('/register')}
        style={{
          marginTop: '16px',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #2563eb',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Register User
      </button>

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
    </div>
  );
}

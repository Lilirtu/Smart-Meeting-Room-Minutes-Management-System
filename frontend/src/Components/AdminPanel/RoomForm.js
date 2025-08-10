import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE, authHeaders } from '../../helpers/api';
import './RoomForm.css';

export default function RoomForm() {
  const [sp] = useSearchParams();
  const editingId = useMemo(() => sp.get('id'), [sp]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: '',
    Location: '',
    Capacity: '',
    FeatureIds: [],
  });

  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(!!editingId);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch all features
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/feature`, { headers: authHeaders() });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const list = await r.json();
        setAllFeatures(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFeatures(false);
      }
    })();
  }, []);

  // Load room data if editing
  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/room/${editingId}`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const r = await res.json();
        setFormData({
          Name: r.Name ?? '',
          Location: r.Location ?? '',
          Capacity: String(r.Capacity ?? ''),
          FeatureIds: (r.FeatureIds ?? []).map(Number),
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [editingId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const onChangeFeatures = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setFormData((s) => ({ ...s, FeatureIds: values }));
  };

  const selectAll = () => {
    setFormData((s) => ({ ...s, FeatureIds: allFeatures.map((f) => f.id) }));
  };

  const clearAll = () => {
    setFormData((s) => ({ ...s, FeatureIds: [] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      Name: formData.Name,
      Location: formData.Location,
      Capacity: Number(formData.Capacity),
      FeatureIds: formData.FeatureIds,
    };

    try {
      const res = await fetch(`${API_BASE}/room${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      await res.json();
      alert(`Room ${editingId ? 'updated' : 'added'} successfully!`);
      navigate('/room-list');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedNames = formData.FeatureIds
    .map((id) => allFeatures.find((f) => f.id === id)?.FeatureName)
    .filter(Boolean);

  if (loading) return <div className="card">Loading room…</div>;

  return (
    <div className="card">
      <h2 className="form-title">{editingId ? 'Edit Room' : 'Add Room'}</h2>
      <p className="form-subtitle">Fill in the room details and choose all applicable features.</p>
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Name *
          <input name="Name" placeholder="e.g., Alpha Room" value={formData.Name} onChange={onChange} required />
        </label>
        <label>
          Location *
          <input name="Location" placeholder="e.g., First Floor" value={formData.Location} onChange={onChange} required />
        </label>
        <label>
          Capacity *
          <input name="Capacity" placeholder="e.g., 12" type="number" min="1" value={formData.Capacity} onChange={onChange} required />
        </label>

        {/* Features Section */}
        {/* Features Section */}
<div className="features-grid">
  <div className="features-col">
    <label className="form-label">Features</label>

    <select
      className="features-select"
      multiple
      size={Math.min(8, Math.max(3, allFeatures.length))}
      value={formData.FeatureIds}
      onChange={onChangeFeatures}
      disabled={loadingFeatures}
    >
      {allFeatures.map((f) => (
        <option key={f.id} value={f.id}>{f.FeatureName}</option>
      ))}
    </select>

    <small className="muted">Hold Ctrl/Cmd to select multiple</small>
  </div>

  <div className="features-actions">
    <button
      type="button"
      className="btn btn-primary btn-sm"
      onClick={selectAll}
      disabled={loadingFeatures || allFeatures.length === 0}
    >
      Select All
    </button>
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={clearAll}
      disabled={loadingFeatures}
    >
      Clear
    </button>
  </div>
</div>


        {/* Actions */}
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : (editingId ? 'Update Room' : 'Add Room')}
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/room-list')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

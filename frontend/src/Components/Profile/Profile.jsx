import React, { useEffect, useState, useMemo } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { API_BASE, authHeaders } from '../../helpers/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/profile`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setUserData(data);
      } catch (e) {
        setError(e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createdAt = useMemo(() => {
    const raw = userData?.user?.createdAt;
    return raw ? new Date(raw).toLocaleString() : '—';
  }, [userData]);

  const updatedAt = useMemo(() => {
    const raw = userData?.user?.updatedAt;
    return raw ? new Date(raw).toLocaleString() : '—';
  }, [userData]);

  if (loading) {
    return <div className="card"><p>Loading profile…</p></div>;
  }
  if (error) {
    return <div className="card"><p style={{ color: 'crimson' }}>Error: {error}</p></div>;
  }
  if (!userData) return null;

  const { user, role } = userData;

  return (
    <div className="card profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>
        <div className="profile-title">
          <h2>My Profile</h2>
          {role?.roleName && (
            <span className="role-badge" title={role?.description || ''}>
              {role.roleName}
            </span>
          )}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-item">
          <span className="label">Full name</span>
          <span className="value">{user?.fullName || '—'}</span>
        </div>
        <div className="profile-item">
          <span className="label">Email</span>
          <span className="value">{user?.email || '—'}</span>
        </div>
        <div className="profile-item">
          <span className="label">User ID</span>
          <span className="value mono">{user?.id}</span>
        </div>
        <div className="profile-item">
          <span className="label">Role ID</span>
          <span className="value mono">{user?.roleId ?? '—'}</span>
        </div>
      </div>

      {role?.description && (
        <div className="role-panel">
          <div className="role-panel-title">Role details</div>
          <p className="role-desc">{role.description}</p>
        </div>
      )}

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Go Back
        </button> 
    </div>
  );
}

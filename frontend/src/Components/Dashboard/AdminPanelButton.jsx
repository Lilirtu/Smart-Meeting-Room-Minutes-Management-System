import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanelButton() {
  const navigate = useNavigate();

  // Read RoleId from the saved "user" in localStorage
  const isAdmin = (() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return false;
      const u = JSON.parse(raw);

      // Support a few possible shapes/names just in case
      const roleId =
        u?.RoleId ??
        u?.roleId ??
        (typeof u?.role === 'number' ? u.role : null) ??
        (localStorage.getItem('RoleId') ? Number(localStorage.getItem('RoleId')) : null);

      return Number(roleId) === 1; // 1 = Admin
    } catch {
      return false;
    }
  })();

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={() => navigate('/room-Management')}
      className="custom-button"
      style={{ marginBottom: 12 }}
    >
      Go to Admin Panel
    </button>
  );
}

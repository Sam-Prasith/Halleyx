import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './AppLayout.css';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="app-sidebar">
        <div className="app-brand">
          <span className="app-brand-icon">◆</span>
          <span className="app-brand-name">Halleyx</span>
        </div>

        <nav className="app-nav">
          <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📦</span>
            <span>Orders</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/config" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">⚙️</span>
            <span>Configure</span>
          </NavLink>
        </nav>

        <div className="app-sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign out">
            ↪
          </button>
        </div>
        <div style={{ padding: '0 14px 14px', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Made with ❤️ in India
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

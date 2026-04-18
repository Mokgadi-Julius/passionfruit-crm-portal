import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Passionfruit" className="sidebar-logo" />
          <h2>Passionfruit CRM</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">💼</span>
            <span>Jobs</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📈</span>
            <span>Analytics</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-button">
            <span className="icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

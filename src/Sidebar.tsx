import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.userId;
  const roleId = user?.roleId;

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.menuTitle}>Menu</h3>
      <nav style={styles.nav}>
        {roleId === 1 && (
          <NavLink
            to="/home"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            Home
          </NavLink>
        )}

        {roleId === 0 && (
          <NavLink
            to="/product/dashboard"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            Product Dashboard
          </NavLink>
        )}

        {userId && (
          <NavLink
            to="/orders" // ✅ Navigates to Orders screen
            style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
            })}
          >
            Orders
          </NavLink>
        )}

        {userId && (
          <NavLink
            to={`/profile/${userId}`}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            Profile
          </NavLink>
        )}
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    position: 'fixed' as const,
    top: '60px',
    left: 0,
    height: 'calc(100vh - 60px)',
    width: '200px',
    background: '#ffffff',
    padding: '24px 16px',
    boxShadow: '4px 0 12px rgba(0, 0, 0, 0.05)',
    borderRight: '1px solid #e5e7eb',
    overflowY: 'auto' as const,
    zIndex: 999,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  menuTitle: {
    marginBottom: '24px',
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  link: {
    textDecoration: 'none',
    color: '#374151',
    fontWeight: 500,
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
  },
  activeLink: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
  },
};


export default Sidebar;

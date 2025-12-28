import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

const TopNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div style={{
      height: '64px',
      backgroundColor: theme.primary,
      color: theme.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* LEFT: Logo & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '48px', display: 'flex', alignItems: 'center', letterSpacing: '0.5px' }}>
          <span style={{ marginRight: '8px', fontSize: '24px' }}>⚙️</span> GearGuard
        </div>
        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          <NavLink to="/" label="Dashboard" active={isActive('/')} />
          <NavLink to="/calendar" label="Calendar" active={isActive('/calendar')} />
          <NavLink to="/equipment" label="Equipment" active={isActive('/equipment')} />
          <NavLink to="/reporting" label="Reporting" active={isActive('/reporting')} />
          <NavLink to="/teams" label="Teams" active={isActive('/teams')} />
        </nav>
      </div>

      {/* RIGHT: User Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ textAlign: 'right', marginRight: '16px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{currentUser?.displayName || 'User'}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>{currentUser?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none', border: 'none', color: theme.white, cursor: 'pointer',
            fontSize: '24px', padding: '8px', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ↪️
        </button>
      </div>
    </div>
  );
};

// Helper Component for Header Links
const NavLink = ({ to, label, active }: any) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={{
      padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500,
      color: theme.white,
      backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      transition: 'background 0.2s',
    }}>
      {label}
    </div>
  </Link>
);

export default TopNavigation;
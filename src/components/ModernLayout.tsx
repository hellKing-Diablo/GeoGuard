import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { theme } from '../theme';

const ModernLayout = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.background, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <TopNavigation />
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet /> {/* Page content will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;
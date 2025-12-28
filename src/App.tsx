import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ModernLayout from './components/ModernLayout';
// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MaintenanceRequestPage from './pages/MaintenanceRequest';
import Calendar from './pages/Calendar';
import EquipmentPage from './pages/Equipment';
import TeamsPage from './pages/Teams';
import ReportingPage from './pages/Reporting';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES (No Sidebar, No Protection) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* PROTECTED ROUTES WITH NEW LAYOUT */}
        <Route element={<PrivateRoute><ModernLayout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests/new" element={<MaintenanceRequestPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/reporting" element={<ReportingPage />} />
        </Route>
        {/* Catch-all: If user types random URL, send to Dashboard (or Login if not auth) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
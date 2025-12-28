import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { MaintenanceRequest } from '../types';
import { theme } from '../theme';

const Dashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestService.getAll();
        // Sort by requestDate descending (newest first)
        const sortedData = data.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
        setRequests(sortedData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // --- KPI CALCULATIONS ---
  const criticalCount = requests.filter(r => r.priority === 'High' && r.stage !== 'Repaired').length;
  const openRequestsCount = requests.filter(r => r.stage !== 'Repaired' && r.stage !== 'Scrap').length;
  const overdueCount = requests.filter(r => {
      if (r.stage === 'Repaired' || r.stage === 'Scrap') return false;
      const targetDate = new Date(r.scheduledDate || r.requestDate);
      return targetDate < new Date();
  }).length;

  // Mock Technician Load (You can replace with real logic later)
  const techUtil = Math.min(Math.round((openRequestsCount / 20) * 100), 100); // Assuming 20 is max capacity

  if (loading) return <div style={{ padding: '24px' }}>Loading Dashboard...</div>;

  // --- STYLES ---
  const cardStyle = (bgColor: string, borderColor: string) => ({
    backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '20px',
    display: 'flex', flexDirection: 'column' as 'column', justifyContent: 'space-between', minHeight: '110px', position: 'relative' as 'relative',
  });
  const cardTitleStyle = (color: string) => ({
    fontSize: '12px', fontWeight: 700, color: color, textTransform: 'uppercase' as 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
  });
  const cardValueStyle = (color: string) => ({ fontSize: '28px', fontWeight: 700, color: color, lineHeight: 1 });
  const cardSubStyle = (color: string) => ({ fontSize: '13px', color: color, marginTop: '8px', fontWeight: 500 });
  const cardIconStyle = (color: string) => ({ position: 'absolute' as 'absolute', top: '20px', right: '20px', fontSize: '24px', color: color, opacity: 0.4 });

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.textDark, margin: '0 0 4px 0' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: theme.textLight, margin: 0 }}>Overview of maintenance activities</p>
      </div>

      {/* KPI Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Card 1: Critical Equipment */}
        <div style={cardStyle(theme.dangerLight, theme.danger)}>
          <div>
            <div style={cardTitleStyle(theme.danger)}>Critical Equipment ⚠️</div>
            <div style={cardValueStyle(theme.danger)}>{criticalCount} Units</div>
            <div style={cardSubStyle(theme.danger)}>Health &lt; 30%</div>
          </div>
          <div style={cardIconStyle(theme.danger)}>⚠️</div>
        </div>

        {/* Card 2: Technician Load */}
        <div style={cardStyle(theme.infoLight, theme.info)}>
          <div>
            <div style={cardTitleStyle(theme.info)}>Technician Load ⚙️</div>
            <div style={cardValueStyle(theme.info)}>{techUtil}%</div>
            <div style={cardSubStyle(theme.info)}>Utilized</div>
          </div>
          <div style={cardIconStyle(theme.info)}>👥</div>
        </div>

        {/* Card 3: Open Requests */}
        <div style={cardStyle(theme.successLight, theme.success)}>
          <div>
            <div style={cardTitleStyle(theme.success)}>Open Requests 📄</div>
            <div style={cardValueStyle(theme.success)}>{openRequestsCount} Pending</div>
            <div style={cardSubStyle(theme.success)}>{overdueCount} Overdue</div>
          </div>
          <div style={cardIconStyle(theme.success)}>📄</div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div style={{ backgroundColor: theme.white, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.textDark, margin: 0 }}>Recent Requests</h2>
          <button onClick={() => navigate('/requests/new')} style={{ backgroundColor: theme.primary, color: theme.white, border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>+ New Request</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa', borderBottom: `1px solid ${theme.border}` }}>
                {['Subject', 'Equipment', 'Team', 'Category', 'Stage', 'Company'].map(header => (
                  <th key={header} style={{ textAlign: 'left', padding: '16px', fontSize: '12px', fontWeight: 700, color: theme.textLight, textTransform: 'uppercase' }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 10).map(req => ( // Show top 10 recent requests
                <tr key={req.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: theme.textDark }}>{req.subject}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: theme.textLight }}>{req.equipmentId || '-'}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: theme.textLight }}>{req.teamId || 'Internal'}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: theme.textLight }}>{req.category || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-block',
                      backgroundColor: req.stage === 'New Request' ? theme.infoLight : req.stage === 'In Progress' ? theme.warningLight : theme.successLight,
                      color: req.stage === 'New Request' ? theme.info : req.stage === 'In Progress' ? theme.warning : theme.success,
                    }}>
                      {req.stage}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: theme.textLight }}>{req.company || 'Nexora Labs'}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: theme.textLight }}>No requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { requestService } from '../services/requestService';
import { MaintenanceRequest } from '../types';
import { theme } from '../theme';

const ReportingPage = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedReq, setSelectedReq] = useState<MaintenanceRequest | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await requestService.getAll();
    // Sort by newest first
    setRequests(data.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
    setLoading(false);
  };

  // --- ACTIONS ---
  const handleRowClick = (req: MaintenanceRequest) => {
    setSelectedReq(req);
    setNewStatus(req.stage); // Set default to current status
  };

  const handleSaveStatus = async () => {
    if (!selectedReq || !newStatus) return;
    
    try {
      // 1. Update Firebase
      await requestService.updateStatus(selectedReq.id, newStatus);
      
      // 2. Update Local UI immediately
      setRequests(prev => prev.map(item => 
        item.id === selectedReq.id ? { ...item, stage: newStatus as any } : item
      ));
      
      // 3. Close Modal
      setSelectedReq(null);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // --- STATS CALCS ---
  const totalRequests = requests.length;
  const completed = requests.filter(r => r.stage === 'Repaired').length;
  const pending = totalRequests - completed;
  const avgDuration = totalRequests > 0 
    ? (requests.reduce((acc, curr) => acc + (curr.duration || 0), 0) / totalRequests).toFixed(1) 
    : 0;

  if (loading) return <div style={{ padding: '24px' }}>Loading Reports...</div>;

  return (
    <div>
       {/* HEADER */}
       <div style={{ marginBottom: '24px' }}>
         <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.textDark, margin: '0 0 4px 0' }}>Reporting & Analytics</h1>
         <p style={{ fontSize: '14px', color: theme.textLight, margin: 0 }}>Track performance and update ticket status</p>
       </div>

       {/* KPI STATS */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <StatCard label="Total Tickets" value={totalRequests} color={theme.primary} />
          <StatCard label="Open / Pending" value={pending} color={theme.warning} />
          <StatCard label="Repaired" value={completed} color={theme.success} />
          <StatCard label="Avg Duration (Hrs)" value={avgDuration} color={theme.info} />
       </div>

       {/* INTERACTIVE TABLE */}
       <div style={{ backgroundColor: theme.white, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.border}`, fontWeight: 700, color: theme.textDark }}>
              Maintenance Log Book <span style={{ fontWeight: 400, fontSize: '12px', color: theme.textLight, marginLeft: '8px' }}>(Click row to edit)</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
             <thead style={{ background: '#f9fafb', color: theme.textLight }}>
                 <tr>
                     <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                     <th style={{ padding: '12px', textAlign: 'left' }}>Subject</th>
                     <th style={{ padding: '12px', textAlign: 'left' }}>Machine</th>
                     <th style={{ padding: '12px', textAlign: 'left' }}>Technician</th>
                     <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                 </tr>
             </thead>
             <tbody>
                 {requests.map(req => (
                     <tr 
                        key={req.id} 
                        onClick={() => handleRowClick(req)}
                        style={{ borderBottom: `1px solid ${theme.border}`, cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                     >
                         <td style={{ padding: '12px', color: theme.textLight }}>{req.requestDate}</td>
                         <td style={{ padding: '12px', fontWeight: 600, color: theme.textDark }}>{req.subject}</td>
                         <td style={{ padding: '12px', color: theme.textDark }}>{req.equipmentId}</td>
                         <td style={{ padding: '12px', color: theme.textLight }}>{req.technicianId}</td>
                         <td style={{ padding: '12px' }}>
                             <StatusBadge stage={req.stage} />
                         </td>
                     </tr>
                 ))}
             </tbody>
          </table>
       </div>

       {/* --- EDIT STATUS MODAL --- */}
       {selectedReq && (
         <div style={modalOverlayStyle} onClick={() => setSelectedReq(null)}>
           <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
             <h3 style={{ marginTop: 0, color: theme.textDark }}>Update Status</h3>
             <p style={{ color: theme.textLight, fontSize: '14px' }}>
               Change status for: <strong>{selectedReq.subject}</strong>
             </p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
               {['In Progress', 'Repaired', 'Scrap'].map(status => (
                 <label key={status} style={{ 
                   display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '6px', border: `1px solid ${theme.border}`,
                   backgroundColor: newStatus === status ? '#eef2ff' : 'white', cursor: 'pointer' 
                 }}>
                   <input 
                     type="radio" 
                     name="status" 
                     value={status} 
                     checked={newStatus === status} 
                     onChange={(e) => setNewStatus(e.target.value)}
                     style={{ marginRight: '10px' }}
                   />
                   <span style={{ fontWeight: newStatus === status ? 600 : 400, color: newStatus === status ? theme.primary : theme.textDark }}>
                     {status}
                   </span>
                 </label>
               ))}
             </div>

             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
               <button onClick={() => setSelectedReq(null)} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Cancel</button>
               <button onClick={handleSaveStatus} style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: theme.primary, color: 'white', cursor: 'pointer', fontWeight: 600 }}>Save Update</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

// --- COMPONENTS & STYLES ---

const StatCard = ({ label, value, color }: any) => (
    <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: 'white', border: `1px solid ${theme.border}`, borderLeft: `4px solid ${color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ color: theme.textLight, fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: theme.textDark, marginTop: '4px' }}>{value}</div>
    </div>
);

const StatusBadge = ({ stage }: { stage: string }) => {
  let bg = '#eee'; let color = '#333';
  if (stage === 'New Request') { bg = theme.infoLight; color = theme.info; }
  else if (stage === 'In Progress') { bg = theme.warningLight; color = theme.warning; }
  else if (stage === 'Repaired') { bg = theme.successLight; color = theme.success; }
  else if (stage === 'Scrap') { bg = '#fee2e2'; color = '#991b1b'; }

  return (
    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: bg, color: color }}>
      {stage}
    </span>
  );
};

const modalOverlayStyle = {
  position: 'fixed' as 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
  display: 'flex', justifyContent: 'center', alignItems: 'center'
};

const modalContentStyle = {
  backgroundColor: 'white', width: '400px', borderRadius: '8px', padding: '24px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

export default ReportingPage;
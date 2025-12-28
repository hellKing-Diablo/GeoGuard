import React, { useState, useEffect } from 'react';
import { Equipment, WorkCenter } from '../types';
import EquipmentModal from '../components/equipment/EquipmentModal';
import { equipmentService } from '../services/equipmentService';
import { theme } from '../theme';

const EquipmentPage = () => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'workCenter'>('equipment');
  const [loading, setLoading] = useState(true);
  
  // Data
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [wcList, setWcList] = useState<WorkCenter[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [eData, wData] = await Promise.all([
      equipmentService.getAllEquipment(), 
      equipmentService.getAllWorkCenters()
    ]);
    setEquipmentList(eData);
    setWcList(wData);
    setLoading(false);
  };

  // --- HANDLERS ---
  
  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset? This cannot be undone.")) {
      await equipmentService.deleteEquipment(id);
      setEquipmentList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = async (data: Equipment) => {
    if (editingItem) {
      // Update existing
      await equipmentService.updateEquipment(data);
      setEquipmentList(prev => prev.map(item => item.id === data.id ? data : item));
    } else {
      // Create new
      const { id, ...rest } = data; // Remove temp id if any
      const newItem = await equipmentService.createEquipment(rest);
      setEquipmentList(prev => [...prev, newItem as Equipment]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading Assets...</div>;

  return (
    <div>
       {/* HEADER */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: theme.textDark, margin: '0 0 4px 0' }}>Asset Management</h1>
            <p style={{ fontSize: '14px', color: theme.textLight, margin: 0 }}>Manage machinery, tools, and work centers</p>
         </div>
         <button 
           onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
           style={{ backgroundColor: theme.primary, color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
         >
           + Add Equipment
         </button>
       </div>

       {/* TABS (Optional expansion later for Work Centers) */}
       <div style={{ display: 'flex', gap: '24px', borderBottom: `1px solid ${theme.border}`, marginBottom: '24px' }}>
         <TabButton label="Machines & Tools" active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')} />
         <TabButton label="Work Centers" active={activeTab === 'workCenter'} onClick={() => setActiveTab('workCenter')} />
       </div>

       {/* TABLE CARD */}
       <div style={{ backgroundColor: theme.white, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: `1px solid ${theme.border}` }}>
                <Th>Asset Name</Th>
                <Th>Serial Number</Th>
                <Th>Category</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'equipment' ? (
                equipmentList.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: theme.textLight }}>No equipment found. Add your first asset!</td></tr>
                ) : (
                  equipmentList.map(item => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <td style={{ padding: '16px', fontWeight: 600, color: theme.textDark }}>{item.name}</td>
                      <td style={{ padding: '16px', color: theme.textLight, fontFamily: 'monospace' }}>{item.serialNumber || '-'}</td>
                      <td style={{ padding: '16px', color: theme.textDark }}>{item.category}</td>
                      <td style={{ padding: '16px', color: theme.textLight }}>{item.location || 'Unknown'}</td>
                      <td style={{ padding: '16px' }}>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleEdit(item)} style={actionBtnStyle(theme.info)} title="Edit">✎</button>
                        <button onClick={() => handleDelete(item.id)} style={actionBtnStyle(theme.danger)} title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                // WORK CENTER PLACEHOLDER (You can implement the table later for WC similarly)
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: theme.textLight }}>Work Center management coming soon...</td></tr>
              )}
            </tbody>
          </table>
       </div>

       <EquipmentModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         onSave={handleSave}
         initialData={editingItem} 
       />
    </div>
  );
};

// --- STYLED COMPONENTS ---

const Th = ({ children, align = 'left' }: any) => (
  <th style={{ padding: '16px', textAlign: align, fontSize: '12px', fontWeight: 700, color: theme.textLight, textTransform: 'uppercase' }}>
    {children}
  </th>
);

const TabButton = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    style={{ 
      background: 'none', border: 'none', padding: '12px 0', marginRight: '16px', cursor: 'pointer',
      fontSize: '14px', fontWeight: active ? 600 : 500,
      color: active ? theme.primary : theme.textLight,
      borderBottom: active ? `2px solid ${theme.primary}` : '2px solid transparent',
      marginBottom: '-1px'
    }}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }: { status?: string }) => {
  let bg = theme.successLight; let color = theme.success;
  if (status === 'Down' || status === 'Scrap') { bg = theme.dangerLight; color = theme.danger; }
  if (status === 'Under Maintenance') { bg = theme.warningLight; color = theme.warning; }
  
  return (
    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: bg, color: color }}>
      {status || 'Operational'}
    </span>
  );
};

const actionBtnStyle = (color: string) => ({
  background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: color, marginLeft: '12px', opacity: 0.8
});

export default EquipmentPage;
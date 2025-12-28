import React, { useState, useEffect } from 'react';
import { Equipment } from '../../types';
import { theme } from '../../theme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Equipment | null; 
}

const EquipmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '', category: '', serialNumber: '', location: '', status: 'Operational', technician: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        serialNumber: initialData.serialNumber || '',
        location: initialData.location || '',
        status: initialData.status || 'Operational',
        technician: initialData.technician || ''
      });
    } else {
      setFormData({ name: '', category: '', serialNumber: '', location: '', status: 'Operational', technician: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(initialData ? { ...formData, id: initialData.id } : formData);
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <h2 style={{ margin: '0 0 20px', color: theme.textDark }}>
          {initialData ? 'Edit Equipment' : 'Add New Equipment'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <Input 
            label="Equipment Name" 
            value={formData.name} 
            onChange={(v) => setFormData({...formData, name: v})} 
            required 
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <Input 
               label="Category" 
               value={formData.category} 
               onChange={(v) => setFormData({...formData, category: v})} 
             />
             <Input 
               label="Serial Number" 
               value={formData.serialNumber} 
               onChange={(v) => setFormData({...formData, serialNumber: v})} 
             />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <Input 
               label="Location" 
               value={formData.location} 
               onChange={(v) => setFormData({...formData, location: v})} 
             />
             <Select 
               label="Status" 
               value={formData.status} 
               onChange={(v) => setFormData({...formData, status: v})} 
               options={['Operational', 'Under Maintenance', 'Down', 'Scrap']} 
             />
          </div>
          <Input 
            label="Assigned Technician" 
            value={formData.technician} 
            onChange={(v) => setFormData({...formData, technician: v})} 
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" style={saveBtnStyle}>{initialData ? 'Save Changes' : 'Create Asset'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- TYPED HELPER COMPONENTS ---

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, required }) => (
  <div>
    <label style={labelStyle}>{label} {required && '*'}</label>
    <input 
      type="text" 
      value={value} 
      required={required} 
      onChange={(e) => onChange(e.target.value)} 
      style={inputStyle}
    />
  </div>
);

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      style={inputStyle}
    >
       {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// --- STYLES ---
const overlayStyle = { position: 'fixed' as 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const contentStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', fontSize: '12px', color: theme.textLight, marginBottom: '4px', fontWeight: 600 };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: `1px solid ${theme.border}`, fontSize: '14px', boxSizing: 'border-box' as 'border-box' };
const cancelBtnStyle = { padding: '8px 16px', border: `1px solid ${theme.border}`, background: 'white', borderRadius: '4px', cursor: 'pointer' };
const saveBtnStyle = { padding: '8px 16px', border: 'none', background: theme.primary, color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 };

export default EquipmentModal;
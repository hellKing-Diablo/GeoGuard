import React, { useState, useEffect } from 'react';
import { Equipment } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Equipment | null; // If null, it's "New Mode"
  onSave: (data: Equipment) => void;
}

const EquipmentModal: React.FC<Props> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  // Reset form when opening/closing or changing selection
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({}); // Clear for new entry
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: Validate here
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9), // Generate ID if new
      name: formData.name || 'New Equipment'
    } as Equipment);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'white', width: '900px', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '8px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>

        {/* HEADER SECTION WITH SMART BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2563eb' }}>{initialData ? formData.name : 'New Equipment'}</h2>
            <p style={{ margin: '5px 0 0', color: '#6b7280', fontSize: '14px' }}>
              {initialData ? 'Asset Details & Maintenance History' : 'Register a new asset'}
            </p>
          </div>

          {/* SMART BUTTON (Only visible if Editing) */}
          {initialData && (
            <div 
              style={{
                border: '1px solid #e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center',
                cursor: 'pointer', backgroundColor: '#f9fafb', transition: 'all 0.2s'
              }}
              onClick={() => alert('Feature: Opens list of Maintenance Requests for ' + formData.name)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
            >
              <div style={{ padding: '8px 12px', borderRight: '1px solid #e5e7eb', fontSize: '20px' }}>
                🔧
              </div>
              <div style={{ padding: '4px 12px' }}>
                <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>Maintenance</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>0</div>
              </div>
            </div>
          )}
        </div>

        {/* FORM SECTION */}
        <form onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label style={labelStyle}>Equipment Name</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Samsung Monitor" />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Equipment Category</label>
                <input name="category" value={formData.category || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Company</label>
                <input name="company" value={formData.company || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Used By</label>
                <input name="usedBy" value={formData.usedBy || ''} onChange={handleChange} style={inputStyle} placeholder="Department or Employee" />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Maintenance Team</label>
                <input name="maintenanceTeam" value={formData.maintenanceTeam || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Assigned Date</label>
                <input type="date" name="assignedDate" value={formData.assignedDate || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label style={labelStyle}>Technician</label>
                <input name="technician" value={formData.technician || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Employee</label>
                <input name="employee" value={formData.employee || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Scrap Date</label>
                <input type="date" name="scrapDate" value={formData.scrapDate || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Used in Location</label>
                <input name="location" value={formData.location || ''} onChange={handleChange} style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Work Center</label>
                <input name="workCenter" value={formData.workCenter || ''} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Description Full Width */}
          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Description</label>
            <textarea 
              name="description" 
              value={formData.description || ''} 
              onChange={handleChange} 
              rows={4} 
              style={{ ...inputStyle, resize: 'vertical' }} 
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
              {initialData ? 'Save Changes' : 'Create Equipment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// Styles
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' };

export default EquipmentModal;
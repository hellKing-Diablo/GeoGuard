import React, { useState } from 'react';
import { Team } from '../types';

// --- MOCK DATA: TEAMS ---
const MOCK_TEAMS: Team[] = [
  { id: '1', name: 'Internal Maintenance', members: ['Anas Makari'], company: 'My Company (San Francisco)' },
  { id: '2', name: 'Metrology', members: ['Marc Demo'], company: 'My Company (San Francisco)' },
  { id: '3', name: 'Subcontractor', members: ['Maggie Davidson'], company: 'My Company (San Francisco)' },
];

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // FILTER LOGIC
  const filteredTeams = MOCK_TEAMS.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.members.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* 1. Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>Teams</h1>
        
        <button 
          onClick={() => alert('New Team Popup Coming Soon!')}
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
        >
          + New
        </button>
      </div>

      {/* 2. Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
            type="text" 
            placeholder="Search Team Name or Member..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                width: '100%', maxWidth: '400px', padding: '10px 12px', borderRadius: '6px',
                border: '1px solid #d1d5db', fontSize: '14px', outline: 'none'
            }}
        />
      </div>

      {/* 3. Data Table */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                    <th style={thStyle}>Team Name</th>
                    <th style={thStyle}>Team Members</th>
                    <th style={thStyle}>Company</th>
                    <th style={thStyle}></th> {/* Actions Column */}
                </tr>
            </thead>
            <tbody>
                {filteredTeams.map(team => (
                    <tr key={team.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={tdStyle}>{team.name}</td>
                        <td style={tdStyle}>
                            {team.members.map((member, index) => (
                                <span key={index} style={{ 
                                    display: 'inline-block', backgroundColor: '#eff6ff', color: '#1e40af', 
                                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginRight: '6px' 
                                }}>
                                    {member}
                                </span>
                            ))}
                        </td>
                        <td style={tdStyle}>{team.company}</td>
                        <td style={tdStyle}>
                            <button style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                No teams found.
            </div>
        )}
      </div>

    </div>
  );
};

// --- STYLES ---
const thStyle = {
    textAlign: 'left' as const,
    padding: '12px 16px',
    fontWeight: '600',
    color: '#374151',
    whiteSpace: 'nowrap' as const
};

const tdStyle = {
    padding: '12px 16px',
    color: '#1f2937',
    borderBottom: '1px solid #f3f4f6'
};

export default TeamsPage;
import React, { useState, useEffect } from 'react';
import { requestService } from '../services/requestService';
import { MaintenanceRequest } from '../types';
import { theme } from '../theme';
import RequestModal from '../components/calendar/RequestModal'; 

const Calendar = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Interaction State
  const [selectedDay, setSelectedDay] = useState<Date | null>(null); 
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null); 

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
      const data = await requestService.getAll();
      setRequests(data);
    };
    loadData();
  }, []);

  // 2. Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 

  // --- BUG FIX HERE ---
  const getActivityForDate = (dayNumber: number) => {
    // 1. Create the date object for the specific grid cell
    const d = new Date(year, month, dayNumber);

    // 2. Manually format to 'YYYY-MM-DD' using LOCAL time (avoids UTC shifts)
    const checkDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return requests.filter(req => {
      // 3. ONLY check scheduledDate (Removed the 'created' check)
      // We check if scheduledDate exists AND matches our grid date
      return req.scheduledDate && req.scheduledDate.startsWith(checkDate);
    });
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: theme.white, padding: '16px 24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, color: theme.textDark }}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => changeMonth(-1)} style={navBtnStyle}>&lt; Prev</button>
          <button onClick={() => setCurrentDate(new Date())} style={navBtnStyle}>Today</button>
          <button onClick={() => changeMonth(1)} style={navBtnStyle}>Next &gt;</button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div style={{ backgroundColor: theme.white, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: theme.background, borderBottom: `1px solid ${theme.border}` }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: theme.textLight, fontSize: '14px' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '600px' }}>
          {/* Empty slots */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} style={{ borderBottom: `1px solid ${theme.border}`, borderRight: `1px solid ${theme.border}`, backgroundColor: '#fafafa' }} />
          ))}

          {/* Actual Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const activity = getActivityForDate(dayNum);
            
            // Highlight logic
            const today = new Date();
            const isToday = 
              today.getDate() === dayNum && 
              today.getMonth() === month && 
              today.getFullYear() === year;

            return (
              <div 
                key={dayNum} 
                onClick={() => setSelectedDay(new Date(year, month, dayNum))}
                style={{ 
                  borderBottom: `1px solid ${theme.border}`, 
                  borderRight: `1px solid ${theme.border}`, 
                  padding: '8px', 
                  cursor: 'pointer',
                  backgroundColor: isToday ? '#eef2ff' : 'white',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = isToday ? '#eef2ff' : '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = isToday ? '#eef2ff' : 'white'}
              >
                <div style={{ 
                  fontWeight: isToday ? 'bold' : 'normal', 
                  color: isToday ? theme.primary : theme.textDark,
                  marginBottom: '8px',
                  display: 'inline-block',
                  width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center',
                  borderRadius: '50%',
                  backgroundColor: isToday ? theme.primary : 'transparent',
                  
                }}>
                  {dayNum}
                </div>

                {/* Activity Dots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activity.slice(0, 3).map((req, idx) => (
                    <div key={idx} style={{ 
                      fontSize: '10px', padding: '2px 4px', borderRadius: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      backgroundColor: req.priority === 'High' ? theme.dangerLight : theme.infoLight,
                      color: req.priority === 'High' ? theme.danger : theme.info,
                      borderLeft: `3px solid ${req.priority === 'High' ? theme.danger : theme.info}`
                    }}>
                      {req.subject}
                    </div>
                  ))}
                  {activity.length > 3 && (
                    <div style={{ fontSize: '10px', color: theme.textLight, paddingLeft: '4px' }}>+ {activity.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL 1: DAY LIST --- */}
      {selectedDay && (
        <div style={modalOverlayStyle} onClick={() => setSelectedDay(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: theme.primary }}>
                {selectedDay.getDate()} {selectedDay.toLocaleString('default', { month: 'long' })}
              </h3>
              <button onClick={() => setSelectedDay(null)} style={closeBtnStyle}>✕</button>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {getActivityForDate(selectedDay.getDate()).length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: theme.textLight }}>No activity scheduled.</div>
              ) : (
                getActivityForDate(selectedDay.getDate()).map(req => (
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedTicket(req)}
                    style={{ 
                      padding: '12px', border: `1px solid ${theme.border}`, borderRadius: '6px', marginBottom: '8px', cursor: 'pointer',
                      backgroundColor: theme.background, transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = theme.primary}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = theme.border}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: theme.textDark }}>{req.subject}</span>
                      <span style={{ 
                        fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                        backgroundColor: req.stage === 'Repaired' ? theme.successLight : theme.warningLight,
                        color: req.stage === 'Repaired' ? theme.success : theme.warning
                      }}>
                        {req.stage}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: theme.textLight }}>
                      {req.equipmentId}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: DETAILS --- */}
      {selectedTicket && (
        <RequestModal 
          request={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}

    </div>
  );
};

// Styles
const navBtnStyle = { padding: '6px 12px', border: `1px solid ${theme.border}`, backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer', color: theme.textDark };
const modalOverlayStyle = { position: 'fixed' as 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContentStyle = { backgroundColor: 'white', width: '450px', borderRadius: '8px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' as 'relative' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: theme.textLight };

export default Calendar;
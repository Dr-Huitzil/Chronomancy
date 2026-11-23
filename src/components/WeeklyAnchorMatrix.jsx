// src/components/WeeklyAnchorMatrix.jsx - Visual 7-Day Weekly Anchor Timetable with Time Formatting

import React, { useState } from 'react';
import { Calendar, Clock, Briefcase, Bus, Coffee, CheckCircle2, Plus, Edit3 } from 'lucide-react';
import { formatDisplayTime } from '../utils/timeUtils';

export function WeeklyAnchorMatrix({ anchors, timeFormat = '12h', onApplyToToday, onEditAnchor, onAddAnchor }) {
  const daysOfWeek = [
    { key: 'Mon', label: 'Monday' },
    { key: 'Tue', label: 'Tuesday' },
    { key: 'Wed', label: 'Wednesday' },
    { key: 'Thu', label: 'Thursday' },
    { key: 'Fri', label: 'Friday' },
    { key: 'Sat', label: 'Saturday' },
    { key: 'Sun', label: 'Sunday' }
  ];

  const [selectedDay, setSelectedDay] = useState('Mon');

  // Calculate weekly statistics
  let totalWeeklyWorkMinutes = 0;
  let totalWeeklyCommuteMinutes = 0;
  let totalWeeklyLunchMinutes = 0;

  anchors.forEach(a => {
    const daysCount = a.days.length;
    const netDuration = a.hasBreak ? (a.duration - (a.breakDuration || 0)) : a.duration;
    
    if (a.type === 'work') totalWeeklyWorkMinutes += netDuration * daysCount;
    if (a.type === 'friction') totalWeeklyCommuteMinutes += a.duration * daysCount;
    if (a.type === 'routine' || a.hasBreak) {
      if (a.hasBreak) totalWeeklyLunchMinutes += (a.breakDuration || 0) * daysCount;
      if (a.type === 'routine') totalWeeklyLunchMinutes += a.duration * daysCount;
    }
  });

  const getAnchorsForDay = (dayKey) => {
    return anchors
      .filter(a => a.days.includes(dayKey))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const dayAnchors = getAnchorsForDay(selectedDay);

  const getIcon = (type) => {
    if (type === 'work') return <Briefcase size={15} />;
    if (type === 'friction') return <Bus size={15} />;
    return <Coffee size={15} />;
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--color-leaf-border)', background: 'var(--bg-surface-elevated)' }}>
      
      {/* Matrix Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--color-leaf-primary)" />
            WEEKLY ANCHOR TIMETABLE (RECURRING SKELETON)
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Auditing baseline weekly commitments, transit friction, and break deductions ({timeFormat.toUpperCase()} Mode)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onAddAnchor}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={13} />
            New Anchor
          </button>

          <button
            onClick={onApplyToToday}
            style={{
              background: 'var(--color-leaf-primary)',
              color: '#000',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 size={13} strokeWidth={2.5} />
            Populate Today with Anchors
          </button>
        </div>
      </div>

      {/* Weekly Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '16px',
        padding: '12px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>WEEKLY NET LABOR</div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-sun-warm)', marginTop: '2px' }}>
            {(totalWeeklyWorkMinutes / 60).toFixed(1)} Hours
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>Fixed committed shift labor</div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>WEEKLY COMMUTE TRANSIT</div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-transit-terracotta)', marginTop: '2px' }}>
            {(totalWeeklyCommuteMinutes / 60).toFixed(1)} Hours
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>Transit & commute overhead</div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROTECTED LUNCH RECOVERY</div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-leaf-primary)', marginTop: '2px' }}>
            {(totalWeeklyLunchMinutes / 60).toFixed(1)} Hours
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>Carved-out midday personal time</div>
        </div>
      </div>

      {/* 7-Day Weekday Pill Selector */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '14px' }}>
        {daysOfWeek.map(d => {
          const isSelected = selectedDay === d.key;
          const count = getAnchorsForDay(d.key).length;

          return (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              style={{
                flex: 1,
                minWidth: '70px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
                border: isSelected ? '1px solid var(--color-leaf-primary)' : '1px solid var(--border-light)',
                color: isSelected ? '#000' : 'var(--text-main)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '800' }}>{d.key}</span>
              <span style={{ fontSize: '9px', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>
                {count} {count === 1 ? 'anchor' : 'anchors'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Timetable List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between' }}>
          <span>ANCHORS SCHEDULED FOR {daysOfWeek.find(d => d.key === selectedDay)?.label.toUpperCase()}</span>
          <span>{dayAnchors.length} ACTIVE</span>
        </div>

        {dayAnchors.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            No recurring anchors configured for {daysOfWeek.find(d => d.key === selectedDay)?.label}. Open margin day.
          </div>
        ) : (
          dayAnchors.map(anchor => {
            const hasBreak = anchor.hasBreak;
            const netWorkMins = hasBreak ? (anchor.duration - anchor.breakDuration) : anchor.duration;

            return (
              <div
                key={anchor.id}
                className="glass-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: `4px solid ${anchor.type === 'work' ? 'var(--color-sun-warm)' : anchor.type === 'friction' ? 'var(--color-transit-terracotta)' : 'var(--color-leaf-primary)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    color: anchor.type === 'work' ? 'var(--color-sun-warm)' : anchor.type === 'friction' ? 'var(--color-transit-terracotta)' : 'var(--color-leaf-primary)',
                    background: 'var(--bg-surface-elevated)',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {getIcon(anchor.type)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>
                        {formatDisplayTime(anchor.time, timeFormat)}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                        {anchor.title}
                      </span>
                    </div>

                    {/* Breakdown of Net Shift vs Carved-Out Lunch */}
                    {hasBreak ? (
                      <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--color-sun-warm)', fontWeight: '700' }}>
                          Net Labor: {(netWorkMins / 60).toFixed(1)}h ({netWorkMins}m)
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--color-leaf-primary)', fontWeight: '700' }}>
                          Carved Break: {formatDisplayTime(anchor.breakStart, timeFormat)} ({(anchor.breakDuration / 60).toFixed(1)}h)
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--text-dim)' }}>
                          Gross Span: {(anchor.duration / 60).toFixed(1)}h
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {anchor.description || `${anchor.duration} minutes scheduled`}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    background: 'var(--bg-surface-elevated)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}>
                    {anchor.duration}m span
                  </span>

                  <button
                    onClick={() => onEditAnchor(anchor)}
                    style={{
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      padding: '5px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Edit Anchor"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

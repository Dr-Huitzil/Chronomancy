// src/views/runway/WeekCalendarView.jsx - Google Calendar-style 7-Day Column Grid View (No Emojis)

import React from 'react';
import { Briefcase, Bus, Coffee, BookOpen, Laptop, Award, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { formatDisplayTime } from '../../utils/timeUtils';

export function WeekCalendarView({ schedule, recurringAnchors, timeFormat = '12h', onEditBlock }) {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getBlockIcon = (block) => {
    if (block.type === 'work') return <Briefcase size={12} />;
    if (block.type === 'friction') return <Bus size={12} />;
    if (block.type === 'leak') return <AlertOctagon size={12} />;
    if (block.type === 'project') return <Laptop size={12} />;
    if (block.type === 'cert') return <Award size={12} />;
    if (block.type === 'routine') return <Coffee size={12} />;
    return <BookOpen size={12} />;
  };

  const getItemsForDay = (day) => {
    // Collect recurring anchors active for this day
    const dayAnchors = recurringAnchors.filter(a => a.days?.includes(day)).map(a => ({
      ...a,
      isAnchor: true
    }));

    // For today (e.g. Wednesday in demo), also merge one-off runway items
    const isToday = day === 'Wed';
    const daySchedule = isToday ? schedule : [];

    const combined = [...dayAnchors, ...daySchedule.filter(s => !dayAnchors.some(a => a.title.toLowerCase() === s.title.toLowerCase()))];
    return combined.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  return (
    <div className="glass-panel" style={{ padding: '16px', overflowX: 'auto' }}>
      
      {/* 7-Day Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(130px, 1fr))', gap: '8px', minWidth: '920px' }}>
        {daysOfWeek.map((day) => {
          const isToday = day === 'Wed'; // Active demo day
          const items = getItemsForDay(day);
          const totalMins = items.reduce((acc, curr) => acc + (curr.duration || 0), 0);

          return (
            <div
              key={day}
              style={{
                background: isToday ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: isToday ? '2px solid var(--color-leaf-primary)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minHeight: '480px'
              }}
            >
              {/* Day Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-light)'
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: isToday ? 'var(--color-leaf-primary)' : 'var(--text-main)' }}>
                    {day}
                  </span>
                  {isToday && (
                    <span style={{ fontSize: '9px', marginLeft: '6px', padding: '1px 4px', borderRadius: '3px', background: 'var(--color-leaf-light)', color: 'var(--color-leaf-primary)', fontWeight: '800' }}>
                      TODAY
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {(totalMins / 60).toFixed(1)}h
                </span>
              </div>

              {/* Day Scheduled Blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.length === 0 ? (
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '20px' }}>
                    Open Margin
                  </div>
                ) : (
                  items.map((item, idx) => {
                    const isFriction = item.type === 'friction';
                    const isLeak = item.type === 'leak';
                    const isWork = item.type === 'work';

                    let color = 'var(--color-leaf-primary)';
                    let bg = 'var(--color-leaf-light)';

                    if (isWork) {
                      color = 'var(--color-sun-warm)';
                      bg = 'var(--color-sun-light)';
                    } else if (isFriction) {
                      color = 'var(--color-transit-terracotta)';
                      bg = 'var(--color-transit-bg)';
                    } else if (isLeak) {
                      color = 'var(--color-leak-rust)';
                      bg = 'var(--color-leak-bg)';
                    }

                    return (
                      <div
                        key={`${item.id}-${idx}`}
                        onClick={() => onEditBlock(item)}
                        style={{
                          background: bg,
                          borderLeft: `3px solid ${color}`,
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {getBlockIcon(item)}
                            {item.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>
                          <span>{formatDisplayTime(item.time, timeFormat)}</span>
                          <span>{item.duration}m</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

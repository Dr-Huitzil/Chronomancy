// src/views/runway/MonthCalendarView.jsx - Google Calendar-style Proportional Month Horizon View (No Emojis)

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, GraduationCap, Award, Briefcase, Clock } from 'lucide-react';

export function MonthCalendarView({ academics = [], certifications = [] }) {
  const [viewDate, setViewDate] = useState(new Date(2026, 10, 1)); // November 2026

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar grid calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Academic and cert milestones mapped to day numbers
  const eventsByDay = {
    6: [
      { id: 'e1', title: 'CS 301 PS 4 Due', type: 'academic', color: 'var(--color-leaf-primary)', bg: 'var(--color-leaf-light)' }
    ],
    12: [
      { id: 'e2', title: 'STAT 200 Midterm', type: 'academic', color: 'var(--color-transit-terracotta)', bg: 'var(--color-transit-bg)' }
    ],
    18: [
      { id: 'e3', title: 'AWS Arch Module Review', type: 'cert', color: 'var(--color-sun-warm)', bg: 'var(--color-sun-light)' }
    ],
    22: [
      { id: 'e4', title: 'Today: 8.0h Work + CS PS4 Study', type: 'active', color: 'var(--color-leaf-primary)', bg: 'var(--color-leaf-light)' }
    ],
    24: [
      { id: 'e5', title: 'CS 301 Lab 3 Due', type: 'academic', color: 'var(--color-leaf-primary)', bg: 'var(--color-leaf-light)' }
    ],
    29: [
      { id: 'e6', title: 'STAT 200 R-Regression', type: 'academic', color: 'var(--color-transit-terracotta)', bg: 'var(--color-transit-bg)' }
    ]
  };

  // Build grid cells (pre-padding + active days + post-padding to 35 or 42 cells)
  const cells = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    cells.push({
      day: d,
      isCurrentMonth: true,
      isToday: d === 22 && month === 10 && year === 2026,
      events: eventsByDay[d] || []
    });
  }

  // Next month leading days to complete the 35 or 42 cell grid
  const remainingCells = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
  for (let d = 1; d <= remainingCells; d++) {
    cells.push({
      day: d,
      isCurrentMonth: false,
      isNext: true
    });
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      
      {/* Month Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="var(--color-leaf-primary)" />
            {monthNames[month].toUpperCase()} {year}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Monthly macro horizon: semester deadlines, exam countdowns & certification targets
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setViewDate(new Date(2026, 10, 1))}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: '700'
            }}
          >
            Today
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={prevMonth}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Overflow Scroll Wrapper for Small/Medium Screens */}
      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '4px' }}>
        <div style={{ minWidth: '780px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          {/* Weekday Column Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            paddingBottom: '4px'
          }}>
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          {/* Sized Proportional Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px'
          }}>
            {cells.map((cell, idx) => {
              const { day, isCurrentMonth, isToday, events = [] } = cell;

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: '105px',
                    height: '115px',
                    background: isToday ? 'var(--bg-surface-elevated)' : isCurrentMonth ? 'var(--bg-surface)' : 'rgba(0, 0, 0, 0.2)',
                    border: isToday ? '2px solid var(--color-leaf-primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isCurrentMonth ? 1 : 0.4,
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    boxShadow: isToday ? 'var(--shadow-glow-leaf)' : 'none',
                    overflow: 'hidden'
                  }}
                >
                  {/* Day Number Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: isToday ? '900' : '700',
                      fontFamily: 'var(--font-mono)',
                      color: isToday ? 'var(--color-leaf-primary)' : isCurrentMonth ? 'var(--text-main)' : 'var(--text-dim)'
                    }}>
                      {day}
                    </span>

                    {isToday && (
                      <span style={{
                        fontSize: '9px',
                        background: 'var(--color-leaf-primary)',
                        color: '#000',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontWeight: '800',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto', maxHeight: '78px', paddingRight: '2px' }}>
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          background: ev.bg || 'var(--color-leaf-light)',
                          borderLeft: `3px solid ${ev.color}`,
                          padding: '3px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: '700',
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.2'
                        }}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}

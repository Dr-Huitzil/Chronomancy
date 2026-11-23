// src/components/InteractiveClockPicker.jsx - Horological Astrolabe Time Picker (12h/24h, Start-End Sync)

import React, { useState } from 'react';
import { Clock, ArrowRight, Sun, Moon, ChevronUp, ChevronDown } from 'lucide-react';
import { timeStringToMinutes, minutesToTimeString, formatDisplayTime, calculateDurationBetween, computeEndTime } from '../utils/timeUtils';

export function InteractiveClockPicker({
  startTime,
  duration,
  onChangeTime,
  timeFormat = '12h'
}) {
  const endTime = computeEndTime(startTime, duration);

  // Parse start time components
  const startParts = startTime.split(':');
  let startHour24 = parseInt(startParts[0] || '7', 10);
  const startMin = parseInt(startParts[1] || '30', 10);

  // Parse end time components
  const endParts = endTime.split(':');
  let endHour24 = parseInt(endParts[0] || '16', 10);
  const endMin = parseInt(endParts[1] || '30', 10);

  const adjustStartTime = (deltaHours, deltaMins) => {
    let currentMins = timeStringToMinutes(startTime);
    currentMins = (currentMins + deltaHours * 60 + deltaMins + 1440) % 1440;
    const newStart = minutesToTimeString(currentMins);
    onChangeTime(newStart, duration);
  };

  const adjustEndTime = (deltaHours, deltaMins) => {
    let endMins = timeStringToMinutes(endTime);
    endMins = (endMins + deltaHours * 60 + deltaMins + 1440) % 1440;
    const newEnd = minutesToTimeString(endMins);
    const newDuration = calculateDurationBetween(startTime, newEnd);
    onChangeTime(startTime, Math.max(5, newDuration));
  };

  const toggleStartAmPm = () => {
    adjustStartTime(12, 0);
  };

  const toggleEndAmPm = () => {
    adjustEndTime(12, 0);
  };

  // 12-hour display values
  const get12hDisplay = (hour24, min) => {
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return {
      hour: String(hour12).padStart(2, '0'),
      minute: String(min).padStart(2, '0'),
      ampm
    };
  };

  const start12 = get12hDisplay(startHour24, startMin);
  const end12 = get12hDisplay(endHour24, endMin);

  const durationHours = Math.floor(duration / 60);
  const durationRemainingMins = duration % 60;

  return (
    <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-strong)', background: 'var(--bg-surface)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="var(--color-leaf-primary)" />
          HOROLOGICAL SPAN SELECTOR ({timeFormat.toUpperCase()})
        </span>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '800', color: 'var(--color-leaf-primary)', background: 'var(--color-leaf-light)', padding: '3px 8px', borderRadius: '4px' }}>
          Span: {durationHours > 0 ? `${durationHours}h ` : ''}{durationRemainingMins > 0 ? `${durationRemainingMins}m` : ''} ({duration}m)
        </span>
      </div>

      {/* Interactive Dual Clock Wheel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
        
        {/* START TIME COLUMN */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            START TIME
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            {/* Hours Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => adjustStartTime(1, 0)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronUp size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                {timeFormat === '12h' ? start12.hour : String(startHour24).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => adjustStartTime(-1, 0)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-dim)', marginTop: '-4px' }}>:</span>

            {/* Minutes Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => adjustStartTime(0, 15)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronUp size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                {String(startMin).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => adjustStartTime(0, -15)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* AM / PM Toggle for 12h mode */}
            {timeFormat === '12h' && (
              <button
                type="button"
                onClick={toggleStartAmPm}
                style={{
                  background: 'var(--color-leaf-light)',
                  border: '1px solid var(--color-leaf-border)',
                  color: 'var(--color-leaf-primary)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)',
                  marginLeft: '4px'
                }}
              >
                {start12.ampm}
              </button>
            )}
          </div>
        </div>

        {/* Center Astrolabe Connector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-leaf-primary)' }}>
          <ArrowRight size={20} strokeWidth={2.5} />
        </div>

        {/* END TIME COLUMN */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            END TIME
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            {/* Hours Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => adjustEndTime(1, 0)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronUp size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                {timeFormat === '12h' ? end12.hour : String(endHour24).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => adjustEndTime(-1, 0)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-dim)', marginTop: '-4px' }}>:</span>

            {/* Minutes Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => adjustEndTime(0, 15)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronUp size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                {String(endMin).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => adjustEndTime(0, -15)}
                style={{ background: 'transparent', color: 'var(--text-muted)', padding: '2px' }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* AM / PM Toggle for 12h mode */}
            {timeFormat === '12h' && (
              <button
                type="button"
                onClick={toggleEndAmPm}
                style={{
                  background: 'var(--color-sun-light)',
                  border: '1px solid var(--color-sun-amber)',
                  color: 'var(--color-sun-warm)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)',
                  marginLeft: '4px'
                }}
              >
                {end12.ampm}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

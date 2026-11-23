// src/components/CircularClockPicker.jsx - Google Material-style Circular Clock with Drag, Any-Minute Selection & Editable Digits

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check, Keyboard } from 'lucide-react';
import { formatDisplayTime } from '../utils/timeUtils';

export function CircularClockPicker({
  value = "07:30",
  onChange,
  label = "Time",
  timeFormat = "12h"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('hours'); // 'hours' or 'minutes'
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState('clock'); // 'clock' or 'keyboard'

  // Parse incoming HH:MM value
  const parts = value.split(':');
  let currentH24 = parseInt(parts[0] || '7', 10);
  let currentM = parseInt(parts[1] || '30', 10);

  const [selectedH24, setSelectedH24] = useState(currentH24);
  const [selectedM, setSelectedM] = useState(currentM);

  const svgRef = useRef(null);
  const popoverRef = useRef(null);

  // Sync state if external value changes
  useEffect(() => {
    const p = value.split(':');
    setSelectedH24(parseInt(p[0] || '7', 10));
    setSelectedM(parseInt(p[1] || '30', 10));
  }, [value]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 12-hour calculations
  const isPM = selectedH24 >= 12;
  const hour12 = selectedH24 % 12 || 12;

  const updateTime = (newH24, newM) => {
    setSelectedH24(newH24);
    setSelectedM(newM);
    const timeStr = `${String(newH24).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
    onChange(timeStr);
  };

  const handleHourChange = (newH12) => {
    let newH24 = newH12;
    if (isPM && newH12 !== 12) newH24 = newH12 + 12;
    if (!isPM && newH12 === 12) newH24 = 0;
    updateTime(newH24, selectedM);
  };

  const handleMinuteChange = (newM) => {
    const clampedM = Math.max(0, Math.min(59, newM));
    updateTime(selectedH24, clampedM);
  };

  const toggleAmPm = (targetAmPm) => {
    let newH24 = selectedH24;
    if (targetAmPm === 'PM' && selectedH24 < 12) newH24 += 12;
    if (targetAmPm === 'AM' && selectedH24 >= 12) newH24 -= 12;
    updateTime(newH24, selectedM);
  };

  // Circular clock face geometry
  const cx = 110;
  const cy = 110;
  const radius = 78;

  // Compute angle from pointer position (Google Material TimePicker Math)
  const calculateAngleFromEvent = (e) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    let angleRad = Math.atan2(y, x);
    let angleDeg = (angleRad * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;
    return angleDeg;
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.target.setPointerCapture?.(e.pointerId);
    handlePointerSelect(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handlePointerSelect(e);
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.target.releasePointerCapture?.(e.pointerId);

    // Google convention: when releasing hour selection, auto-transition to minutes
    if (mode === 'hours') {
      setMode('minutes');
    }
  };

  const handlePointerSelect = (e) => {
    const angleDeg = calculateAngleFromEvent(e);

    if (mode === 'hours') {
      const h = Math.round(angleDeg / 30) % 12 || 12;
      handleHourChange(h);
    } else {
      // Allows selecting ANY minute (0 through 59)!
      const m = Math.round(angleDeg / 6) % 60;
      handleMinuteChange(m);
    }
  };

  // Compute hand line coordinates
  let activeAngleDeg = 0;
  if (mode === 'hours') {
    activeAngleDeg = hour12 * 30 - 90;
  } else {
    activeAngleDeg = selectedM * 6 - 90;
  }
  const activeRad = (activeAngleDeg * Math.PI) / 180;
  const handX = cx + radius * Math.cos(activeRad);
  const handY = cy + radius * Math.sin(activeRad);

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={popoverRef}>
      {label && (
        <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
          {label}
        </label>
      )}

      {/* The Text Box with Clickable Clock Icon */}
      <div
        onClick={() => {
          setIsOpen(prev => !prev);
          setMode('hours');
        }}
        style={{
          width: '100%',
          padding: '9px 12px',
          borderRadius: 'var(--radius-sm)',
          border: isOpen ? '1px solid var(--color-leaf-primary)' : '1px solid var(--border-light)',
          background: 'var(--bg-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
          boxShadow: isOpen ? 'var(--shadow-glow-leaf)' : 'none'
        }}
      >
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-main)'
        }}>
          {formatDisplayTime(value, timeFormat)}
        </span>

        <button
          type="button"
          style={{
            background: 'transparent',
            color: isOpen ? 'var(--color-leaf-primary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            padding: '2px'
          }}
        >
          <Clock size={16} strokeWidth={isOpen ? 2.5 : 2} />
        </button>
      </div>

      {/* Google-style Circular Clock Popover */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '0',
            zIndex: 3000,
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: '16px',
            width: '264px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Editable Digital Header (Direct Numeric Typing Support) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
              
              {/* Editable Hour Box */}
              <input
                type="number"
                min="1"
                max={timeFormat === '12h' ? '12' : '23'}
                value={timeFormat === '12h' ? String(hour12).padStart(2, '0') : String(selectedH24).padStart(2, '0')}
                onFocus={() => setMode('hours')}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    if (timeFormat === '12h') {
                      handleHourChange(Math.min(12, Math.max(1, val)));
                    } else {
                      updateTime(Math.min(23, Math.max(0, val)), selectedM);
                    }
                  }
                }}
                style={{
                  width: '46px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: mode === 'hours' ? 'var(--color-leaf-primary)' : 'var(--text-main)',
                  background: mode === 'hours' ? 'var(--color-leaf-light)' : 'var(--bg-surface)',
                  border: mode === 'hours' ? '1px solid var(--color-leaf-border)' : '1px solid var(--border-light)',
                  borderRadius: '4px',
                  padding: '2px 0'
                }}
              />
              
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-dim)' }}>:</span>

              {/* Editable Minute Box (Edit Any Minute 00-59) */}
              <input
                type="number"
                min="0"
                max="59"
                value={String(selectedM).padStart(2, '0')}
                onFocus={() => setMode('minutes')}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    handleMinuteChange(val);
                  }
                }}
                style={{
                  width: '46px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: mode === 'minutes' ? 'var(--color-leaf-primary)' : 'var(--text-main)',
                  background: mode === 'minutes' ? 'var(--color-leaf-light)' : 'var(--bg-surface)',
                  border: mode === 'minutes' ? '1px solid var(--color-leaf-border)' : '1px solid var(--border-light)',
                  borderRadius: '4px',
                  padding: '2px 0'
                }}
              />
            </div>

            {/* AM / PM Selector */}
            {timeFormat === '12h' && (
              <div style={{ display: 'flex', gap: '3px', background: 'var(--bg-surface)', padding: '2px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => toggleAmPm('AM')}
                  style={{
                    padding: '4px 7px',
                    fontSize: '10px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '3px',
                    background: !isPM ? 'var(--color-leaf-primary)' : 'transparent',
                    color: !isPM ? '#000' : 'var(--text-muted)'
                  }}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => toggleAmPm('PM')}
                  style={{
                    padding: '4px 7px',
                    fontSize: '10px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '3px',
                    background: isPM ? 'var(--color-sun-amber)' : 'transparent',
                    color: isPM ? '#000' : 'var(--text-muted)'
                  }}
                >
                  PM
                </button>
              </div>
            )}
          </div>

          {/* Circular Analog Clock Face with Drag & Touch Support */}
          <div style={{ position: 'relative', width: '220px', height: '220px', touchAction: 'none' }}>
            <svg
              ref={svgRef}
              width="220"
              height="220"
              viewBox="0 0 220 220"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ userSelect: 'none', cursor: 'pointer' }}
            >
              {/* Outer Clock Rim */}
              <circle cx={cx} cy={cy} r="102" fill="var(--bg-surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
              
              {/* 60 Minute Tick Marks (Google Style) */}
              {Array.from({ length: 60 }, (_, i) => {
                const deg = i * 6 - 90;
                const rad = (deg * Math.PI) / 180;
                const isMajor = i % 5 === 0;
                const tickR = isMajor ? 94 : 96;
                const x = cx + tickR * Math.cos(rad);
                const y = cy + tickR * Math.sin(rad);

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isMajor ? 1.8 : 0.8}
                    fill={isMajor ? 'var(--border-strong)' : 'var(--border-light)'}
                  />
                );
              })}

              {/* Hand Line & Center Pivot */}
              <line
                x1={cx}
                y1={cy}
                x2={handX}
                y2={handY}
                stroke="var(--color-leaf-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx={cx} cy={cy} r="4" fill="var(--color-leaf-primary)" />
              
              {/* Hand Pin Pointer Highlight */}
              <circle
                cx={handX}
                cy={handY}
                r="15"
                fill="var(--color-leaf-primary)"
                opacity="0.25"
              />
              <circle
                cx={handX}
                cy={handY}
                r="14"
                fill="none"
                stroke="var(--color-leaf-primary)"
                strokeWidth="1.5"
              />

              {/* Dial Numbers */}
              {mode === 'hours' ? (
                // 12 Hours on circle
                Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                  const deg = h * 30 - 90;
                  const rad = (deg * Math.PI) / 180;
                  const x = cx + radius * Math.cos(rad);
                  const y = cy + radius * Math.sin(rad);
                  const isSelected = hour12 === h;

                  return (
                    <text
                      key={h}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      fill={isSelected ? 'var(--color-leaf-primary)' : 'var(--text-main)'}
                      fontSize="12"
                      fontWeight={isSelected ? '800' : '600'}
                      fontFamily="var(--font-mono)"
                      pointerEvents="none"
                    >
                      {h}
                    </text>
                  );
                })
              ) : (
                // 12 Minute markers (00, 05, 10, ... 55)
                [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
                  const deg = m * 6 - 90;
                  const rad = (deg * Math.PI) / 180;
                  const x = cx + radius * Math.cos(rad);
                  const y = cy + radius * Math.sin(rad);
                  const isSelected = selectedM === m;

                  return (
                    <text
                      key={m}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      fill={isSelected ? 'var(--color-leaf-primary)' : 'var(--text-main)'}
                      fontSize="11"
                      fontWeight={isSelected ? '800' : '600'}
                      fontFamily="var(--font-mono)"
                      pointerEvents="none"
                    >
                      {String(m).padStart(2, '0')}
                    </text>
                  );
                })
              )}
            </svg>
          </div>

          {/* Quick Minute Increments & Confirm Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[0, 15, 30, 45].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMinuteChange(m)}
                  style={{
                    background: selectedM === m ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
                    color: selectedM === m ? '#000' : 'var(--text-muted)',
                    border: '1px solid var(--border-light)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  :{String(m).padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'var(--color-leaf-primary)',
                color: '#000',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} strokeWidth={2.5} />
              Set
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

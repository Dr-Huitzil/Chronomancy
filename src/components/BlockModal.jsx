// src/components/BlockModal.jsx - Schedule Block & Recurring Anchor Editor with Circular Clock Picker & Break Deduction

import React, { useState } from 'react';
import { X, Clock, Bus, Briefcase, Coffee, BookOpen, Laptop, Award, Trash2, Utensils, ShieldCheck } from 'lucide-react';
import { CircularClockPicker } from './CircularClockPicker';
import { calculateDurationBetween, computeEndTime } from '../utils/timeUtils';

export function BlockModal({ isOpen, onClose, onSave, onDelete, initialBlock, timeFormat = '12h' }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialBlock?.title || '');
  const [time, setTime] = useState(initialBlock?.time || '07:30');
  const [duration, setDuration] = useState(initialBlock?.duration || 540); // 9 hours default for full shift
  const [type, setType] = useState(initialBlock?.type || 'work');
  const [category, setCategory] = useState(initialBlock?.category || 'Work');
  const [isRecurring, setIsRecurring] = useState(initialBlock?.isRecurring ?? true);
  const [selectedDays, setSelectedDays] = useState(initialBlock?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  // Embedded Break / Lunch State
  const [hasBreak, setHasBreak] = useState(initialBlock?.hasBreak || false);
  const [breakTitle, setBreakTitle] = useState(initialBlock?.breakTitle || 'Midday Lunch Break');
  const [breakStart, setBreakStart] = useState(initialBlock?.breakStart || '11:30');
  const [breakDuration, setBreakDuration] = useState(initialBlock?.breakDuration || 60);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const presets = [
    { label: 'Work Shift (7:30 - 4:30 + 1h Lunch)', type: 'work', category: 'Work', time: '07:30', duration: 540, hasBreak: true, breakTitle: 'Midday Lunch', breakStart: '11:30', breakDuration: 60, icon: Briefcase },
    { label: 'Morning Commute', type: 'friction', category: 'Commute', time: '07:00', duration: 30, hasBreak: false, icon: Bus },
    { label: 'Protected Lunch Hour', type: 'routine', category: 'Life', time: '12:00', duration: 60, hasBreak: false, icon: Coffee },
    { label: 'Study Session', type: 'study', category: 'Academic', time: '17:00', duration: 90, hasBreak: false, icon: BookOpen },
    { label: 'Coding Build Block', type: 'project', category: 'Project', time: '19:00', duration: 60, hasBreak: false, icon: Laptop }
  ];

  const handleApplyPreset = (preset) => {
    setTitle(preset.label);
    setType(preset.type);
    setCategory(preset.category);
    setTime(preset.time);
    setDuration(preset.duration);
    setHasBreak(preset.hasBreak);
    if (preset.hasBreak) {
      setBreakTitle(preset.breakTitle);
      setBreakStart(preset.breakStart);
      setBreakDuration(preset.breakDuration);
    }
  };

  const handleStartTimeChange = (newStart) => {
    const currentEnd = computeEndTime(time, duration);
    setTime(newStart);
    // Keep duration or recompute based on end
    const newDur = calculateDurationBetween(newStart, currentEnd);
    if (newDur > 0) setDuration(newDur);
  };

  const handleEndTimeChange = (newEnd) => {
    const newDur = calculateDurationBetween(time, newEnd);
    setDuration(Math.max(5, newDur));
  };

  const handleQuickDuration = (mins) => {
    setDuration(mins);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const endTime = computeEndTime(time, duration);
  const netActiveMinutes = (type === 'work' && hasBreak) ? Math.max(0, duration - breakDuration) : duration;
  const durationHours = Math.floor(duration / 60);
  const durationRemainingMins = duration % 60;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const breakActive = type === 'work' && hasBreak;

    onSave({
      id: initialBlock?.id || `s-${Date.now()}`,
      title: title.trim(),
      time,
      duration: Number(duration),
      type,
      category,
      isRecurring,
      days: isRecurring ? selectedDays : [],
      hasBreak: breakActive,
      breakTitle: breakActive ? breakTitle : undefined,
      breakStart: breakActive ? breakStart : undefined,
      breakDuration: breakActive ? Number(breakDuration) : 0,
      status: initialBlock?.status || 'planned'
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-overlay)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: 'var(--bg-surface-elevated)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid var(--border-strong)',
        boxShadow: 'var(--shadow-md)'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--color-leaf-primary)" />
              {initialBlock ? 'EDIT HOROLOGICAL SPAN' : 'CONSTRUCT HOROLOGICAL SPAN'}
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Click clock icons to summon the circular dial & configure internal break deductions
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>
            QUICK ANCHOR PRESETS
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {presets.map((p) => {
              const { icon: PresetIcon } = p;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-main)',
                    padding: '5px 9px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <PresetIcon size={12} color="var(--color-leaf-primary)" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Title Input */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              Block Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work Shift, Campus Commute, Lunch Break"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '13px'
              }}
            />
          </div>

          {/* Start Time & End Time Text Boxes with Clickable Clock Symbols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CircularClockPicker
              label="Start Time"
              value={time}
              timeFormat={timeFormat}
              onChange={handleStartTimeChange}
            />

            <CircularClockPicker
              label="End Time"
              value={endTime}
              timeFormat={timeFormat}
              onChange={handleEndTimeChange}
            />
          </div>

          {/* Quick Duration Chips & Span Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {[15, 30, 45, 60, 90, 120, 240, 540].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleQuickDuration(mins)}
                  style={{
                    background: duration === mins ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
                    color: duration === mins ? '#000' : 'var(--text-muted)',
                    border: '1px solid var(--border-light)',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--color-leaf-primary)' }}>
              Total Span: {durationHours > 0 ? `${durationHours}h ` : ''}{durationRemainingMins > 0 ? `${durationRemainingMins}m` : ''} ({duration}m)
            </span>
          </div>

          {/* Category & Behavior */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              Category & Behavior
            </label>
            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value;
                setType(newType);
                if (newType === 'work') {
                  setCategory('Work');
                } else if (newType === 'friction') {
                  setCategory('Commute');
                  setHasBreak(false);
                } else if (newType === 'routine') {
                  setCategory('Life');
                  setHasBreak(false);
                } else if (newType === 'study') {
                  setCategory('Academic');
                  setHasBreak(false);
                } else if (newType === 'project') {
                  setCategory('Project');
                  setHasBreak(false);
                } else if (newType === 'cert') {
                  setCategory('Certification');
                  setHasBreak(false);
                } else {
                  setHasBreak(false);
                }
              }}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '12px'
              }}
            >
              <option value="work">Work Shift (Employment hours with optional break deduction)</option>
              <option value="friction">Friction / Commute Buffer (Transit, travel time)</option>
              <option value="routine">Routine / Biological (Lunch, morning prep, meals)</option>
              <option value="study">Academic Study / Lecture (INT XP progression)</option>
              <option value="project">Project Coding Build (DEX XP progression)</option>
              <option value="cert">Certification Study (WIS XP progression)</option>
            </select>
          </div>

          {/* Internal Break / Lunch Deductions (ONLY rendered when Work Shift is selected) */}
          {type === 'work' && (
            <div className="glass-card" style={{ padding: '14px', border: hasBreak ? '1px solid var(--color-leaf-primary)' : '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Utensils size={14} color="var(--color-leaf-primary)" />
                    Embedded Lunch / Internal Break Deduction
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Prevents false double-counting: carves personal break from gross shift span
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={hasBreak}
                  onChange={(e) => setHasBreak(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-leaf-primary)' }}
                />
              </div>

              {hasBreak && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {/* Break Start Time with Circular Clock Picker */}
                    <CircularClockPicker
                      label="Break Start Time"
                      value={breakStart}
                      timeFormat={timeFormat}
                      onChange={(newBStart) => setBreakStart(newBStart)}
                    />

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                        Break Duration (Min)
                      </label>
                      <input
                        type="number"
                        step="5"
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          fontSize: '13px',
                          fontFamily: 'var(--font-mono)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Mathematical Integrity Preview */}
                  <div style={{
                    background: 'var(--color-leaf-light)',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} color="var(--color-leaf-primary)" />
                      Zero-Sum Split:
                    </span>
                    <span style={{ fontWeight: '800', color: 'var(--color-leaf-primary)' }}>
                      {netActiveMinutes}m Net Labor ({(netActiveMinutes/60).toFixed(1)}h) + {breakDuration}m Lunch = {duration}m Total
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Repeating Anchor Days Toggle */}
          <div className="glass-card" style={{ padding: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Repeating Anchor Routine
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Auto-populates onto selected weekdays in the Weekly Timetable
                </div>
              </div>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-leaf-primary)' }}
              />
            </div>

            {isRecurring && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {daysOfWeek.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        style={{
                          flex: 1,
                          padding: '5px 0',
                          borderRadius: '4px',
                          background: isSelected ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
                          color: isSelected ? '#000' : 'var(--text-muted)',
                          border: '1px solid var(--border-light)',
                          fontSize: '10px',
                          fontWeight: '800'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            {initialBlock && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete block "${title}"?`)) {
                    onDelete(initialBlock.id);
                    onClose();
                  }
                }}
                style={{
                  background: 'var(--color-leak-bg)',
                  border: '1px solid var(--color-leak-border)',
                  color: 'var(--color-leak-rust)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Trash2 size={13} />
                Delete
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  background: 'var(--color-leaf-primary)',
                  color: '#000',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: '800'
                }}
              >
                {initialBlock ? 'Save Changes' : 'Weave into Schedule'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

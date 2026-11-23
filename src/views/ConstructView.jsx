// src/views/ConstructView.jsx - Dedicated Horological Construct Studio (Minute-Level Time Accounting)

import React, { useState, useEffect } from 'react';
import { 
  Clock, Plus, PlusCircle, Play, Pause, RotateCcw, 
  Briefcase, BookOpen, Laptop, Award, Bus, Coffee, 
  AlertOctagon, CheckCircle2, ShieldCheck, Utensils, 
  Sparkles, ArrowRight, Zap, History, Calendar, Check
} from 'lucide-react';
import { CircularClockPicker } from '../components/CircularClockPicker';
import { calculateDurationBetween, computeEndTime, formatDisplayTime } from '../utils/timeUtils';

export function ConstructView({
  schedule = [],
  user = { dailyCapacityMinutes: 1440, sleepMinutesBudget: 480 },
  timeFormat = '12h',
  onSaveBlock,
  onNavigateToRunway
}) {
  // Mode switcher: 'rapid' (fast minute entry) vs 'live' (real-time chronometer)
  const [activeTab, setActiveTab] = useState('rapid'); // 'rapid', 'live'

  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(() => {
    // Default to current local time rounded to nearest 5 minutes
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
    return `${hours}:${mins}`;
  });
  const [duration, setDuration] = useState(30); // 30 minutes default
  const [type, setType] = useState('study');
  const [category, setCategory] = useState('Academic');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  
  // Work shift embedded break state (strictly only used if type === 'work')
  const [hasBreak, setHasBreak] = useState(true);
  const [breakTitle, setBreakTitle] = useState('Protected Work Lunch');
  const [breakStart, setBreakStart] = useState('11:30');
  const [breakDuration, setBreakDuration] = useState(60);

  // Success flash notice
  const [flashMessage, setFlashMessage] = useState(null);

  // Live Chronometer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState(null);

  // Live timer interval effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    if (!isTimerRunning && timerSeconds === 0) {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimerStartTime(`${h}:${m}`);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);
  };

  const handleCommitTimerSpan = () => {
    const elapsedMinutes = Math.max(1, Math.round(timerSeconds / 60));
    const now = new Date();
    const endH = String(now.getHours()).padStart(2, '0');
    const endM = String(now.getMinutes()).padStart(2, '0');
    
    // Set form fields with timer values
    setTime(timerStartTime || `${endH}:${endM}`);
    setDuration(elapsedMinutes);
    if (!title.trim()) {
      setTitle('Focused Flow Session');
    }
    setActiveTab('rapid');
    handleResetTimer();
    showFlash(`Captured ${elapsedMinutes}m live span. Review and weave to runway.`);
  };

  // Helper flash toast
  const showFlash = (msg) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 4000);
  };

  // Quick Duration Steppers
  const adjustDuration = (delta) => {
    setDuration(prev => Math.max(1, prev + delta));
  };

  // Quick activity presets
  const quickChips = [
    { label: 'Deep Focus Study', type: 'study', category: 'Academic', dur: 45, icon: BookOpen },
    { label: 'Work Shift', type: 'work', category: 'Work', dur: 540, icon: Briefcase },
    { label: 'Code & Architecture Build', type: 'project', category: 'Project', dur: 60, icon: Laptop },
    { label: 'Transit Commute', type: 'friction', category: 'Commute', dur: 30, icon: Bus },
    { label: 'AWS Cert Module', type: 'cert', category: 'Certification', dur: 45, icon: Award },
    { label: 'Midday Meal & Rest', type: 'routine', category: 'Life', dur: 45, icon: Coffee },
    { label: 'Temporal Entropy Leak', type: 'leak', category: 'Leak', dur: 20, icon: AlertOctagon }
  ];

  const handleApplyChip = (chip) => {
    setTitle(chip.label);
    setType(chip.type);
    setCategory(chip.category);
    setDuration(chip.dur);
    if (chip.type === 'work') {
      setHasBreak(true);
    } else {
      setHasBreak(false);
    }
  };

  // Calculate day gaps between blocks
  const calculateDayGaps = () => {
    const sorted = [...schedule]
      .filter(b => b.time && b.duration)
      .map(b => {
        const [h, m] = b.time.split(':').map(Number);
        const startMin = h * 60 + m;
        return {
          ...b,
          startMin,
          endMin: startMin + b.duration
        };
      })
      .sort((a, b) => a.startMin - b.startMin);

    const gaps = [];
    // Waking hours: check from 06:00 (360m) to 23:00 (1380m)
    let cursor = 420; // 07:00 AM
    sorted.forEach(block => {
      if (block.startMin > cursor + 10) {
        const gapMins = block.startMin - cursor;
        const gapH = String(Math.floor(cursor / 60)).padStart(2, '0');
        const gapM = String(cursor % 60).padStart(2, '0');
        const gapEndH = String(Math.floor(block.startMin / 60)).padStart(2, '0');
        const gapEndM = String(block.startMin % 60).padStart(2, '0');
        gaps.push({
          start: `${gapH}:${gapM}`,
          end: `${gapEndH}:${gapEndM}`,
          duration: gapMins
        });
      }
      cursor = Math.max(cursor, block.endMin);
    });

    return gaps.slice(0, 3); // Return top 3 gaps
  };

  const detectedGaps = calculateDayGaps();

  const handleClaimGap = (gap) => {
    setTime(gap.start);
    setDuration(gap.duration);
    setTitle('Unaccounted Activity');
    showFlash(`Claimed ${gap.duration}m gap (${formatDisplayTime(gap.start, timeFormat)} - ${formatDisplayTime(gap.end, timeFormat)}).`);
  };

  const handleStartTimeChange = (newStart) => {
    setTime(newStart);
  };

  const handleEndTimeChange = (newEnd) => {
    const newDur = calculateDurationBetween(time, newEnd);
    if (newDur > 0) {
      setDuration(newDur);
    }
  };

  const endTime = computeEndTime(time, duration);
  const isWorkCategory = type === 'work';
  const breakActive = isWorkCategory && hasBreak;
  const netActiveMinutes = breakActive ? Math.max(0, duration - breakDuration) : duration;

  // Total allocated minutes calculation
  const totalAllocatedMinutes = schedule.reduce((sum, b) => sum + b.duration, 0) + user.sleepMinutesBudget;
  const remainingMargin = Math.max(0, user.dailyCapacityMinutes - totalAllocatedMinutes);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBlock = {
      id: `s-${Date.now()}`,
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
      status: 'planned'
    };

    onSaveBlock(newBlock);
    showFlash(`Wove ${duration}m block "${newBlock.title}" into Today's Runway.`);
    
    // Clear title for fast subsequent logging
    setTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Studio Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'var(--color-leaf-light)',
              border: '1px solid var(--color-leaf-border)',
              color: 'var(--color-leaf-primary)',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)'
            }}>
              MINUTE LOGGING ENGINE
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <PlusCircle size={24} color="var(--color-leaf-primary)" />
            CONSTRUCT HOROLOGICAL SPAN
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Account for every minute of your 1,440-minute day with precision clock dialing & live flow capture
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Day Margin Indicator */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-strong)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>UNALLOCATED MARGIN</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: remainingMargin > 0 ? 'var(--color-leaf-primary)' : 'var(--color-leak-rust)' }}>
                {remainingMargin}m
              </div>
            </div>
            <button
              onClick={onNavigateToRunway}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
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
              <span>View Runway</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Success Flash Toast Notification */}
      {flashMessage && (
        <div style={{
          background: 'var(--color-leaf-light)',
          border: '1px solid var(--color-leaf-primary)',
          color: 'var(--text-main)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-glow-leaf)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="var(--color-leaf-primary)" />
            <span>{flashMessage}</span>
          </div>
          <button
            onClick={() => setFlashMessage(null)}
            style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Capture Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('rapid')}
          style={{
            background: activeTab === 'rapid' ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
            color: activeTab === 'rapid' ? '#000' : 'var(--text-main)',
            border: '1px solid var(--border-strong)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Zap size={15} strokeWidth={2.5} />
          <span>RAPID MINUTE LOGGER</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          style={{
            background: activeTab === 'live' ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
            color: activeTab === 'live' ? '#000' : 'var(--text-main)',
            border: '1px solid var(--border-strong)',
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Play size={15} strokeWidth={2.5} />
          <span>LIVE FOCUS CHRONOMETER</span>
          {isTimerRunning && (
            <span style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              background: '#000',
              color: 'var(--color-leaf-primary)',
              padding: '1px 5px',
              borderRadius: '3px'
            }}>
              RUNNING
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: RAPID MINUTE LOGGER */}
      {activeTab === 'rapid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.9fr)', gap: '20px' }}>
          
          {/* Main Form Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Quick Activity Chips */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '8px' }}>
                FREQUENT / ONE-TAP ACTIVITY PRESETS
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {quickChips.map(chip => {
                  const { icon: ChipIcon } = chip;
                  const isCurrent = title === chip.label;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleApplyChip(chip)}
                      style={{
                        background: isCurrent ? 'var(--color-leaf-light)' : 'var(--bg-surface)',
                        border: isCurrent ? '1px solid var(--color-leaf-primary)' : '1px solid var(--border-light)',
                        color: isCurrent ? 'var(--color-leaf-primary)' : 'var(--text-main)',
                        padding: '6px 11px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ChipIcon size={13} color="var(--color-leaf-primary)" />
                      <span>{chip.label} ({chip.dur}m)</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Activity Title Input */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Activity / Span Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 301 Problem Set, Morning Commute, Work Shift"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />
              </div>

              {/* Start & End Time Circular Clock Pickers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <CircularClockPicker
                  label="Start Time"
                  value={time}
                  timeFormat={timeFormat}
                  onChange={handleStartTimeChange}
                />

                <CircularClockPicker
                  label="End Time (Calculated)"
                  value={endTime}
                  timeFormat={timeFormat}
                  onChange={handleEndTimeChange}
                />
              </div>

              {/* Minute Steppers & Direct Duration Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Span Duration: {duration} Minutes ({Math.floor(duration / 60)}h {duration % 60}m)
                  </label>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-leaf-primary)' }}>
                    Span: {formatDisplayTime(time, timeFormat)} - {formatDisplayTime(endTime, timeFormat)}
                  </span>
                </div>

                {/* Stepper Buttons for Fast Minute Logging */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {[1, 5, 10, 15, 25, 30, 45, 60, 90, 120].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setDuration(step)}
                      style={{
                        background: duration === step ? 'var(--color-leaf-primary)' : 'var(--bg-surface)',
                        color: duration === step ? '#000' : 'var(--text-muted)',
                        border: '1px solid var(--border-light)',
                        padding: '5px 9px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {step >= 60 ? `${step / 60}h` : `${step}m`}
                    </button>
                  ))}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => adjustDuration(-5)}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}
                    >
                      -5m
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={duration}
                      onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                      style={{
                        width: '60px',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'center'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => adjustDuration(5)}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}
                    >
                      +5m
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Category & Behavioral XP Alignment
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
                  {[
                    { id: 'work', cat: 'Work', label: 'Work Shift', Icon: Briefcase, color: 'var(--color-sun-warm)' },
                    { id: 'study', cat: 'Academic', label: 'Study (INT)', Icon: BookOpen, color: 'var(--color-leaf-primary)' },
                    { id: 'project', cat: 'Project', label: 'Coding (DEX)', Icon: Laptop, color: 'var(--color-leaf-primary)' },
                    { id: 'cert', cat: 'Certification', label: 'Cert (WIS)', Icon: Award, color: 'var(--color-sun-amber)' },
                    { id: 'friction', cat: 'Commute', label: 'Commute', Icon: Bus, color: 'var(--color-transit-terracotta)' },
                    { id: 'routine', cat: 'Life', label: 'Life Routine', Icon: Coffee, color: 'var(--text-main)' },
                    { id: 'leak', cat: 'Leak', label: 'Entropy Leak', Icon: AlertOctagon, color: 'var(--color-leak-rust)' }
                  ].map(catItem => {
                    const { Icon } = catItem;
                    const isSelected = type === catItem.id;
                    return (
                      <button
                        key={catItem.id}
                        type="button"
                        onClick={() => {
                          setType(catItem.id);
                          setCategory(catItem.cat);
                          if (catItem.id === 'work') {
                            setHasBreak(true);
                          } else {
                            setHasBreak(false);
                          }
                        }}
                        style={{
                          background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                          border: isSelected ? `2px solid ${catItem.color}` : '1px solid var(--border-light)',
                          color: isSelected ? catItem.color : 'var(--text-muted)',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: isSelected ? `0 0 12px ${catItem.color}33` : 'none'
                        }}
                      >
                        <Icon size={14} />
                        <span>{catItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CONDITIONAL BREAK DEDUCTION: STRICTLY ONLY SHOWN WHEN WORK SHIFT IS SELECTED */}
              {type === 'work' && (
                <div className="glass-card" style={{ padding: '14px', border: hasBreak ? '1px solid var(--color-leaf-primary)' : '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Utensils size={14} color="var(--color-leaf-primary)" />
                        Embedded Work Lunch / Break Carve-Out
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Net labor calculation: prevents false overlap between 9h shift and 1h lunch
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
                        <CircularClockPicker
                          label="Lunch Start"
                          value={breakStart}
                          timeFormat={timeFormat}
                          onChange={(newBStart) => setBreakStart(newBStart)}
                        />

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                            Lunch Duration (Min)
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
                          Net Accounting:
                        </span>
                        <span style={{ fontWeight: '800', color: 'var(--color-leaf-primary)' }}>
                          {netActiveMinutes}m Net Work ({(netActiveMinutes/60).toFixed(1)}h) + {breakDuration}m Lunch = {duration}m Total
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                style={{
                  background: 'var(--color-leaf-primary)',
                  color: '#000',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-glow-leaf)',
                  marginTop: '8px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>WEAVE {duration}m BLOCK TO RUNWAY</span>
              </button>
            </form>
          </div>

          {/* Side Panel: Gap Claimer & Real-Time Day Ledger */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Zero-Sum Gap Claimer */}
            <div className="glass-panel" style={{ padding: '18px', border: '1px solid var(--color-sun-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={16} color="var(--color-sun-amber)" />
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                  UNACCOUNTED DAY GAPS
                </h3>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Zero-sum auditing: claim gaps to account for every minute of your waking day
              </p>

              {detectedGaps.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--color-leaf-primary)', padding: '10px', background: 'var(--color-leaf-light)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>No unallocated daytime gaps detected! Schedule is tightly woven.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {detectedGaps.map((gap, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-light)',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                          {formatDisplayTime(gap.start, timeFormat)} - {formatDisplayTime(gap.end, timeFormat)}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-sun-amber)', fontWeight: '700' }}>
                          {gap.duration} minutes unallocated
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleClaimGap(gap)}
                        style={{
                          background: 'var(--color-sun-warm)',
                          color: '#000',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '800'
                        }}
                      >
                        Claim Gap
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Schedule Snapshot */}
            <div className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={15} color="var(--color-leaf-primary)" />
                  TODAY'S WOVEN RUNWAY
                </h3>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {schedule.length} Blocks
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                {schedule.map(block => (
                  <div
                    key={block.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {block.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {formatDisplayTime(block.time, timeFormat)} ({block.duration}m)
                      </div>
                    </div>

                    <span style={{
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: block.type === 'work' ? 'var(--color-sun-light)' : 'var(--color-leaf-light)',
                      color: block.type === 'work' ? 'var(--color-sun-warm)' : 'var(--color-leaf-primary)'
                    }}>
                      {block.category || block.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: LIVE FLOW CHRONOMETER */}
      {activeTab === 'live' && (
        <div className="glass-panel" style={{ padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
          
          <div>
            <span style={{
              background: 'var(--color-leaf-light)',
              border: '1px solid var(--color-leaf-border)',
              color: 'var(--color-leaf-primary)',
              fontSize: '11px',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)'
            }}>
              REAL-TIME MINUTE LOGGING
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
              Focus Chronometer
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '480px', margin: '4px auto 0 auto' }}>
              Measure focus blocks in real-time. When finished, weave the elapsed minutes directly onto today's runway.
            </p>
          </div>

          {/* Giant OLED Stopwatch Dial */}
          <div style={{
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: isTimerRunning ? '3px solid var(--color-leaf-primary)' : '2px solid var(--border-strong)',
            boxShadow: isTimerRunning ? 'var(--shadow-glow-leaf)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{ fontSize: '42px', fontWeight: '900', color: isTimerRunning ? 'var(--color-leaf-primary)' : 'var(--text-main)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              {String(Math.floor(timerSeconds / 3600)).padStart(2, '0')}:
              {String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0')}:
              {String(timerSeconds % 60).padStart(2, '0')}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {Math.max(1, Math.round(timerSeconds / 60))} Minutes Logged
            </div>

            {timerStartTime && (
              <div style={{ fontSize: '10px', color: 'var(--color-sun-warm)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                Started at {formatDisplayTime(timerStartTime, timeFormat)}
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                style={{
                  background: 'var(--color-leaf-primary)',
                  color: '#000',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-glow-leaf)',
                  cursor: 'pointer'
                }}
              >
                <Play size={16} strokeWidth={2.5} />
                <span>{timerSeconds > 0 ? 'Resume Timer' : 'Start Focus Flow'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseTimer}
                style={{
                  background: 'var(--color-sun-amber)',
                  color: '#000',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Pause size={16} strokeWidth={2.5} />
                <span>Pause Timer</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTimer}
              disabled={timerSeconds === 0}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                color: timerSeconds === 0 ? 'var(--text-dim)' : 'var(--text-muted)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: timerSeconds === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleCommitTimerSpan}
              disabled={timerSeconds < 30}
              style={{
                background: timerSeconds >= 30 ? 'var(--bg-surface-elevated)' : 'transparent',
                border: timerSeconds >= 30 ? '1px solid var(--color-leaf-primary)' : '1px solid var(--border-light)',
                color: timerSeconds >= 30 ? 'var(--color-leaf-primary)' : 'var(--text-dim)',
                padding: '12px 22px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: timerSeconds < 30 ? 'not-allowed' : 'pointer'
              }}
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Weave Elapsed Minutes</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

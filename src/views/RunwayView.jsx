// src/views/RunwayView.jsx - Tactical Runway with Google Calendar/PM Multi-Views (Day, Week, Month, Board)

import React, { useState } from 'react';
import { 
  Clock, Plus, PlusCircle, Bus, BookOpen, Footprints, Laptop, Award, 
  AlertOctagon, Sun, Coffee, Edit3, Trash2, Repeat, CheckCircle2,
  Briefcase, Calendar, Utensils, ShieldCheck, Columns3, CalendarDays, LayoutList,
  Zap, ArrowRight
} from 'lucide-react';
import { BlockModal } from '../components/BlockModal';
import { WeeklyAnchorMatrix } from '../components/WeeklyAnchorMatrix';
import { WeekCalendarView } from './runway/WeekCalendarView';
import { MonthCalendarView } from './runway/MonthCalendarView';
import { KanbanBoardView } from './runway/KanbanBoardView';
import { DayTimelineGrid } from './runway/DayTimelineGrid';
import { CircadianArc } from '../components/CircadianArc';
import { formatDisplayTime } from '../utils/timeUtils';

export function RunwayView({
  schedule,
  recurringAnchors,
  academics,
  certifications,
  chillingProjects,
  timeFormat = '12h',
  onSaveBlock,
  onDeleteBlock,
  onApplyAnchors,
  onNavigateToConstruct,
  onRebalanceLeak
}) {
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month', 'board'
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [activeItem, setActiveItem] = useState("s-3");
  const [showWeeklyMatrix, setShowWeeklyMatrix] = useState(false);

  // Quick Inline Minute Logger state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDuration, setQuickDuration] = useState(30);
  const [quickType, setQuickType] = useState('study');

  const handleQuickLog = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');

    let cat = 'Academic';
    if (quickType === 'work') cat = 'Work';
    if (quickType === 'friction') cat = 'Commute';
    if (quickType === 'routine') cat = 'Life';
    if (quickType === 'project') cat = 'Project';
    if (quickType === 'cert') cat = 'Certification';
    if (quickType === 'leak') cat = 'Leak';

    onSaveBlock({
      id: `s-${Date.now()}`,
      title: quickTitle.trim(),
      time: `${h}:${m}`,
      duration: Number(quickDuration),
      type: quickType,
      category: cat,
      isRecurring: false,
      hasBreak: false,
      status: 'planned'
    });

    setQuickTitle('');
  };

  // Day View Layout Mode: 'grid' (Google Calendar-style proportional) vs 'list' (compact card list)
  const [dayLayoutMode, setDayLayoutMode] = useState('grid');

  const handleAddAtTime = (clickedTime) => {
    setEditingBlock({
      time: clickedTime,
      duration: 60,
      title: '',
      type: 'study',
      category: 'Academic',
      isRecurring: false,
      hasBreak: false
    });
    setIsModalOpen(true);
  };

  const filteredSchedule = schedule.filter(block => {
    if (filterType === 'all') return true;
    if (filterType === 'friction') return block.type === 'friction';
    if (filterType === 'focus') return block.type === 'study' || block.type === 'project' || block.type === 'cert';
    if (filterType === 'work') return block.type === 'work';
    if (filterType === 'leak') return block.type === 'leak';
    return true;
  });

  const getBlockIcon = (block) => {
    if (block.type === 'work') return <Briefcase size={16} />;
    if (block.type === 'friction') {
      return block.title.toLowerCase().includes('commute') ? <Bus size={16} /> : <Footprints size={16} />;
    }
    if (block.type === 'leak') return <AlertOctagon size={16} />;
    if (block.type === 'project') return <Laptop size={16} />;
    if (block.type === 'cert') return <Award size={16} />;
    if (block.title.toLowerCase().includes('sunlight') || block.title.toLowerCase().includes('morning')) return <Sun size={16} />;
    if (block.title.toLowerCase().includes('meal') || block.title.toLowerCase().includes('lunch')) return <Coffee size={16} />;
    return <BookOpen size={16} />;
  };

  const handleOpenCreate = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (block) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* View Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={22} color="var(--color-leaf-primary)" />
            THE WEAVE OF MORTALITY
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multi-view temporal execution: Day Runway, Week Grid, Month Horizon & Kanban Flow
          </p>
        </div>

        {/* Real-time Astronomical Circadian & Lunar Arc HUD */}
        <CircadianArc timeFormat={timeFormat} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Multi-View Mode Switcher (Google Calendar / PM style) */}
          <div style={{ display: 'flex', gap: '3px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-strong)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
            {[
              { id: 'day', label: 'Day', Icon: Clock },
              { id: 'week', label: 'Week', Icon: Calendar },
              { id: 'month', label: 'Month', Icon: CalendarDays },
              { id: 'board', label: 'Board', Icon: Columns3 }
            ].map(vm => {
              const { Icon } = vm;
              const isSelected = viewMode === vm.id;
              return (
                <button
                  key={vm.id}
                  onClick={() => setViewMode(vm.id)}
                  style={{
                    background: isSelected ? 'var(--color-leaf-primary)' : 'transparent',
                    color: isSelected ? '#000' : 'var(--text-main)',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Icon size={12} strokeWidth={isSelected ? 2.5 : 2} />
                  <span>{vm.label}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle Weekly Timetable Anchors */}
          <button
            onClick={() => setShowWeeklyMatrix(prev => !prev)}
            style={{
              background: showWeeklyMatrix ? 'var(--color-leaf-primary)' : 'var(--bg-surface-elevated)',
              color: showWeeklyMatrix ? '#000' : 'var(--text-main)',
              border: '1px solid var(--border-strong)',
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Repeat size={14} />
            <span>ANCHOR TEMPLATES</span>
          </button>

          {/* Construct Block Studio Button */}
          <button 
            onClick={onNavigateToConstruct || handleOpenCreate}
            style={{
              background: 'var(--color-leaf-primary)',
              color: '#000',
              padding: '7px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PlusCircle size={15} strokeWidth={2.5} />
            Construct Block
          </button>
        </div>
      </div>

      {/* Weekly Anchor Matrix Dropdown */}
      {showWeeklyMatrix && (
        <WeeklyAnchorMatrix
          anchors={recurringAnchors}
          timeFormat={timeFormat}
          onApplyToToday={onApplyAnchors}
          onEditAnchor={(anchor) => {
            setEditingBlock(anchor);
            setIsModalOpen(true);
          }}
          onAddAnchor={() => {
            setEditingBlock({
              title: 'Work Shift',
              type: 'work',
              category: 'Work',
              time: '07:30',
              duration: 540,
              hasBreak: true,
              breakTitle: 'Midday Lunch',
              breakStart: '11:30',
              breakDuration: 60,
              isRecurring: true,
              days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
            });
            setIsModalOpen(true);
          }}
        />
      )}

      {/* VIEWPORT 1: DAY VIEW (24H TACTICAL RUNWAY) */}
      {viewMode === 'day' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Inline Rapid Minute Capture Strip */}
          <form
            onSubmit={handleQuickLog}
            className="glass-panel"
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-leaf-primary)', fontSize: '11px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
              <Zap size={14} />
              <span>RAPID LOG:</span>
            </div>

            <input
              type="text"
              required
              placeholder="What did you just do? (e.g. 20m reading, 45m lecture)..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              style={{
                flex: '1 1 200px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '12px'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                min="1"
                max="1440"
                value={quickDuration}
                onChange={(e) => setQuickDuration(Math.max(1, Number(e.target.value)))}
                style={{
                  width: '56px',
                  padding: '7px 6px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>mins</span>
            </div>

            <select
              value={quickType}
              onChange={(e) => setQuickType(e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '12px'
              }}
            >
              <option value="study">Study (INT)</option>
              <option value="project">Build (DEX)</option>
              <option value="cert">Cert (WIS)</option>
              <option value="work">Work</option>
              <option value="friction">Commute</option>
              <option value="routine">Life</option>
              <option value="leak">Leak</option>
            </select>

            <button
              type="submit"
              style={{
                background: 'var(--color-leaf-primary)',
                color: '#000',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Log Span</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToConstruct}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-light)',
                color: 'var(--text-muted)',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Full Studio</span>
              <ArrowRight size={12} />
            </button>
          </form>

          {/* Day View Sub-Toolbar: Filter Tabs & Proportional Grid vs Compact List Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--color-leaf-light)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              {[
                { id: 'all', label: 'All Weaves' },
                { id: 'focus', label: 'Study & Projects' },
                { id: 'work', label: 'Work Shifts' },
                { id: 'friction', label: 'Commute Buffers' },
                { id: 'leak', label: 'Entropy Leaks' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  style={{
                    background: filterType === tab.id ? 'var(--color-leaf-primary)' : 'transparent',
                    color: filterType === tab.id ? '#000' : 'var(--text-main)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {filteredSchedule.length} blocks woven
              </span>

              {/* Day Layout Switcher: Proportional Grid vs Compact List */}
              <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-light)', padding: '2px', borderRadius: '4px' }}>
                <button
                  type="button"
                  onClick={() => setDayLayoutMode('grid')}
                  style={{
                    background: dayLayoutMode === 'grid' ? 'var(--color-leaf-primary)' : 'transparent',
                    color: dayLayoutMode === 'grid' ? '#000' : 'var(--text-muted)',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Clock size={12} strokeWidth={dayLayoutMode === 'grid' ? 2.5 : 2} />
                  <span>Proportional Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDayLayoutMode('list')}
                  style={{
                    background: dayLayoutMode === 'list' ? 'var(--color-leaf-primary)' : 'transparent',
                    color: dayLayoutMode === 'list' ? '#000' : 'var(--text-muted)',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LayoutList size={12} strokeWidth={dayLayoutMode === 'list' ? 2.5 : 2} />
                  <span>Compact List</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW RENDER: PROPORTIONAL GRID VS COMPACT LIST */}
          {dayLayoutMode === 'grid' ? (
            <DayTimelineGrid
              schedule={filteredSchedule}
              timeFormat={timeFormat}
              onEditBlock={handleOpenEdit}
              onDeleteBlock={onDeleteBlock}
              onAddBlockAtTime={handleAddAtTime}
              onRebalanceLeak={onRebalanceLeak}
            />
          ) : (
            /* Compact Cards List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredSchedule.map((block) => {
                const isFriction = block.type === 'friction';
                const isLeak = block.type === 'leak';
                const isWork = block.type === 'work';
                const hasBreak = block.hasBreak;
                const isActive = activeItem === block.id;

                const netLaborMinutes = hasBreak ? (block.duration - block.breakDuration) : block.duration;

                let badgeColor = 'var(--color-leaf-primary)';
                let badgeBg = 'var(--color-leaf-light)';

                if (isWork) {
                  badgeColor = 'var(--color-sun-warm)';
                  badgeBg = 'var(--color-sun-light)';
                } else if (isFriction) {
                  badgeColor = 'var(--color-transit-terracotta)';
                  badgeBg = 'var(--color-transit-bg)';
                } else if (isLeak) {
                  badgeColor = 'var(--color-leak-rust)';
                  badgeBg = 'var(--color-leak-bg)';
                } else if (block.type === 'project') {
                  badgeColor = '#22c55e';
                  badgeBg = 'rgba(34, 197, 94, 0.12)';
                } else if (block.type === 'cert') {
                  badgeColor = '#f59e0b';
                  badgeBg = 'rgba(245, 158, 11, 0.15)';
                }

                return (
                  <div
                    key={block.id}
                    onClick={() => setActiveItem(block.id)}
                    className={isFriction ? "friction-node" : isLeak ? "leak-node" : "glass-card"}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      cursor: 'pointer',
                      borderLeft: isActive ? `5px solid ${badgeColor}` : undefined,
                      background: isActive ? 'var(--bg-surface-elevated)' : undefined,
                      boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          color: badgeColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: badgeBg,
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {getBlockIcon(block)}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>
                              {formatDisplayTime(block.time, timeFormat)}
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: isLeak ? 'var(--color-leak-rust)' : 'var(--text-main)' }}>
                              {block.title}
                            </span>
                            {hasBreak && (
                              <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-leaf-light)', color: 'var(--color-leaf-primary)', fontFamily: 'var(--font-mono)', fontWeight: '800' }}>
                                CARVED BREAK
                              </span>
                            )}
                          </div>
                          
                          {isWork && !hasBreak && (
                            <p style={{ fontSize: '11px', color: 'var(--color-sun-warm)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                              [COMMITTED SHIFT] Fixed labor obligation
                            </p>
                          )}
                          {isFriction && (
                            <p style={{ fontSize: '11px', color: 'var(--color-transit-terracotta)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                              [FRICTION BUFFER] Commute/transit buffer
                            </p>
                          )}
                          {isLeak && (
                            <p style={{ fontSize: '11px', color: 'var(--color-leak-rust)', marginTop: '2px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                              [VOID DRAIN] Unbudgeted attention bleed
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: '800',
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-sm)',
                          color: badgeColor,
                          background: badgeBg
                        }}>
                          {block.duration}m span
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(block);
                          }}
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-muted)',
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Edit Block"
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove block "${block.title}"?`)) {
                              onDeleteBlock(block.id);
                            }
                          }}
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-muted)',
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete Block"
                        >
                          <Trash2 size={13} />
                        </button>

                        {isLeak && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRebalanceLeak(block);
                            }}
                            style={{
                              background: 'var(--color-leak-rust)',
                              color: '#fff',
                              padding: '5px 12px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '10px',
                              fontWeight: '800',
                              letterSpacing: '0.04em'
                            }}
                          >
                            REBALANCE
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Embedded Lunch / Break Visual Cutout */}
                    {hasBreak && (
                      <div style={{
                        padding: '10px 14px',
                        background: 'var(--color-leaf-light)',
                        border: '1px dashed var(--color-leaf-border)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Utensils size={14} color="var(--color-leaf-primary)" />
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                            Embedded Break: {block.breakTitle || 'Midday Lunch'} ({formatDisplayTime(block.breakStart, timeFormat)})
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            • {block.breakDuration}m personal recovery carved out
                          </span>
                        </div>

                        <div style={{ color: 'var(--color-leaf-primary)', fontWeight: '800' }}>
                          Net Labor: {(netLaborMinutes / 60).toFixed(1)}h | Lunch: {(block.breakDuration / 60).toFixed(1)}h (No Overlap)
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEWPORT 2: WEEK VIEW (7-DAY COLUMN GRID) */}
      {viewMode === 'week' && (
        <WeekCalendarView
          schedule={schedule}
          recurringAnchors={recurringAnchors}
          timeFormat={timeFormat}
          onEditBlock={handleOpenEdit}
        />
      )}

      {/* VIEWPORT 3: MONTH VIEW (MACRO HORIZON GRID) */}
      {viewMode === 'month' && (
        <MonthCalendarView
          academics={academics}
          certifications={certifications}
        />
      )}

      {/* VIEWPORT 4: BOARD VIEW (KANBAN FLOW) */}
      {viewMode === 'board' && (
        <KanbanBoardView
          schedule={schedule}
          chillingProjects={chillingProjects}
          timeFormat={timeFormat}
          onEditBlock={handleOpenEdit}
        />
      )}

      {/* Block Creation/Edit Modal with Clock Picker */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveBlock}
        onDelete={onDeleteBlock}
        initialBlock={editingBlock}
        timeFormat={timeFormat}
      />

    </div>
  );
}

// src/views/runway/DayTimelineGrid.jsx - Google Calendar-Style Proportional Day Runway (Visual Height = Duration)

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Bus, Coffee, BookOpen, Laptop, Award, AlertOctagon, 
  Sun, Moon, Footprints, Edit3, Trash2, Utensils, Plus, Clock
} from 'lucide-react';
import { timeStringToMinutes, minutesToTimeString, formatDisplayTime } from '../../utils/timeUtils';
import { getSolarDaylightProgress } from '../../utils/solarLunarUtils';

export function DayTimelineGrid({
  schedule = [],
  timeFormat = '12h',
  onEditBlock,
  onDeleteBlock,
  onAddBlockAtTime,
  onRebalanceLeak
}) {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  const [solarData, setSolarData] = useState(() => getSolarDaylightProgress(new Date(), timeFormat));

  // Keep current time and solar alignment updated
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTimeMinutes(now.getHours() * 60 + now.getMinutes());
      setSolarData(getSolarDaylightProgress(now, timeFormat));
    };
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [timeFormat]);

  const sunriseMin = solarData.sunriseMinutes || 428;
  const sunsetMin = solarData.sunsetMinutes || 1011;

  // Compute dynamic day bounds so no block is ever clipped
  const allStartMinutes = schedule.map(b => timeStringToMinutes(b.time));
  const allEndMinutes = schedule.map(b => timeStringToMinutes(b.time) + (b.duration || 30));

  const minStart = allStartMinutes.length > 0 ? Math.min(...allStartMinutes) : 420;
  const maxEnd = allEndMinutes.length > 0 ? Math.max(...allEndMinutes) : 1380;

  const startHour = Math.max(0, Math.min(6, Math.floor(minStart / 60)));
  const endHour = Math.min(24, Math.max(23, Math.ceil(maxEnd / 60)));

  const dayStartMinutes = startHour * 60;
  const totalHours = endHour - startHour;
  const pixelsPerHour = 72; // Scale: 1 hour = 72px (1 minute = 1.2px)
  const pixelsPerMinute = pixelsPerHour / 60;
  const totalGridHeight = totalHours * pixelsPerHour;

  const hoursArray = [];
  for (let h = startHour; h <= endHour; h++) {
    hoursArray.push(h);
  }

  const getBlockIcon = (block) => {
    if (block.type === 'work') return <Briefcase size={14} />;
    if (block.type === 'friction') return <Bus size={14} />;
    if (block.type === 'leak') return <AlertOctagon size={14} />;
    if (block.type === 'project') return <Laptop size={14} />;
    if (block.type === 'cert') return <Award size={14} />;
    if (block.type === 'routine') return <Coffee size={14} />;
    return <BookOpen size={14} />;
  };

  const getCategoryTheme = (type) => {
    if (type === 'work') {
      return {
        border: 'var(--color-sun-warm)',
        bg: 'rgba(251, 146, 60, 0.12)',
        glow: 'rgba(251, 146, 60, 0.25)',
        text: 'var(--color-sun-warm)'
      };
    }
    if (type === 'friction') {
      return {
        border: 'var(--color-transit-terracotta)',
        bg: 'var(--color-transit-bg)',
        glow: 'rgba(202, 138, 4, 0.25)',
        text: 'var(--color-transit-terracotta)'
      };
    }
    if (type === 'leak') {
      return {
        border: 'var(--color-leak-rust)',
        bg: 'var(--color-leak-bg)',
        glow: 'rgba(220, 38, 38, 0.3)',
        text: 'var(--color-leak-rust)'
      };
    }
    if (type === 'project') {
      return {
        border: '#22c55e',
        bg: 'rgba(34, 197, 94, 0.12)',
        glow: 'rgba(34, 197, 94, 0.25)',
        text: '#22c55e'
      };
    }
    if (type === 'cert') {
      return {
        border: 'var(--color-sun-amber)',
        bg: 'var(--color-sun-light)',
        glow: 'rgba(245, 158, 11, 0.25)',
        text: 'var(--color-sun-amber)'
      };
    }
    if (type === 'study') {
      return {
        border: 'var(--color-leaf-primary)',
        bg: 'var(--color-leaf-light)',
        glow: 'rgba(46, 230, 168, 0.25)',
        text: 'var(--color-leaf-primary)'
      };
    }
    return {
      border: 'var(--border-strong)',
      bg: 'var(--bg-surface-elevated)',
      glow: 'rgba(255, 255, 255, 0.08)',
      text: 'var(--text-main)'
    };
  };

  // Compute non-overlapping layout columns for simultaneous blocks
  const processedBlocks = schedule.map(block => {
    const startMin = timeStringToMinutes(block.time);
    const duration = block.duration || 30;
    const endMin = startMin + duration;
    return {
      ...block,
      startMin,
      endMin,
      top: (startMin - dayStartMinutes) * pixelsPerMinute,
      height: Math.max(28, duration * pixelsPerMinute) // Minimum 28px height so tiny spans stay clickable
    };
  });

  // Calculate overlaps
  processedBlocks.forEach((block, i) => {
    const overlapping = processedBlocks.filter((other, j) => {
      if (i === j) return false;
      return !(block.endMin <= other.startMin || block.startMin >= other.endMin);
    });

    if (overlapping.length > 0) {
      const group = [block, ...overlapping].sort((a, b) => a.startMin - b.startMin || b.duration - a.duration);
      const colIdx = group.findIndex(b => b.id === block.id);
      block.colIndex = colIdx;
      block.totalCols = group.length;
    } else {
      block.colIndex = 0;
      block.totalCols = 1;
    }
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', width: '100%', overflowX: 'auto' }}>
      
      {/* Visual Subtitle Reminder */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="var(--color-leaf-primary)" />
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
            PROPORTIONAL DAY RUNWAY (TRUE TEMPORAL SCALE)
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          1 Hour = 72px • Click any empty calendar space to log a span
        </span>
      </div>

      <div style={{ minWidth: '700px', position: 'relative' }}>
        
        {/* Main Grid Container: Left Time Axis + Right Canvas */}
        <div style={{ display: 'flex', position: 'relative', height: `${totalGridHeight}px` }}>
          
          {/* 1. Left Time Ruler Axis */}
          <div style={{
            width: '74px',
            minWidth: '74px',
            position: 'relative',
            borderRight: '1px solid var(--border-light)',
            userSelect: 'none'
          }}>
            {hoursArray.map((hour) => {
              const hourTop = (hour - startHour) * pixelsPerHour;
              const timeString = `${String(hour === 24 ? 0 : hour).padStart(2, '0')}:00`;

              return (
                <div
                  key={hour}
                  style={{
                    position: 'absolute',
                    top: `${hourTop}px`,
                    right: '12px',
                    transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--text-muted)'
                  }}
                >
                  {formatDisplayTime(timeString, timeFormat)}
                </div>
              );
            })}
          </div>

          {/* 2. Right Canvas: Horizontal Grid Lines & Calendar Space */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              background: 'var(--bg-surface)'
            }}
            onMouseLeave={() => setHoveredSlot(null)}
          >
            {/* Hour & Half-Hour Grid Rows (Empty Calendar Space) */}
            {hoursArray.map((hour) => {
              if (hour === endHour) return null;
              const hourTop = (hour - startHour) * pixelsPerHour;
              const timeStr = `${String(hour).padStart(2, '0')}:00`;
              const halfTimeStr = `${String(hour).padStart(2, '0')}:30`;

              return (
                <React.Fragment key={hour}>
                  {/* Top Hour Line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: `${hourTop}px`,
                      left: 0,
                      right: 0,
                      height: `${pixelsPerHour / 2}px`,
                      borderTop: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease'
                    }}
                    onMouseEnter={() => setHoveredSlot(timeStr)}
                    onClick={() => onAddBlockAtTime(timeStr)}
                  >
                    {hoveredSlot === timeStr && (
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: '12px',
                        background: 'var(--color-leaf-light)',
                        border: '1px dashed var(--color-leaf-primary)',
                        color: 'var(--color-leaf-primary)',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 10
                      }}>
                        <Plus size={12} strokeWidth={2.5} />
                        <span>Log Block at {formatDisplayTime(timeStr, timeFormat)}</span>
                      </div>
                    )}
                  </div>

                  {/* 30-Minute Midpoint Line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: `${hourTop + (pixelsPerHour / 2)}px`,
                      left: 0,
                      right: 0,
                      height: `${pixelsPerHour / 2}px`,
                      borderTop: '1px dashed rgba(46, 230, 168, 0.08)',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease'
                    }}
                    onMouseEnter={() => setHoveredSlot(halfTimeStr)}
                    onClick={() => onAddBlockAtTime(halfTimeStr)}
                  >
                    {hoveredSlot === halfTimeStr && (
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: '12px',
                        background: 'var(--color-leaf-light)',
                        border: '1px dashed var(--color-leaf-primary)',
                        color: 'var(--color-leaf-primary)',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 10
                      }}>
                        <Plus size={12} strokeWidth={2.5} />
                        <span>Log Block at {formatDisplayTime(halfTimeStr, timeFormat)}</span>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* 3. Astronomical Daylight / Night Celestial Shading */}
            {/* Pre-Dawn Twilight / Night Shade */}
            {sunriseMin > dayStartMinutes && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: `${Math.max(0, (sunriseMin - dayStartMinutes) * pixelsPerMinute)}px`,
                  background: 'rgba(0, 0, 0, 0.42)',
                  pointerEvents: 'none',
                  zIndex: 5
                }}
              />
            )}

            {/* Sunrise Horizon Marker Line */}
            {sunriseMin >= dayStartMinutes && sunriseMin <= (endHour * 60) && (
              <div
                style={{
                  position: 'absolute',
                  top: `${(sunriseMin - dayStartMinutes) * pixelsPerMinute}px`,
                  left: 0,
                  right: 0,
                  borderTop: '1px dashed var(--color-sun-amber)',
                  zIndex: 15,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '14px'
                }}
              >
                <span style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  color: 'var(--color-sun-warm)',
                  background: 'rgba(0, 0, 0, 0.92)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  border: '1px solid var(--color-sun-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transform: 'translateY(-50%)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                }}>
                  <Sun size={10} color="var(--color-sun-amber)" strokeWidth={2.5} />
                  SUNRISE {solarData.sunriseTime} ({solarData.daylightHours}h light)
                </span>
              </div>
            )}

            {/* Sunset / Dusk Horizon Marker Line & Post-Dusk Night Shade */}
            {sunsetMin <= (endHour * 60) && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: `${(sunsetMin - dayStartMinutes) * pixelsPerMinute}px`,
                    left: 0,
                    right: 0,
                    borderTop: '1px dashed var(--color-leaf-primary)',
                    zIndex: 15,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '14px'
                  }}
                >
                  <span style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '800',
                    color: 'var(--color-leaf-primary)',
                    background: 'rgba(0, 0, 0, 0.92)',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    border: '1px solid var(--color-leaf-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transform: 'translateY(-50%)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                  }}>
                    <Moon size={10} color="var(--color-leaf-primary)" strokeWidth={2.5} />
                    DUSK {solarData.sunsetTime} (Nightfall)
                  </span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    top: `${(sunsetMin - dayStartMinutes) * pixelsPerMinute}px`,
                    left: 0,
                    right: 0,
                    height: `${Math.max(0, ((endHour * 60) - sunsetMin) * pixelsPerMinute)}px`,
                    background: 'rgba(0, 0, 0, 0.42)',
                    pointerEvents: 'none',
                    zIndex: 5
                  }}
                />
              </>
            )}

            {/* 4. Real-Time "Now" Indicator Line (Clean solid line, strictly no pulsating dot) */}
            {currentTimeMinutes >= dayStartMinutes && currentTimeMinutes <= (endHour * 60) && (
              <div
                style={{
                  position: 'absolute',
                  top: `${(currentTimeMinutes - dayStartMinutes) * pixelsPerMinute}px`,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--color-leaf-primary)',
                  boxShadow: '0 0 4px var(--color-leaf-primary)',
                  zIndex: 40,
                  pointerEvents: 'none'
                }}
              >
                <span style={{
                  position: 'absolute',
                  left: '6px',
                  top: '-9px',
                  fontSize: '9px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--color-leaf-primary)',
                  color: '#000',
                  padding: '1px 5px',
                  borderRadius: '2px'
                }}>
                  NOW
                </span>
              </div>
            )}

            {/* 4. Proportional Blocks Overlay */}
            {processedBlocks.map((block) => {
              const theme = getCategoryTheme(block.type);
              const isWork = block.type === 'work';
              const hasBreak = block.hasBreak && isWork;
              const isCompact = block.height < 50;

              // Column width calculation for simultaneous blocks
              const colWidth = 100 / (block.totalCols || 1);
              const colLeft = (block.colIndex || 0) * colWidth;

              // Embedded Break Geometry (Inside Work Block)
              let breakTop = 0;
              let breakHeight = 0;
              if (hasBreak && block.breakStart) {
                const bStartMin = timeStringToMinutes(block.breakStart);
                breakTop = (bStartMin - block.startMin) * pixelsPerMinute;
                breakHeight = (block.breakDuration || 60) * pixelsPerMinute;
              }

              return (
                <div
                  key={block.id}
                  onClick={() => onEditBlock(block)}
                  style={{
                    position: 'absolute',
                    top: `${block.top}px`,
                    height: `${block.height}px`,
                    left: `calc(${colLeft}% + 6px)`,
                    width: `calc(${colWidth}% - 12px)`,
                    background: theme.bg,
                    border: `1px solid ${theme.border}`,
                    borderLeft: `5px solid ${theme.border}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: isCompact ? '4px 10px' : '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: `0 4px 14px rgba(0, 0, 0, 0.4), 0 0 12px ${theme.glow}`,
                    zIndex: 20,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  title={`Click to edit: ${block.title} (${block.duration}m)`}
                >
                  {/* Block Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <span style={{ color: theme.border, display: 'flex', alignItems: 'center' }}>
                        {getBlockIcon(block)}
                      </span>
                      <span style={{
                        fontSize: isCompact ? '12px' : '13px',
                        fontWeight: '800',
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {block.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '800',
                        color: theme.border,
                        background: 'rgba(0,0,0,0.4)',
                        padding: '1px 6px',
                        borderRadius: '3px'
                      }}>
                        {block.duration >= 60 ? `${(block.duration / 60).toFixed(1)}h` : `${block.duration}m`}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditBlock(block);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        title="Edit Block"
                      >
                        <Edit3 size={11} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove block "${block.title}"?`)) {
                            onDeleteBlock(block.id);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        title="Delete Block"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Time Range Subtitle (Shown if block is not super short) */}
                  {!isCompact && (
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      marginTop: '2px'
                    }}>
                      {formatDisplayTime(block.time, timeFormat)} - {formatDisplayTime(minutesToTimeString(block.endMin), timeFormat)}
                      {block.category && <span style={{ marginLeft: '8px', color: theme.border }}>• {block.category}</span>}
                    </div>
                  )}

                  {/* Embedded Work Lunch Cutout (Visually carved inside the 9-hour work block) */}
                  {hasBreak && breakHeight > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${breakTop}px`,
                        left: '8px',
                        right: '8px',
                        height: `${breakHeight}px`,
                        background: 'rgba(0, 0, 0, 0.65)',
                        border: '1px dashed var(--color-leaf-primary)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                        zIndex: 25
                      }}
                      title={`${block.breakTitle || 'Midday Lunch'} (${block.breakDuration}m)`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Utensils size={13} color="var(--color-leaf-primary)" />
                        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-leaf-primary)' }}>
                          {block.breakTitle || 'Protected Lunch Hour'}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          ({formatDisplayTime(block.breakStart, timeFormat)})
                        </span>
                      </div>

                      <span style={{
                        fontSize: '9px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '800',
                        color: '#000',
                        background: 'var(--color-leaf-primary)',
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}>
                        {block.breakDuration}M DEDUCTION
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}

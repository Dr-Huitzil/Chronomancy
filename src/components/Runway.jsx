// src/components/Runway.jsx - 24-Hour Vertical Runway & Friction Nodes (No Emojis)

import React, { useState } from 'react';
import { Clock, Plus, Bus, BookOpen, Footprints, Laptop, Award, AlertOctagon, Sun, Coffee } from 'lucide-react';

export function Runway({ schedule, onAddBlock, onRebalanceLeak }) {
  const [activeItem, setActiveItem] = useState("s-6");

  const getBlockIcon = (block) => {
    if (block.type === 'friction') {
      return block.title.toLowerCase().includes('commute') ? <Bus size={16} /> : <Footprints size={16} />;
    }
    if (block.type === 'leak') {
      return <AlertOctagon size={16} />;
    }
    if (block.type === 'project') {
      return <Laptop size={16} />;
    }
    if (block.type === 'cert') {
      return <Award size={16} />;
    }
    if (block.title.toLowerCase().includes('sunlight') || block.title.toLowerCase().includes('morning')) {
      return <Sun size={16} />;
    }
    if (block.title.toLowerCase().includes('meal') || block.title.toLowerCase().includes('lunch')) {
      return <Coffee size={16} />;
    }
    return <BookOpen size={16} />;
  };

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: '1.2' }}>
      
      {/* Runway Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }}>
            <Clock size={16} color="var(--color-leaf-primary)" />
            THE RUNWAY (TACTICAL TIMELINE)
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Zero-based day execution with commute & friction buffers
          </p>
        </div>
        <button 
          onClick={onAddBlock}
          style={{
            background: 'var(--color-leaf-primary)',
            color: '#000',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Plus size={14} />
          Add Time Block
        </button>
      </div>

      {/* Vertical Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)', paddingRight: '4px' }}>
        {schedule.map((block) => {
          const isFriction = block.type === 'friction';
          const isLeak = block.type === 'leak';
          const isActive = activeItem === block.id;

          let badgeColor = 'var(--color-leaf-primary)';
          let badgeBg = 'var(--color-leaf-light)';

          if (isFriction) {
            badgeColor = 'var(--color-transit-terracotta)';
            badgeBg = 'var(--color-transit-bg)';
          } else if (isLeak) {
            badgeColor = 'var(--color-leak-rust)';
            badgeBg = 'var(--color-leak-bg)';
          } else if (block.type === 'project') {
            badgeColor = 'var(--color-sun-warm)';
            badgeBg = 'var(--color-sun-light)';
          } else if (block.type === 'cert') {
            badgeColor = '#d4a373';
            badgeBg = 'rgba(212, 163, 115, 0.15)';
          }

          return (
            <div
              key={block.id}
              onClick={() => setActiveItem(block.id)}
              className={isFriction ? "friction-node" : isLeak ? "leak-node" : "glass-card"}
              style={{
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderLeft: isActive ? `4px solid ${badgeColor}` : undefined,
                background: isActive ? 'var(--bg-surface-elevated)' : undefined
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  color: badgeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: badgeBg,
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {getBlockIcon(block)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                      {block.time}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: isLeak ? 'var(--color-leak-rust)' : 'var(--text-main)' }}>
                      {block.title}
                    </span>
                  </div>
                  
                  {isFriction && (
                    <p style={{ fontSize: '10px', color: 'var(--color-transit-terracotta)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      [FRICTION BUFFER] Non-negotiable transit buffer
                    </p>
                  )}
                  {isLeak && (
                    <p style={{ fontSize: '10px', color: 'var(--color-leak-rust)', marginTop: '2px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                      [OVERDRAFT DEBT] Unbudgeted attention leak
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  color: badgeColor,
                  background: badgeBg
                }}>
                  {block.duration}m
                </span>

                {isLeak && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRebalanceLeak(block);
                    }}
                    style={{
                      background: 'var(--color-leak-rust)',
                      color: '#fff',
                      padding: '4px 10px',
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
          );
        })}
      </div>
    </div>
  );
}

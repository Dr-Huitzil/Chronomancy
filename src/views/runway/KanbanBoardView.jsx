// src/views/runway/KanbanBoardView.jsx - Project Management Kanban Board View (No Emojis)

import React from 'react';
import { Columns3, Plus, ArrowRight, CheckCircle2, Clock, Play, Briefcase, BookOpen, Laptop, Award } from 'lucide-react';
import { formatDisplayTime } from '../../utils/timeUtils';

export function KanbanBoardView({ schedule, chillingProjects, timeFormat = '12h', onEditBlock }) {
  const plannedBlocks = schedule.filter(b => b.status === 'planned');
  const activeBlocks = schedule.filter(b => b.status === 'active');
  const completedBlocks = schedule.filter(b => b.status === 'completed');

  const getIcon = (type) => {
    if (type === 'work') return <Briefcase size={13} />;
    if (type === 'project') return <Laptop size={13} />;
    if (type === 'cert') return <Award size={13} />;
    return <BookOpen size={13} />;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px', alignItems: 'start' }}>
      
      {/* 1. BACKLOG & INCUBATOR */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            1. INCUBATOR & BACKLOG ({chillingProjects.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chillingProjects.map(proj => (
            <div key={proj.id} className="glass-card" style={{ padding: '12px', fontSize: '11px' }}>
              <div style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {proj.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {proj.nextAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SCHEDULED TODAY */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-sun-warm)', fontFamily: 'var(--font-mono)' }}>
            2. SCHEDULED TODAY ({plannedBlocks.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {plannedBlocks.map(block => (
            <div
              key={block.id}
              onClick={() => onEditBlock(block)}
              className="glass-card"
              style={{ padding: '12px', cursor: 'pointer', borderLeft: '3px solid var(--color-sun-warm)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: '800', fontSize: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getIcon(block.type)}
                  {block.title}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>{formatDisplayTime(block.time, timeFormat)}</span>
                <span>{block.duration}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ACTIVE FOCUS FLOW */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '440px', border: '1px solid var(--color-leaf-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-leaf-primary)', fontFamily: 'var(--font-mono)' }}>
            3. ACTIVE IN FLOW ({activeBlocks.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeBlocks.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '20px' }}>
              No active session currently running
            </div>
          ) : (
            activeBlocks.map(block => (
              <div
                key={block.id}
                onClick={() => onEditBlock(block)}
                className="glass-card"
                style={{ padding: '14px', cursor: 'pointer', borderLeft: '4px solid var(--color-leaf-primary)', background: 'var(--color-leaf-light)' }}
              >
                <div style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {block.title}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-leaf-primary)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                  In Progress • {block.duration}m total
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. COMPLETED */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            4. COMPLETED ({completedBlocks.length})
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {completedBlocks.map(block => (
            <div
              key={block.id}
              className="glass-card"
              style={{ padding: '10px 12px', opacity: 0.8, borderLeft: '2px solid var(--border-strong)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: '700' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{block.title}</span>
                <CheckCircle2 size={13} color="var(--color-leaf-primary)" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

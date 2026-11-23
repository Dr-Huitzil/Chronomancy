// src/components/TheGrove.jsx - Gamified Garden & Gamer Grind Engine (No Emojis)

import React from 'react';
import { Trees, TreePine, TreeDeciduous, Sprout, AlertOctagon, Flame, BookMarked, Code2, ScrollText, ShieldAlert } from 'lucide-react';

export function TheGrove({ grove }) {
  const { trees, grindStats } = grove;

  const renderFloraIcon = (tree) => {
    if (tree.status === 'withered') {
      return <AlertOctagon size={24} color="var(--color-leak-rust)" />;
    }
    if (tree.iconType === 'tree-pine') {
      return <TreePine size={24} color="var(--color-leaf-primary)" />;
    }
    if (tree.iconType === 'sprout') {
      return <Sprout size={24} color="var(--color-sun-amber)" />;
    }
    return <TreeDeciduous size={24} color="var(--color-leaf-primary)" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: '1' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trees size={16} color="var(--color-leaf-primary)" />
            THE GROVE (FOCUS ARBORETUM)
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Grind stats, biospheric growth & anti-doomscroll deterrence
          </p>
        </div>
        <div style={{
          background: 'var(--color-leaf-light)',
          border: '1px solid var(--color-leaf-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--color-leaf-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Flame size={12} color="var(--color-sun-amber)" />
          <span>{grindStats.streakDays}-Day Clean Run</span>
        </div>
      </div>

      {/* Today's Garden Grid */}
      <div style={{
        background: 'var(--color-leaf-light)',
        border: '1px dashed var(--color-leaf-border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '10px'
      }}>
        {trees.map((tree) => {
          const isWithered = tree.status === 'withered';
          const isGrowing = tree.status === 'growing';

          return (
            <div
              key={tree.id}
              className="glass-card"
              style={{
                padding: '12px 10px',
                textAlign: 'center',
                border: isWithered ? '1px solid var(--color-leak-border)' : isGrowing ? '1px solid var(--color-sun-amber)' : '1px solid var(--border-light)',
                background: isWithered ? 'var(--color-leak-bg)' : 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                {renderFloraIcon(tree)}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: isWithered ? 'var(--color-leak-rust)' : 'var(--text-main)' }}>
                {tree.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {tree.category} ({tree.minutes}m)
              </div>
              <div style={{
                fontSize: '10px',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                color: isWithered ? 'var(--color-leak-rust)' : 'var(--color-leaf-primary)',
                marginTop: '4px'
              }}>
                {tree.xp > 0 ? `+${tree.xp} XP` : `${tree.xp} XP`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Growth Capsule */}
      <div className="glass-card" style={{ padding: '14px', border: '1px solid var(--color-sun-amber)', background: 'var(--color-sun-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-sun-warm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sprout size={14} color="var(--color-sun-warm)" />
            ACTIVE SESSION: Redwood Sapling (CS Study)
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-sun-warm)' }}>
            32 / 50m to Full Bloom
          </span>
        </div>
        <div className="solar-battery-bar">
          <div className="solar-battery-fill" style={{ width: '64%', background: 'linear-gradient(90deg, var(--color-sun-amber), var(--color-leaf-primary))' }} />
        </div>
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldAlert size={12} color="var(--color-leak-rust)" />
          Abandoning session for unbudgeted doomscrolling withers this specimen into a dead stump.
        </p>
      </div>

      {/* Gamer RPG Grind Attributes */}
      <div>
        <h3 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
          GRIND PROGRESSION ATTRIBUTES
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* INT */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
              <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BookMarked size={12} color="var(--color-leaf-primary)" /> INT (Classes & Syllabi)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Lvl {grindStats.int.level} ({grindStats.int.currentXp}/{grindStats.int.nextLevelXp} XP)
              </span>
            </div>
            <div className="solar-battery-bar" style={{ height: '6px' }}>
              <div className="solar-battery-fill" style={{ width: `${(grindStats.int.currentXp / grindStats.int.nextLevelXp) * 100}%` }} />
            </div>
          </div>

          {/* DEX */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
              <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Code2 size={12} color="var(--color-sun-amber)" /> DEX (Coding & Projects)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Lvl {grindStats.dex.level} ({grindStats.dex.currentXp}/{grindStats.dex.nextLevelXp} XP)
              </span>
            </div>
            <div className="solar-battery-bar" style={{ height: '6px' }}>
              <div className="solar-battery-fill" style={{ width: `${(grindStats.dex.currentXp / grindStats.dex.nextLevelXp) * 100}%` }} />
            </div>
          </div>

          {/* WIS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
              <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ScrollText size={12} color="var(--color-transit-terracotta)" /> WIS (Certifications & Deep Work)
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Lvl {grindStats.wis.level} ({grindStats.wis.currentXp}/{grindStats.wis.nextLevelXp} XP)
              </span>
            </div>
            <div className="solar-battery-bar" style={{ height: '6px' }}>
              <div className="solar-battery-fill" style={{ width: `${(grindStats.wis.currentXp / grindStats.wis.nextLevelXp) * 100}%` }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

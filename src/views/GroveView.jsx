// src/views/GroveView.jsx - Dedicated Focus Arboretum & Gamer Grind Engine View

import React from 'react';
import { Trees, TreePine, TreeDeciduous, Sprout, AlertOctagon, Flame, BookMarked, Code2, ScrollText, ShieldAlert, Award, Play, Pause } from 'lucide-react';

export function GroveView({ grove, onStartFocusSession }) {
  const { trees, grindStats } = grove;

  const renderFloraIcon = (tree) => {
    if (tree.status === 'withered') {
      return <AlertOctagon size={32} color="var(--color-leak-rust)" />;
    }
    if (tree.iconType === 'tree-pine') {
      return <TreePine size={32} color="var(--color-leaf-primary)" />;
    }
    if (tree.iconType === 'sprout') {
      return <Sprout size={32} color="var(--color-sun-amber)" />;
    }
    return <TreeDeciduous size={32} color="var(--color-leaf-primary)" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* View Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trees size={22} color="var(--color-leaf-primary)" />
            THE GROVE
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Gamified focus garden, biospheric growth metrics, and RPG grind progression
          </p>
        </div>

        <div style={{
          background: 'var(--color-leaf-light)',
          border: '1px solid var(--color-leaf-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: '800',
          color: 'var(--color-leaf-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Flame size={15} color="var(--color-sun-amber)" />
          <span>{grindStats.streakDays}-DAY CLEAN RUN STREAK</span>
        </div>
      </div>

      {/* Active Focus Session Banner */}
      <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--color-sun-amber)', background: 'var(--color-sun-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-sun-warm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={18} color="var(--color-sun-warm)" />
              ACTIVE SPECIMEN: Redwood Sapling (CS Study Block)
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Target: 50 minutes of uninterrupted focus to reach mature bloom
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--color-sun-warm)' }}>
              32:10 / 50:00
            </span>
            <button
              style={{
                background: 'var(--color-sun-warm)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Pause size={13} />
              Pause Session
            </button>
          </div>
        </div>

        <div className="solar-battery-bar" style={{ height: '10px' }}>
          <div className="solar-battery-fill" style={{ width: '64%', background: 'linear-gradient(90deg, var(--color-sun-amber), var(--color-leaf-primary))' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} color="var(--color-leak-rust)" />
            Anti-Doomscroll Law: Abandoning this active session withers this plant into a permanent dead stump.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-leaf-primary)' }}>
            +220 XP on completion
          </span>
        </div>
      </div>

      {/* Two Column Grid: Today's Garden Plot & RPG Grind Attributes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Today's Flora Plot */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
              TODAY'S BIOSPHERE PLOT
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {trees.filter(t => t.status !== 'withered').length} Healthy • {trees.filter(t => t.status === 'withered').length} Withered
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px'
          }}>
            {trees.map((tree) => {
              const isWithered = tree.status === 'withered';
              const isGrowing = tree.status === 'growing';

              return (
                <div
                  key={tree.id}
                  className="glass-card"
                  style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    border: isWithered ? '1px solid var(--color-leak-border)' : isGrowing ? '1px solid var(--color-sun-amber)' : '1px solid var(--border-light)',
                    background: isWithered ? 'var(--color-leak-bg)' : 'var(--bg-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    {renderFloraIcon(tree)}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: isWithered ? 'var(--color-leak-rust)' : 'var(--text-main)' }}>
                    {tree.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {tree.category}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {tree.minutes} min logged
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                    color: isWithered ? 'var(--color-leak-rust)' : 'var(--color-leaf-primary)',
                    marginTop: '6px'
                  }}>
                    {tree.xp > 0 ? `+${tree.xp} XP` : `${tree.xp} XP`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RPG Grind Attributes Sheet */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            RPG GRIND ATTRIBUTES
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* INT */}
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookMarked size={16} color="var(--color-leaf-primary)" />
                  INT (Classes & Syllabi)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--color-leaf-primary)' }}>
                  Level {grindStats.int.level}
                </span>
              </div>
              <div className="solar-battery-bar" style={{ height: '7px' }}>
                <div className="solar-battery-fill" style={{ width: `${(grindStats.int.currentXp / grindStats.int.nextLevelXp) * 100}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                <span>{grindStats.int.currentXp} XP</span>
                <span>{grindStats.int.nextLevelXp} XP to Level {grindStats.int.level + 1}</span>
              </div>
            </div>

            {/* DEX */}
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code2 size={16} color="var(--color-sun-amber)" />
                  DEX (Coding & Engineering)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--color-sun-amber)' }}>
                  Level {grindStats.dex.level}
                </span>
              </div>
              <div className="solar-battery-bar" style={{ height: '7px' }}>
                <div className="solar-battery-fill" style={{ width: `${(grindStats.dex.currentXp / grindStats.dex.nextLevelXp) * 100}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                <span>{grindStats.dex.currentXp} XP</span>
                <span>{grindStats.dex.nextLevelXp} XP to Level {grindStats.dex.level + 1}</span>
              </div>
            </div>

            {/* WIS */}
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ScrollText size={16} color="var(--color-transit-terracotta)" />
                  WIS (Certifications & Deep Craft)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--color-transit-terracotta)' }}>
                  Level {grindStats.wis.level}
                </span>
              </div>
              <div className="solar-battery-bar" style={{ height: '7px' }}>
                <div className="solar-battery-fill" style={{ width: `${(grindStats.wis.currentXp / grindStats.wis.nextLevelXp) * 100}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                <span>{grindStats.wis.currentXp} XP</span>
                <span>{grindStats.wis.nextLevelXp} XP to Level {grindStats.wis.level + 1}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

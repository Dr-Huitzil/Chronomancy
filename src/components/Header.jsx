// src/components/Header.jsx - Solarpunk Circadian HUD & Time Battery with Astronomical Arc & Lunar Phase

import React from 'react';
import { Sun, Moon, AlertTriangle, CheckCircle2, BatteryCharging } from 'lucide-react';
import { CircadianArc } from './CircadianArc';

export function Header({ data, theme, onToggleTheme }) {
  const { runwaySchedule, user } = data;
  
  // Calculate minute totals
  const totalAllocatedMinutes = runwaySchedule.reduce((acc, curr) => acc + curr.duration, 0) + user.sleepMinutesBudget;
  const remainingMinutes = Math.max(0, user.dailyCapacityMinutes - totalAllocatedMinutes);
  const totalLeakMinutes = runwaySchedule
    .filter(item => item.type === 'leak')
    .reduce((acc, curr) => acc + curr.duration, 0);

  const batteryPercent = Math.min(100, Math.round((totalAllocatedMinutes / user.dailyCapacityMinutes) * 100));

  return (
    <header className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand & Technical Glyph */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-leaf-primary), var(--color-sun-amber))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: 'var(--shadow-glow-leaf)'
          }}>
            <Sun size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              CHRONOMANCY
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              OCCULT HOROLOGY & TEMPORAL OS
            </p>
          </div>
        </div>

        {/* Astronomical Circadian Arc, Overdraft Status & OLED Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Circadian Arc with Real Timezone, DST, Solar/Lunar Cycles */}
          <CircadianArc />

          {/* Overdraft / Clean Run Pill */}
          {totalLeakMinutes > 0 ? (
            <div style={{
              background: 'var(--color-leak-bg)',
              border: '1px solid var(--color-leak-border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--color-leak-rust)'
            }}>
              <AlertTriangle size={13} strokeWidth={2.5} />
              <span>Overdraft: {totalLeakMinutes}m Debt</span>
            </div>
          ) : (
            <div style={{
              background: 'var(--color-leaf-light)',
              border: '1px solid var(--color-leaf-border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-leaf-primary)'
            }}>
              <CheckCircle2 size={13} strokeWidth={2.5} />
              <span>Clean Run (0m Overdraft)</span>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '700',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)'
            }}
            title="Toggle OLED Dark / Light"
          >
            {theme === 'dark' ? (
              <>
                <Moon size={13} color="var(--color-leaf-primary)" />
                <span>OLED VOID</span>
              </>
            ) : (
              <>
                <Sun size={13} color="var(--color-sun-amber)" />
                <span>PARCHMENT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1,440-Minute Solar Energy Battery Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BatteryCharging size={13} color="var(--color-leaf-primary)" />
            MORTAL CAPACITY ALLOCATION (1,440 MIN ZERO-SUM BUDGET)
          </span>
          <span style={{ fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {totalAllocatedMinutes}m / 1,440m ({batteryPercent}%) | {remainingMinutes}m unallocated
          </span>
        </div>
        <div className="solar-battery-bar">
          <div className="solar-battery-fill" style={{ width: `${batteryPercent}%` }} />
        </div>
      </div>
    </header>
  );
}

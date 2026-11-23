// src/views/SettingsView.jsx - Dedicated Settings, Time Format (12h/24h) & Local-First Preferences

import React from 'react';
import { Settings, Moon, Sun, Database, Shield, Download, Upload, User, Clock, Compass } from 'lucide-react';

export function SettingsView({
  user,
  theme,
  onToggleTheme,
  timeFormat = '12h',
  onToggleTimeFormat,
  onExportData,
  onResetData
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      {/* View Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={22} color="var(--color-leaf-primary)" />
            CHRONOMANTIC SETTINGS
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Local-first storage controls, horological time format (12h/24h), and OLED void display configurations
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* 1. Display & Horology Preferences */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            HOROLOGICAL DISPLAY CONFIGURATION
          </h3>

          {/* OLED Void Mode Toggle */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                Theme Atmosphere
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {theme === 'dark' ? 'OLED True Black (pixels off, zero emission void)' : 'Alchemical Parchment (clean day mode)'}
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-main)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {theme === 'dark' ? <Moon size={14} color="var(--color-leaf-primary)" /> : <Sun size={14} color="var(--color-sun-amber)" />}
              <span>{theme === 'dark' ? 'OLED VOID' : 'PARCHMENT'}</span>
            </button>
          </div>

          {/* 12-Hour vs 24-Hour Time Format Toggle */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--color-leaf-primary)" />
                Time Notation Format
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Select whether schedules and clocks render in 12-Hour (AM/PM) or 24-Hour format
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--color-leaf-light)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => onToggleTimeFormat('12h')}
                style={{
                  background: timeFormat === '12h' ? 'var(--color-leaf-primary)' : 'transparent',
                  color: timeFormat === '12h' ? '#000' : 'var(--text-main)',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                12-HOUR (AM/PM)
              </button>

              <button
                onClick={() => onToggleTimeFormat('24h')}
                style={{
                  background: timeFormat === '24h' ? 'var(--color-leaf-primary)' : 'transparent',
                  color: timeFormat === '24h' ? '#000' : 'var(--text-main)',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                24-HOUR
              </button>
            </div>
          </div>
        </div>

        {/* 2. Temporal Capacity Allocation */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            MORTAL CAPACITY ENDOWMENT
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DAILY CAPACITY</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-sun-warm)', marginTop: '4px' }}>
                1,440 Minutes
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Mathematical invariant (24h)
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SLEEP BUDGET</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-leaf-primary)', marginTop: '4px' }}>
                {user.sleepMinutesBudget} Minutes
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {user.sleepMinutesBudget / 60} hours non-negotiable rest
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>WAKING MARGIN</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-transit-terracotta)', marginTop: '4px' }}>
                {user.wakingMinutesTarget} Minutes
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Available daily runway
              </div>
            </div>
          </div>
        </div>

        {/* 3. Local-First Data Sovereignty */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            LOCAL-FIRST DATA MANAGEMENT
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Chronomancy stores all schedule events, syllabi, cert metrics, and grove flora locally on your machine. No telemetry or cloud tracking.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={onExportData}
              style={{
                background: 'var(--color-leaf-light)',
                border: '1px solid var(--color-leaf-border)',
                color: 'var(--color-leaf-primary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} />
              Export Local Backup (JSON)
            </button>

            <button
              onClick={onResetData}
              style={{
                background: 'var(--color-leak-bg)',
                border: '1px solid var(--color-leak-border)',
                color: 'var(--color-leak-rust)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: '800'
              }}
            >
              Reset Seed Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// src/components/Navigation.jsx - Sidebar (Desktop) and Bottom Dock (Mobile)

import React, { useState, useEffect } from 'react';
import { Clock, Trees, Compass, Scale, Settings, Sun, Moon, Globe, AlertTriangle, CheckCircle2, BatteryCharging, Plus, PlusCircle } from 'lucide-react';
import { getSolarDaylightProgress, calculateMoonPhase, getTimezoneInfo } from '../utils/solarLunarUtils';

export function Navigation({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  data,
  isMobile,
  timeFormat = '12h',
  onQuickAdd
}) {
  const { runwaySchedule, user } = data;

  const [solarData, setSolarData] = useState(() => getSolarDaylightProgress(new Date(), timeFormat));
  const [lunarData, setLunarData] = useState(() => calculateMoonPhase());
  const [tzInfo, setTzInfo] = useState(() => getTimezoneInfo());

  useEffect(() => {
    const update = () => {
      setSolarData(getSolarDaylightProgress(new Date(), timeFormat));
      setLunarData(calculateMoonPhase());
      setTzInfo(getTimezoneInfo());
    };
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [timeFormat]);

  const totalAllocatedMinutes = runwaySchedule.reduce((acc, curr) => acc + curr.duration, 0) + user.sleepMinutesBudget;
  const remainingMinutes = Math.max(0, user.dailyCapacityMinutes - totalAllocatedMinutes);
  const totalLeakMinutes = runwaySchedule
    .filter(item => item.type === 'leak')
    .reduce((acc, curr) => acc + curr.duration, 0);

  const batteryPercent = Math.min(100, Math.round((totalAllocatedMinutes / user.dailyCapacityMinutes) * 100));

  const navItems = [
    { id: 'runway', label: 'The Runway', Icon: Clock, desc: '24h Tactical Schedule' },
    { id: 'construct', label: 'Construct', Icon: PlusCircle, desc: 'Minute-Level Time Logger' },
    { id: 'grove', label: 'The Grove', Icon: Trees, desc: 'Focus Garden & Grind Stats' },
    { id: 'horizons', label: 'Horizons', Icon: Compass, desc: 'Academic Syllabi & Certs' },
    { id: 'audit', label: 'Chrono-Audit', Icon: Scale, desc: 'Zero-Based Minute Ledger' },
    { id: 'settings', label: 'Settings', Icon: Settings, desc: 'Display & Capacity' }
  ];

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Header HUD */}
        <header className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--color-leaf-primary), var(--color-sun-amber))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}>
              <Sun size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                CHRONOMANCY
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {totalLeakMinutes > 0 ? (
              <div style={{
                background: 'var(--color-leak-bg)',
                border: '1px solid var(--color-leak-border)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--color-leak-rust)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertTriangle size={12} />
                <span>{totalLeakMinutes}m Debt</span>
              </div>
            ) : (
              <div style={{
                background: 'var(--color-leaf-light)',
                border: '1px solid var(--color-leaf-border)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--color-leaf-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} />
                <span>Clean Run</span>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Floating Bottom Dock */}
        <nav
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 24px)',
            maxWidth: '480px',
            background: 'var(--bg-glass-card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 10px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1000
          }}
        >
          {navItems.map(item => {
            const { Icon } = item;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  background: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '6px 8px',
                  color: isActive ? 'var(--color-leaf-primary)' : 'var(--text-muted)',
                  fontSize: '9px',
                  fontWeight: isActive ? '800' : '600'
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside
      className="glass-panel"
      style={{
        width: '280px',
        minWidth: '280px',
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--color-leaf-primary), var(--color-sun-amber))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: 'var(--shadow-glow-leaf)'
          }}>
            <Sun size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              CHRONOMANCY
            </h1>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              SOLARPUNK TEMPORAL OS
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(item => {
            const { Icon } = item;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--color-leaf-light)' : 'transparent',
                  border: isActive ? '1px solid var(--color-leaf-border)' : '1px solid transparent',
                  color: isActive ? 'var(--color-leaf-primary)' : 'var(--text-main)',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease'
                }}
              >
                <div style={{
                  color: isActive ? 'var(--color-leaf-primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: isActive ? '800' : '600' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Battery Gauge & OLED Toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
        
        {/* 1,440 Minute Solar Battery */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BatteryCharging size={11} color="var(--color-leaf-primary)" />
              1,440m ALLOCATION
            </span>
            <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>{batteryPercent}%</span>
          </div>
          <div className="solar-battery-bar" style={{ height: '6px' }}>
            <div className="solar-battery-fill" style={{ width: `${batteryPercent}%` }} />
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px', textAlign: 'right' }}>
            {remainingMinutes}m unallocated margin
          </div>
        </div>

        {/* Live Astronomical Circadian & Daylight Status */}
        <div style={{
          background: solarData.isDay ? 'var(--color-sun-light)' : 'rgba(46, 230, 168, 0.08)',
          border: `1px solid ${solarData.isDay ? 'var(--color-sun-amber)' : 'var(--color-leaf-primary)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: '800',
              color: solarData.isDay ? 'var(--color-sun-warm)' : 'var(--color-leaf-primary)'
            }}>
              {solarData.isDay ? <Sun size={13} strokeWidth={2.5} /> : <span style={{ fontSize: '13px', lineHeight: 1 }}>{lunarData.moonEmoji}</span>}
              <span>{solarData.isDay ? 'Daylight Hours' : 'Night Hours'}</span>
            </span>

            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: '800', color: 'var(--text-main)' }}>
              {solarData.isDay ? `${solarData.progressPercent}% Solar Arc` : `${lunarData.illumination}% Illum`}
            </span>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{solarData.isDay ? `Dusk at ${solarData.sunsetTime}` : `Dawn at ${solarData.sunriseTime}`}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              <span style={{ fontSize: '12px', lineHeight: 1 }}>{lunarData.moonEmoji}</span>
              <span>{lunarData.phaseName}</span>
            </span>
          </div>

          <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', borderTop: '1px dashed var(--border-light)', paddingTop: '4px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tzInfo.label}
          </div>
        </div>

        {/* OLED Dark / Sunlit Toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--text-main)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          {theme === 'dark' ? (
            <>
              <Moon size={14} color="var(--color-leaf-primary)" />
              <span>OLED DARK MODE</span>
            </>
          ) : (
            <>
              <Sun size={14} color="var(--color-sun-amber)" />
              <span>SUNLIT LIGHT MODE</span>
            </>
          )}
        </button>

      </div>
    </aside>
  );
}

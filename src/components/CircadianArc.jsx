// src/components/CircadianArc.jsx - Circadian Sun Arc & Astronomical Moon Phase HUD (No Emojis)

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Compass, Globe, Sparkles } from 'lucide-react';
import { getTimezoneInfo, getSolarDaylightProgress, calculateMoonPhase } from '../utils/solarLunarUtils';

export function CircadianArc({ timeFormat = '12h' }) {
  const [solarData, setSolarData] = useState(() => getSolarDaylightProgress(new Date(), timeFormat));
  const [lunarData, setLunarData] = useState(() => calculateMoonPhase());
  const [tzInfo, setTzInfo] = useState(() => getTimezoneInfo());

  // Periodically refresh solar & lunar alignment
  useEffect(() => {
    const update = () => {
      setSolarData(getSolarDaylightProgress(new Date(), timeFormat));
      setLunarData(calculateMoonPhase());
      setTzInfo(getTimezoneInfo());
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [timeFormat]);

  // Renders a geometric SVG representation of the actual lunar phase
  const renderMoonSvg = () => {
    const r = 8;
    const cx = 10;
    const cy = 10;
    const { phaseFraction } = lunarData;

    // Full moon
    if (phaseFraction >= 0.47 && phaseFraction < 0.53) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" style={{ filter: 'drop-shadow(0 0 6px rgba(46, 230, 168, 0.4))' }}>
          <circle cx={cx} cy={cy} r={r} fill="var(--color-leaf-primary)" />
        </svg>
      );
    }

    // New moon
    if (phaseFraction < 0.03 || phaseFraction >= 0.97) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />
        </svg>
      );
    }

    // Crescent / Gibbous rendering using dual arcs
    const isWaxing = phaseFraction < 0.5;
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.3))' }}>
        <circle cx={cx} cy={cy} r={r} fill="var(--bg-surface-elevated)" stroke="var(--border-strong)" strokeWidth="1" />
        {isWaxing ? (
          <path d="M 10 2 A 8 8 0 0 1 10 18 A 5 8 0 0 0 10 2 Z" fill="var(--color-sun-amber)" />
        ) : (
          <path d="M 10 2 A 8 8 0 0 0 10 18 A 5 8 0 0 1 10 2 Z" fill="var(--color-sun-amber)" />
        )}
      </svg>
    );
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-full)',
      padding: '4px 14px'
    }}>
      {/* Celestial Icon & Horizon Curve */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {solarData.isDay ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sun size={15} color="var(--color-sun-amber)" strokeWidth={2.5} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-sun-warm)', fontFamily: 'var(--font-mono)' }}>
                Solar Arc: {solarData.progressPercent}%
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Dusk at {solarData.sunsetTime} ({solarData.daylightHours}h light)
              </span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderMoonSvg()}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-leaf-primary)', fontFamily: 'var(--font-mono)' }}>
                {lunarData.phaseName} ({lunarData.illumination}%)
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Dawn at {solarData.sunriseTime} (Day {lunarData.lunarAgeDays}/29.5)
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-light)' }} />

      {/* Timezone & DST Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        <Globe size={11} color="var(--color-leaf-primary)" />
        <span>{tzInfo.label}</span>
      </div>
    </div>
  );
}

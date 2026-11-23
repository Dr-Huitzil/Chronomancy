// src/components/AuditLedger.jsx - YNAB-style Zero-Based Minute Auditor & Compounding Leak Simulator (No Emojis)

import React, { useState } from 'react';
import { Scale, TrendingDown, BookOpen, Award, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AuditLedger({ schedule, user, onResolveOverdraft }) {
  const [dailyLeakInput, setDailyLeakInput] = useState(35);

  const leakMinutesMonthly = dailyLeakInput * 30;
  const leakHoursMonthly = (leakMinutesMonthly / 60).toFixed(1);
  const leakHoursYearly = ((dailyLeakInput * 365) / 60).toFixed(1);
  
  // Real-world equivalencies
  const certEquivalentsYearly = (leakHoursYearly / 80).toFixed(1); // 80h per AWS cert
  const booksEquivalentsYearly = Math.round(leakHoursYearly / 6);  // 6h per average book

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: '1' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={16} color="var(--color-leaf-primary)" />
          CHRONO-AUDIT & OVERDRAFT LEDGER
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Zero-based time reconciliation & compounding opportunity costs
        </p>
      </div>

      {/* YNAB 1,440-Minute Zero-Sum Ledger */}
      <div className="glass-card" style={{ padding: '12px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
          DAILY ZERO-SUM CONSERVATION (1,440 MINUTES)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Daily Endowment:</span>
            <span style={{ fontWeight: '700' }}>1,440 min (24h)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>- Sleep Envelope (Fixed):</span>
            <span>480 min (8h)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-transit-terracotta)' }}>
            <span>- Transit & Commute Buffers:</span>
            <span>90 min (1.5h)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-leaf-primary)' }}>
            <span>- High-Value Study & Projects:</span>
            <span>315 min (5.25h)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-leak-rust)', fontWeight: '700' }}>
            <span>- Doomscroll Overdraft:</span>
            <span>35 min</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--border-strong)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
            <span>Net Unallocated Margin:</span>
            <span style={{ color: 'var(--color-sun-warm)' }}>520 min</span>
          </div>
        </div>
      </div>

      {/* Compounding Leak Calculator */}
      <div className="glass-card" style={{ padding: '14px', border: '1px solid var(--color-sun-amber)', background: 'var(--color-sun-light)' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-sun-warm)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.04em' }}>
          <TrendingDown size={14} color="var(--color-sun-warm)" />
          THE COMPOUNDING TIME PRINCIPLE
        </h3>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          People calculate compound interest with money, but time cannot be earned back. Test your daily leak:
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            value={dailyLeakInput}
            onChange={(e) => setDailyLeakInput(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--color-sun-warm)' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700', color: 'var(--color-sun-warm)', minWidth: '45px' }}>
            {dailyLeakInput}m/day
          </span>
        </div>

        {/* Compounding Projections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>MONTHLY DRAIN</div>
            <div style={{ fontWeight: '800', fontSize: '13px', color: 'var(--color-leak-rust)' }}>{leakHoursMonthly} Hours</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Nearly a full 24h day lost</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>ANNUAL OPPORTUNITY</div>
            <div style={{ fontWeight: '800', fontSize: '13px', color: 'var(--color-leak-rust)' }}>{leakHoursYearly} Hours</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Equivalent to {certEquivalentsYearly} AWS Certs</div>
          </div>
        </div>

        <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-main)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={13} color="var(--color-leaf-primary)" />
          At {dailyLeakInput} min/day, you could have read ~{booksEquivalentsYearly} books this year instead.
        </p>
      </div>

      {/* YNAB Rebalance Action */}
      <div className="glass-card" style={{ padding: '12px', background: 'var(--color-leaf-light)', border: '1px solid var(--color-leaf-border)' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-leaf-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.04em' }}>
          <ShieldCheck size={14} color="var(--color-leaf-primary)" />
          ROLL WITH THE PUNCHES (REBALANCE OVERDRAFT)
        </h4>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          When an unbudgeted leak occurs, select which envelope absorbs the debt:
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Cut from Project Code', 'Shorten Evening Free Time', 'Deduct from Tomorrow Morning'].map(opt => (
            <button
              key={opt}
              onClick={() => onResolveOverdraft(opt)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-main)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

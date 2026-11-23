// src/views/AuditView.jsx - Dedicated Chrono-Audit & Compounding Leak Simulator View

import React, { useState } from 'react';
import { Scale, TrendingDown, BookOpen, Award, AlertTriangle, ShieldCheck, CheckCircle2, DollarSign, Clock } from 'lucide-react';

export function AuditView({ schedule, user, onResolveOverdraft }) {
  const [dailyLeakInput, setDailyLeakInput] = useState(35);

  const leakMinutesMonthly = dailyLeakInput * 30;
  const leakHoursMonthly = (leakMinutesMonthly / 60).toFixed(1);
  const leakHoursYearly = ((dailyLeakInput * 365) / 60).toFixed(1);
  
  // Real-world equivalencies
  const certEquivalentsYearly = (leakHoursYearly / 80).toFixed(1);
  const booksEquivalentsYearly = Math.round(leakHoursYearly / 6);
  const codingProjectsYearly = (leakHoursYearly / 120).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* View Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scale size={22} color="var(--color-leaf-primary)" />
            CHRONO-AUDIT & OVERDRAFT LEDGER
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            YNAB-style zero-based time accounting, overdraft rebalancing, and compounding opportunity cost analysis
          </p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: 1,440 Minute Conservation Ledger */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            ZERO-SUM CONSERVATION LAW (1,440 MINUTES)
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Like zero-based financial budgeting ("Every dollar has a job"), every minute must be allocated. Unbudgeted leaks produce temporal overdraft debt.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            
            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '700' }}>Total Daily Capacity Endowment:</span>
              <span style={{ fontWeight: '800', color: 'var(--color-sun-warm)' }}>1,440 min (24.0h)</span>
            </div>

            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>- Fixed Sleep Envelope:</span>
              <span>480 min (8.0h)</span>
            </div>

            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--color-transit-terracotta)' }}>
              <span>- Commute & Transit Buffers:</span>
              <span>90 min (1.5h)</span>
            </div>

            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--color-leaf-primary)' }}>
              <span>- Academic & Focus Blocks:</span>
              <span>315 min (5.25h)</span>
            </div>

            <div className="glass-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', color: 'var(--color-leak-rust)', border: '1px solid var(--color-leak-border)', background: 'var(--color-leak-bg)' }}>
              <span style={{ fontWeight: '800' }}>- Unbudgeted Attention Leaks:</span>
              <span style={{ fontWeight: '800' }}>35 min (Debt)</span>
            </div>

            <div style={{ borderTop: '2px dashed var(--border-strong)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px' }}>
              <span>Remaining Free Margin:</span>
              <span style={{ color: 'var(--color-leaf-primary)' }}>520 min (8.6h)</span>
            </div>
          </div>

          {/* Overdraft Rebalance Section */}
          <div className="glass-card" style={{ padding: '16px', background: 'var(--color-leaf-light)', border: '1px solid var(--color-leaf-border)', marginTop: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-leaf-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--color-leaf-primary)" />
              ROLL WITH THE PUNCHES (OVERDRAFT REBALANCE)
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              You leaked 35 minutes into unbudgeted scrolling. Select where this debt is deducted from:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Cut 35m from Personal Project Coding',
                'Shorten Evening Leisure by 35m',
                'Wake up 35m earlier tomorrow to balance ledger'
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => onResolveOverdraft(opt)}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-main)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: '700',
                    textAlign: 'left'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Compounding Leak Simulator */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-sun-warm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingDown size={18} color="var(--color-sun-warm)" />
            THE COMPOUNDING LEAK PRINCIPLE
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            We intuitively understand compound interest with money, but time compounds in reverse: lost minutes never yield dividends.
          </p>

          <div className="glass-card" style={{ padding: '18px', border: '1px solid var(--color-sun-amber)', background: 'var(--color-sun-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                Simulate Daily Micro-Leak:
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '800', color: 'var(--color-sun-warm)' }}>
                {dailyLeakInput} min / day
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={dailyLeakInput}
              onChange={(e) => setDailyLeakInput(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-sun-warm)', margin: '10px 0' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>MONTHLY ACCUMULATION</div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--color-leak-rust)', marginTop: '2px' }}>
                  {leakHoursMonthly} Hours
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Nearly a full 24h day of life gone
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>ANNUAL TEMPORAL COST</div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--color-leak-rust)', marginTop: '2px' }}>
                  {leakHoursYearly} Hours
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  ~{Math.round(leakHoursYearly / 24)} full 24h days per year
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Opportunity Cost Conversions */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px', color: 'var(--text-main)' }}>
              REAL-WORLD CONVERSION VALUES (WHAT YOU COULD HAVE BUILT)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="var(--color-sun-amber)" />
                <span>
                  <strong>{certEquivalentsYearly} Full Professional Certifications</strong> (e.g. AWS Solutions Architect @ 80h each)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={18} color="var(--color-leaf-primary)" />
                <span>
                  <strong>~{booksEquivalentsYearly} Books Read</strong> (at standard 6 hours per non-fiction book)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="var(--color-transit-terracotta)" />
                <span>
                  <strong>{codingProjectsYearly} Shipped Software Projects</strong> (at 120 build hours each)
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

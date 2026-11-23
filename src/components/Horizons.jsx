// src/components/Horizons.jsx - Academic Syllabi, Certifications & Chilling Projects (No Emojis)

import React, { useState } from 'react';
import { Compass, GraduationCap, Award, Briefcase, Calendar, Plus } from 'lucide-react';

export function Horizons({ academics, certifications, chillingProjects, onScheduleAssignment }) {
  const [partnerFilter, setPartnerFilter] = useState('all'); // 'all', 'Huitzil', 'Partner'

  const filteredCourses = academics.filter(course => {
    if (partnerFilter === 'all') return true;
    return course.owner === partnerFilter;
  });

  return (
    <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: '1' }}>
      
      {/* Header with Partner View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={16} color="var(--color-leaf-primary)" />
            HORIZONS & COMMITMENTS
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Academic syllabi, cert goals & backlogged incubators
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--color-leaf-light)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
          {['all', 'Huitzil', 'Partner'].map(filter => (
            <button
              key={filter}
              onClick={() => setPartnerFilter(filter)}
              style={{
                background: partnerFilter === filter ? 'var(--color-leaf-primary)' : 'transparent',
                color: partnerFilter === filter ? '#000' : 'var(--text-main)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700'
              }}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Academic Syllabi & Due Dates */}
      <div>
        <h3 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.04em' }}>
          <GraduationCap size={14} color="var(--color-leaf-primary)" />
          ACADEMIC SYLLABI & WEEKLY DUE DATES
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredCourses.map(course => (
            <div key={course.id} className="glass-card" style={{ padding: '10px 12px', borderLeft: `3px solid ${course.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>
                  {course.code}: {course.name}
                </span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-leaf-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {course.owner}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {course.assignments.map(assn => (
                  <div key={assn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <div>
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{assn.title}</span>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Due: {assn.dueDate} • Est: {assn.estMinutes}m (Logged: {assn.loggedMinutes}m)
                      </div>
                    </div>
                    <button
                      onClick={() => onScheduleAssignment(assn)}
                      style={{
                        background: 'var(--color-leaf-light)',
                        border: '1px solid var(--color-leaf-border)',
                        color: 'var(--color-leaf-primary)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}
                    >
                      Schedule
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Certifications Long-Term Pace */}
      <div>
        <h3 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.04em' }}>
          <Award size={14} color="var(--color-sun-amber)" />
          CERTIFICATIONS (PACE CALCULATOR)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {certifications.map(cert => {
            const pct = Math.round((cert.loggedHours / cert.totalRequiredHours) * 100);
            return (
              <div key={cert.id} className="glass-card" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
                  <span>{cert.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-sun-warm)' }}>{pct}%</span>
                </div>
                <div className="solar-battery-bar" style={{ height: '6px', marginBottom: '6px' }}>
                  <div className="solar-battery-fill" style={{ width: `${pct}%`, background: cert.color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>Logged: {cert.loggedHours}h / {cert.totalRequiredHours}h</span>
                  <span>Target: {cert.targetWeeklyHours}h/week</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Chilling Projects Incubator */}
      <div>
        <h3 style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.04em' }}>
          <Briefcase size={14} color="var(--color-transit-terracotta)" />
          CHILLING PROJECTS (INCUBATOR)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {chillingProjects.map(proj => (
            <div key={proj.id} className="glass-card" style={{ padding: '8px 10px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginBottom: '2px' }}>
                <span>{proj.name}</span>
                <span style={{ fontSize: '9px', padding: '2px 5px', borderRadius: '3px', background: 'var(--color-leaf-light)', color: 'var(--color-leaf-primary)', fontFamily: 'var(--font-mono)' }}>
                  {proj.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                Next: {proj.nextAction}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

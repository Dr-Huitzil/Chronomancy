// src/views/HorizonsView.jsx - Dedicated Academic Syllabi, Certifications & Incubator View

import React, { useState } from 'react';
import { Compass, GraduationCap, Award, Briefcase, Plus, Calendar, CheckSquare, Clock } from 'lucide-react';

export function HorizonsView({ academics, certifications, chillingProjects, onScheduleAssignment }) {
  const [partnerFilter, setPartnerFilter] = useState('all');

  const filteredCourses = academics.filter(course => {
    if (partnerFilter === 'all') return true;
    return course.owner === partnerFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* View Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass size={22} color="var(--color-leaf-primary)" />
            HORIZONS & COMMITMENTS
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Academic syllabi pipelines, partner deadline sync, certification targets, and chilling incubators
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
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '800'
              }}
            >
              {filter === 'all' ? 'All Commitments' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Academic Syllabi Section */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="var(--color-leaf-primary)" />
            ACADEMIC SYLLABI & WEEKLY ASSIGNMENT PIPELINES
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing {filteredCourses.length} Enrolled Courses
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
          {filteredCourses.map(course => (
            <div key={course.id} className="glass-card" style={{ padding: '16px', borderLeft: `5px solid ${course.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {course.code}: {course.name}
                  </h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Primary: {course.owner}
                  </p>
                </div>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--color-leaf-light)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                  Active Semester
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {course.assignments.map(assn => (
                  <div key={assn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-main)' }}>
                        {assn.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '10px' }}>
                        <span>Due: {assn.dueDate}</span>
                        <span>•</span>
                        <span>Est: {assn.estMinutes}m ({assn.loggedMinutes}m logged)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onScheduleAssignment(assn)}
                      style={{
                        background: 'var(--color-leaf-light)',
                        border: '1px solid var(--color-leaf-border)',
                        color: 'var(--color-leaf-primary)',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '800'
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
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="var(--color-sun-amber)" />
          CERTIFICATION HORIZONS & VELOCITY CALCULATOR
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
          {certifications.map(cert => {
            const pct = Math.round((cert.loggedHours / cert.totalRequiredHours) * 100);
            return (
              <div key={cert.id} className="glass-card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {cert.title}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '800', color: 'var(--color-sun-warm)' }}>
                    {pct}% Complete
                  </span>
                </div>
                
                <div className="solar-battery-bar" style={{ height: '8px', marginBottom: '10px' }}>
                  <div className="solar-battery-fill" style={{ width: `${pct}%`, background: cert.color }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>Logged: {cert.loggedHours}h / {cert.totalRequiredHours}h</span>
                  <span>Target Exam: {cert.targetExamDate}</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-sun-warm)', fontWeight: '700' }}>
                  Required Weekly Pace: {cert.targetWeeklyHours} hours/week to hit target date
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Chilling Projects Incubator */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={18} color="var(--color-transit-terracotta)" />
          CHILLING PROJECTS (INCUBATOR ZONE)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {chillingProjects.map(proj => (
            <div key={proj.id} className="glass-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '800', fontSize: '13px' }}>{proj.name}</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-leaf-light)', color: 'var(--color-leaf-primary)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                  {proj.status}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.4' }}>
                <strong style={{ color: 'var(--text-main)' }}>Next Physical Action:</strong> {proj.nextAction}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

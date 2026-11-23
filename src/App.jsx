// src/App.jsx - Main Application Shell for Chronomancy (Multi-View Home, Moon Phase & Timezone Support)

import React, { useState, useEffect } from 'react';
import { initialData } from './data/initialData';
import { Navigation } from './components/Navigation';
import { RunwayView } from './views/RunwayView';
import { ConstructView } from './views/ConstructView';
import { GroveView } from './views/GroveView';
import { HorizonsView } from './views/HorizonsView';
import { AuditView } from './views/AuditView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [data, setData] = useState(initialData);
  const [currentView, setCurrentView] = useState('runway'); // 'runway', 'grove', 'horizons', 'audit', 'settings'
  const [isMobile, setIsMobile] = useState(false);
  
  // Theme state: defaults to 'dark' for OLED void display
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('chronomancy_theme') || 'dark';
  });

  // Time format state: defaults to '12h' (AM/PM) to reduce 24h confusion
  const [timeFormat, setTimeFormat] = useState(() => {
    return localStorage.getItem('chronomancy_time_format') || '12h';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chronomancy_theme', theme);
  }, [theme]);

  // Save time format to localStorage
  useEffect(() => {
    localStorage.setItem('chronomancy_time_format', timeFormat);
  }, [timeFormat]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Responsive window resize observer
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Block creation & editing handlers (with anchor synchronization)
  const handleSaveBlock = (savedBlock) => {
    setData(prev => {
      // 1. Update runway schedule
      const exists = prev.runwaySchedule.some(b => b.id === savedBlock.id);
      let updatedSchedule;
      if (exists) {
        updatedSchedule = prev.runwaySchedule.map(b => b.id === savedBlock.id ? savedBlock : b);
      } else {
        updatedSchedule = [savedBlock, ...prev.runwaySchedule];
      }

      // 2. Synchronize recurring anchors
      let updatedAnchors = prev.recurringAnchors;
      if (savedBlock.isRecurring) {
        const anchorIndex = prev.recurringAnchors.findIndex(a => a.id === savedBlock.id);
        if (anchorIndex >= 0) {
          updatedAnchors = prev.recurringAnchors.map(a => a.id === savedBlock.id ? savedBlock : a);
        } else {
          updatedAnchors = [...prev.recurringAnchors, savedBlock];
        }
      }

      return {
        ...prev,
        runwaySchedule: updatedSchedule,
        recurringAnchors: updatedAnchors
      };
    });
  };

  const handleDeleteBlock = (blockId) => {
    setData(prev => ({
      ...prev,
      runwaySchedule: prev.runwaySchedule.filter(b => b.id !== blockId),
      recurringAnchors: prev.recurringAnchors.filter(a => a.id !== blockId)
    }));
  };

  const handleApplyAnchors = () => {
    // Collect all existing anchor IDs, times, and normalized titles currently on the runway
    const existingAnchorIds = new Set(
      data.runwaySchedule
        .map(b => b.originAnchorId || (b.isRecurring ? b.id : null))
        .filter(Boolean)
    );
    const existingTimes = new Set(data.runwaySchedule.map(b => `${b.time}_${b.type}`));
    const existingTitlesNormalized = new Set(
      data.runwaySchedule.map(b => b.title.toLowerCase().replace(/[^a-z0-9]/g, ''))
    );

    // Identify non-duplicate anchors
    const anchorsToAdd = data.recurringAnchors.filter(a => {
      // 1. Direct Anchor ID match
      if (existingAnchorIds.has(a.id)) return false;
      
      // 2. Matching start time and activity type (e.g. 07:30 work shift already on runway)
      if (existingTimes.has(`${a.time}_${a.type}`)) return false;

      // 3. Normalized title match
      const normTitle = a.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (existingTitlesNormalized.has(normTitle)) return false;

      return true;
    });

    if (anchorsToAdd.length === 0) {
      alert("All recurring anchor routines are already populated in today's schedule (0 duplicates added).");
      return;
    }

    const timestamp = Date.now();
    const newBlocks = anchorsToAdd.map((a, idx) => ({
      id: `s-anchor-${timestamp}-${idx}`,
      originAnchorId: a.id,
      time: a.time,
      duration: a.duration,
      title: a.title,
      type: a.type,
      category: a.category,
      isRecurring: true,
      days: a.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      hasBreak: a.hasBreak,
      breakTitle: a.breakTitle,
      breakStart: a.breakStart,
      breakDuration: a.breakDuration,
      status: 'planned'
    }));

    setData(prev => {
      // Secondary safety check inside updater to guarantee absolute idempotency
      const currentIds = new Set(prev.runwaySchedule.map(b => b.originAnchorId || (b.isRecurring ? b.id : null)));
      const currentTitles = new Set(prev.runwaySchedule.map(b => b.title.toLowerCase().replace(/[^a-z0-9]/g, '')));
      
      const safeToAdd = newBlocks.filter(b => 
        !currentIds.has(b.originAnchorId) && 
        !currentTitles.has(b.title.toLowerCase().replace(/[^a-z0-9]/g, ''))
      );

      if (safeToAdd.length === 0) return prev;

      const merged = [...prev.runwaySchedule, ...safeToAdd].sort((a, b) => a.time.localeCompare(b.time));

      return {
        ...prev,
        runwaySchedule: merged
      };
    });

    alert(`Populated ${newBlocks.length} anchor routine(s) (Work shifts with carved lunch, Commutes) into today's runway.`);
  };

  const handleScheduleAssignment = (assignment) => {
    const newBlock = {
      id: `s-${Date.now()}`,
      time: "17:00",
      duration: 60,
      title: `Study: ${assignment.title}`,
      type: "study",
      category: "Academic",
      status: "planned"
    };

    setData(prev => ({
      ...prev,
      runwaySchedule: [...prev.runwaySchedule, newBlock]
    }));
    alert(`Scheduled 60m focus block for "${assignment.title}" into Today's Runway.`);
    setCurrentView('runway');
  };

  const handleResolveOverdraft = (option) => {
    alert(`Rebalanced 35m leak. Adjusted strategy: ${option}`);
    setData(prev => ({
      ...prev,
      runwaySchedule: prev.runwaySchedule.filter(item => item.type !== 'leak')
    }));
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chronomancy_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm("Reset all schedule, syllabus, and grove data to default seed state?")) {
      setData(initialData);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      
      {/* Navigation (Sidebar on Desktop, Bottom Dock + Header on Mobile) */}
      <Navigation
        currentView={currentView}
        onNavigate={setCurrentView}
        theme={theme}
        onToggleTheme={toggleTheme}
        data={data}
        isMobile={isMobile}
        timeFormat={timeFormat}
        onQuickAdd={() => {
          setCurrentView('construct');
        }}
      />

      {/* Main Content Area (Dedicated View Rendering) */}
      <main
        style={{
          flex: 1,
          padding: isMobile ? '0 12px 96px 12px' : '20px 32px',
          overflowY: 'auto',
          height: isMobile ? 'auto' : '100vh'
        }}
      >
        {currentView === 'runway' && (
          <RunwayView
            schedule={data.runwaySchedule}
            recurringAnchors={data.recurringAnchors}
            academics={data.academics}
            certifications={data.certifications}
            chillingProjects={data.chillingProjects}
            timeFormat={timeFormat}
            onSaveBlock={handleSaveBlock}
            onDeleteBlock={handleDeleteBlock}
            onApplyAnchors={handleApplyAnchors}
            onNavigateToConstruct={() => setCurrentView('construct')}
            onRebalanceLeak={() => handleResolveOverdraft("Rebalanced from free margin")}
          />
        )}

        {currentView === 'construct' && (
          <ConstructView
            schedule={data.runwaySchedule}
            user={data.user}
            timeFormat={timeFormat}
            onSaveBlock={handleSaveBlock}
            onNavigateToRunway={() => setCurrentView('runway')}
          />
        )}

        {currentView === 'grove' && (
          <GroveView
            grove={data.grove}
          />
        )}

        {currentView === 'horizons' && (
          <HorizonsView
            academics={data.academics}
            certifications={data.certifications}
            chillingProjects={data.chillingProjects}
            onScheduleAssignment={handleScheduleAssignment}
          />
        )}

        {currentView === 'audit' && (
          <AuditView
            schedule={data.runwaySchedule}
            user={data.user}
            onResolveOverdraft={handleResolveOverdraft}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            user={data.user}
            theme={theme}
            onToggleTheme={toggleTheme}
            timeFormat={timeFormat}
            onToggleTimeFormat={setTimeFormat}
            onExportData={handleExportData}
            onResetData={handleResetData}
          />
        )}
      </main>

    </div>
  );
}

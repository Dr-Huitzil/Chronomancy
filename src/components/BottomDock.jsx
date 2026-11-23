// src/components/BottomDock.jsx - Mobile Floating Glass Dock (No Emojis)

import React from 'react';
import { Clock, Trees, Plus, Compass, Scale } from 'lucide-react';

export function BottomDock({ activeTab, setActiveTab, onQuickLog }) {
  const tabs = [
    { id: 'runway', label: 'Runway', Icon: Clock },
    { id: 'grove', label: 'The Grove', Icon: Trees },
    { id: 'quick', label: 'Log', Icon: Plus, isAction: true },
    { id: 'horizons', label: 'Horizons', Icon: Compass },
    { id: 'audit', label: 'Audit', Icon: Scale }
  ];

  return (
    <nav
      className="mobile-bottom-dock"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '480px',
        background: 'var(--bg-glass-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 12px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)',
        zIndex: 1000
      }}
    >
      {tabs.map((tab) => {
        const { Icon } = tab;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={onQuickLog}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-leaf-primary), var(--color-sun-amber))',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow-leaf)',
                marginTop: '-14px'
              }}
              title="Quick Log Activity"
            >
              <Icon size={20} strokeWidth={2.5} />
            </button>
          );
        }

        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 8px',
              color: isActive ? 'var(--color-leaf-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: isActive ? '800' : '500'
            }}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

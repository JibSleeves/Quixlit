
"use client";

import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RetroMenuBar } from '@/components/RetroMenuBar'; // Import the new menu bar

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [crtEffectEnabled, setCrtEffectEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const savedCrtSetting = localStorage.getItem('crtEffectEnabled');
    if (savedCrtSetting !== null) {
      setCrtEffectEnabled(JSON.parse(savedCrtSetting));
    }

    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString()); // Initial time

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handleCrtEffectToggle = (enabled: boolean) => {
    setCrtEffectEnabled(enabled);
    localStorage.setItem('crtEffectEnabled', JSON.stringify(enabled));
  };

  return (
    <div className={cn("flex flex-col min-h-screen bg-background")}>
      {crtEffectEnabled && <div className="crt-scanline-effect" />}
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <RetroMenuBar /> 
      <main className="flex-grow p-4 overflow-auto flex flex-col"> {/* Added flex flex-col for main content area */}
        {children}
      </main>
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        crtEffectEnabled={crtEffectEnabled}
        onCrtEffectChange={handleCrtEffectToggle}
      />
       <footer className="px-2 py-1 text-xs text-muted-foreground border-t-2 border-t-[hsl(var(--border-light))] bg-card select-none flex justify-between items-center print:hidden">
        <span>Nostalgia AI v0.1.0 - Ready.</span>
        <div className="flex items-center space-x-2">
          <span className="px-1 border border-border-dark bg-input">CPU: 100%</span>
          <span className="px-1 border border-border-dark bg-input">MEM: 256MB</span>
          <span className="px-1 border border-border-dark bg-input">{currentTime}</span>
        </div>
      </footer>
    </div>
  );
}

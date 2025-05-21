
"use client";

import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [crtEffectEnabled, setCrtEffectEnabled] = useState(false);

  useEffect(() => {
    const savedCrtSetting = localStorage.getItem('crtEffectEnabled');
    if (savedCrtSetting !== null) {
      setCrtEffectEnabled(JSON.parse(savedCrtSetting));
    }
  }, []);

  const handleCrtEffectToggle = (enabled: boolean) => {
    setCrtEffectEnabled(enabled);
    localStorage.setItem('crtEffectEnabled', JSON.stringify(enabled));
  };

  return (
    <div className={cn("flex flex-col min-h-screen bg-background")}>
      {crtEffectEnabled && <div className="crt-scanline-effect" />}
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-grow p-4 overflow-auto">
        {children}
      </main>
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        crtEffectEnabled={crtEffectEnabled}
        onCrtEffectChange={handleCrtEffectToggle}
      />
       <footer className="p-2 text-center text-xs text-muted-foreground border-t-2 border-t-[hsl(var(--border-light))] bg-background">
        Nostalgia AI v0.1.0 - Ready.
      </footer>
    </div>
  );
}

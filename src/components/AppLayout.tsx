"use client";

import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-grow p-4 overflow-auto">
        {children}
      </main>
      <SettingsPanel isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
       <footer className="p-2 text-center text-xs text-muted-foreground border-t-2 border-t-[hsl(var(--border-light))] bg-background">
        Nostalgia AI v0.1.0 - Ready.
      </footer>
    </div>
  );
}

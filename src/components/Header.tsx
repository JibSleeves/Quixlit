"use client";

import { Settings } from 'lucide-react';
import { RetroButton } from '@/components/RetroButton';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="p-4 border-b-2 border-b-[hsl(var(--border-dark))] bg-background flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-primary select-none">Nostalgia AI</h1>
      <RetroButton onClick={onSettingsClick} aria-label="Settings">
        <Settings size={20} className="mr-1" />
        Settings
      </RetroButton>
    </header>
  );
}


"use client";

import { Settings, Code2 } from 'lucide-react'; // Added Code2 icon
import { RetroButton } from '@/components/RetroButton';
import Link from 'next/link'; // Import Link for navigation

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="p-4 border-b-2 border-b-[hsl(var(--border-dark))] bg-background flex justify-between items-center sticky top-0 z-10">
      <Link href="/" passHref>
        <h1 className="text-2xl font-bold text-primary select-none cursor-pointer hover:opacity-80 transition-opacity">Nostalgia AI</h1>
      </Link>
      <div className="flex items-center space-x-2">
        <Link href="/editor" passHref>
          <RetroButton aria-label="Open Code Editor">
            <Code2 size={20} className="mr-1" />
            Editor
          </RetroButton>
        </Link>
        <RetroButton onClick={onSettingsClick} aria-label="Settings">
          <Settings size={20} className="mr-1" />
          Settings
        </RetroButton>
      </div>
    </header>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Code, Terminal, Cpu, Bot, Sparkles, GitBranch } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export function QuixlitNav() {
  const pathname = usePathname();
  
  const navLinks: NavLink[] = [
    { 
      href: '/', 
      label: 'Home', 
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Quixlit Overview'
    },
    { 
      href: '/editor', 
      label: 'Code Editor', 
      icon: <Code className="h-4 w-4" />,
      description: 'Editor with multiple files' 
    },
    { 
      href: '/ai-assistant', 
      label: 'AI Assistant', 
      icon: <Bot className="h-4 w-4" />,
      description: 'LLM-powered assistant'
    },
    // Future pages
    /*
    { 
      href: '/terminal', 
      label: 'Terminal', 
      icon: <Terminal className="h-4 w-4" />,
      description: 'Command line interface'
    },
    { 
      href: '/git', 
      label: 'Git', 
      icon: <GitBranch className="h-4 w-4" />,
      description: 'Git version control'
    },
    { 
      href: '/settings', 
      label: 'Settings', 
      icon: <Settings className="h-4 w-4" />,
      description: 'App configuration'
    },
    */
  ];

  return (
    <div className="flex items-center justify-center gap-4 p-2 border-t border-t-[hsl(var(--border-dark))] bg-card/50">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1 hover:bg-primary/10 rounded border border-transparent transition-colors relative group",
              isActive && "bg-primary/20 border-primary/40"
            )}
          >
            <div className="flex items-center space-x-1">
              <div className={cn(
                "text-muted-foreground",
                isActive && "text-primary"
              )}>
                {link.icon}
              </div>
              <span className={cn(
                "text-sm",
                isActive && "font-medium text-primary"
              )}>
                {link.label}
              </span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {link.description}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

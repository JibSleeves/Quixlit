"use client";

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'accent' | 'default';
}

export function RetroButton({ children, className, variant = 'default', ...props }: RetroButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
    default: 'bg-muted text-foreground hover:bg-secondary',
  };

  return (
    <button
      className={cn(
        'px-4 py-2 border-2 text-sm font-medium transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        'border-t-[hsl(var(--border-light))] border-l-[hsl(var(--border-light))] border-b-[hsl(var(--border-dark))] border-r-[hsl(var(--border-dark))]',
        'active:border-t-[hsl(var(--border-dark))] active:border-l-[hsl(var(--border-dark))] active:border-b-[hsl(var(--border-light))] active:border-r-[hsl(var(--border-light))]',
        'active:pt-[calc(0.5rem+1px)] active:pb-[calc(0.5rem-1px)]', // Simulate button press by adjusting padding
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

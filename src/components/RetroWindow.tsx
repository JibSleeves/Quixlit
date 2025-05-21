
"use client";

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X, Minus, Square } from 'lucide-react';

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleBarClassName?: string;
  contentClassName?: string;
}

export function RetroWindow({ title, children, className, titleBarClassName, contentClassName }: RetroWindowProps) {
  const buttonBaseClasses = "p-0.5 bg-muted border border-t-[hsl(var(--border-light))] border-l-[hsl(var(--border-light))] border-b-[hsl(var(--border-dark))] border-r-[hsl(var(--border-dark))] active:border-t-[hsl(var(--border-dark))] active:border-l-[hsl(var(--border-dark))] active:border-b-[hsl(var(--border-light))] active:border-r-[hsl(var(--border-light))] hover:brightness-110 active:brightness-90";

  return (
    <div
      className={cn(
        'bg-card text-card-foreground border-2 shadow-md',
        'border-t-[hsl(var(--border-light))] border-l-[hsl(var(--border-light))] border-b-[hsl(var(--border-dark))] border-r-[hsl(var(--border-dark))]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between p-1 bg-secondary text-secondary-foreground border-b-2 border-b-[hsl(var(--border-dark))] cursor-default select-none',
          titleBarClassName
        )}
      >
        <span className="font-bold ml-1 text-sm">{title}</span>
        <div className="flex space-x-1">
          <button className={cn(buttonBaseClasses, "text-foreground")}>
            <Minus size={14} />
          </button>
          <button className={cn(buttonBaseClasses, "text-foreground")}>
            <Square size={14} />
          </button>
          <button className={cn(buttonBaseClasses, "bg-destructive text-destructive-foreground")}>
            <X size={14} />
          </button>
        </div>
      </div>
      <div className={cn('p-4', contentClassName)}>
        {children}
      </div>
    </div>
  );
}

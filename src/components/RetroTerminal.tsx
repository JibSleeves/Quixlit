"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RetroTerminalProps {
  initialContent?: string;
  className?: string;
  onCommand?: (command: string) => Promise<string>;
}

export function RetroTerminal({
  initialContent = '> Terminal ready. Type commands here...',
  className,
  onCommand
}: RetroTerminalProps) {
  const [content, setContent] = useState(initialContent);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [content]);

  // Focus input when terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle command execution
  const executeCommand = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const command = inputValue.trim();
    
    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command to terminal content
    setContent(prev => `${prev}\n> ${command}`);
    setInputValue('');
    
    // If we have a command handler, execute it
    if (onCommand) {
      setIsProcessing(true);
      try {
        const result = await onCommand(command);
        setContent(prev => `${prev}\n${result}`);
      } catch (error) {
        console.error('Command execution error:', error);
        setContent(prev => `${prev}\nError: Command execution failed.`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle history navigation
  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex]);
    } else {
      const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
      if (newIndex === historyIndex) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        executeCommand();
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateHistory('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateHistory('down');
        break;
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-[#0a0a0a] text-[#33ff33] font-mono text-xs p-2 overflow-hidden",
        className
      )}
      onClick={focusInput}
    >
      <div 
        ref={terminalRef}
        className="flex-grow overflow-auto whitespace-pre-wrap"
      >
        {content}
      </div>
      
      <div className="flex items-center mt-1 border-t border-[#222222] pt-1">
        <span className="mr-2">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-[#33ff33] font-mono text-xs"
          disabled={isProcessing}
          aria-label="Terminal input"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        {isProcessing && (
          <span className="animate-pulse ml-2">...</span>
        )}
      </div>
    </div>
  );
}

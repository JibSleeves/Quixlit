
"use client";

import { AppLayout } from '@/components/AppLayout';
import { RetroWindow } from '@/components/RetroWindow';
import { RetroButton } from '@/components/RetroButton';
import Link from 'next/link';
import { Code, Bot, Cpu, GitBranch, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [loadingDemo, setLoadingDemo] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  
  // Simulate a boot-up sequence
  useEffect(() => {
    const startTime = Date.now();
    const bootDuration = 2000; // 2 seconds total boot time
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / bootDuration) * 100));
      setBootProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setLoadingDemo(false);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-full">
        {loadingDemo ? (
          <RetroWindow title="System Initialization" className="w-[500px] max-w-full">
            <div className="p-4 space-y-4">
              <h1 className="font-bold text-primary text-xl text-center">Quixlit Editor OS</h1>
              <div className="text-center text-muted-foreground text-sm">Version 1.0.0</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Loading system files...</span>
                  <span>{bootProgress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary/20 rounded overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-150 ease-linear"
                    style={{ width: `${bootProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-3 h-3" />
                  <span>Initializing llama.cpp system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-3 h-3" />
                  <span>Loading Monaco editor components</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-3 h-3" />
                  <span>Preparing AI assistants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-3 h-3" />
                  <span>Checking Git configuration</span>
                </div>
              </div>
            </div>
          </RetroWindow>
        ) : (
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
            <RetroWindow title="Welcome to Quixlit" className="w-full">
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-primary mb-2">Quixlit Editor</h1>
                  <p className="text-muted-foreground mb-6">
                    A Comprehensive AI-Powered Code Editor with Local LLM Integration
                  </p>
                  <div className="flex justify-center py-2">
                    <Sparkles className="text-accent h-8 w-8 animate-pulse" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Link href="/editor" className="block group">
                    <div className="border rounded-md p-4 hover:bg-card/50 transition-colors border-border">
                      <div className="mb-2 flex items-center text-primary">
                        <Code className="mr-2 h-5 w-5 group-hover:text-accent transition-colors" />
                        <h2 className="text-lg font-bold">Code Editor</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Powerful multi-file code editor with syntax highlighting, code folding, and Git integration. Create, edit, and manage your projects with ease.
                      </p>
                    </div>
                  </Link>
                  
                  <Link href="/ai-assistant" className="block group">
                    <div className="border rounded-md p-4 hover:bg-card/50 transition-colors border-border">
                      <div className="mb-2 flex items-center text-primary">
                        <Bot className="mr-2 h-5 w-5 group-hover:text-accent transition-colors" />
                        <h2 className="text-lg font-bold">AI Assistant</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Local AI-powered coding assistant using llama.cpp with specialized models for different tasks. All running locally on your machine.
                      </p>
                    </div>
                  </Link>
                </div>
                
                <div className="mt-6 border rounded-md p-4 bg-secondary/10 border-secondary/20">
                  <h3 className="text-md font-bold mb-2 text-secondary-foreground">Key Features</h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      <span>Monaco Editor with retro-styled interface</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      <span>Embedded llama.cpp for local LLM inference</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      <span>Specialized models for text, code, and reasoning tasks</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      <span>File explorer with Git status integration</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">•</span>
                      <span>Interactive terminal with command history</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <Link href="/editor">
                    <RetroButton variant="primary" className="min-w-[120px]">
                      Open Editor
                    </RetroButton>
                  </Link>
                  <Link href="/ai-assistant">
                    <RetroButton variant="accent" className="min-w-[120px]">
                      AI Assistant
                    </RetroButton>
                  </Link>
                </div>
                
                <div className="text-center text-xs text-muted-foreground mt-6 pt-2 border-t border-border">
                  Quixlit is an AI-powered code editor with local LLM inference using llama.cpp.
                  <br />All processing happens on your machine - no data is sent to external servers.
                </div>
              </div>
            </RetroWindow>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

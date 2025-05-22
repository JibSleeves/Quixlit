"use client";

import { RetroWindow } from '@/components/RetroWindow';
import { RetroAIAssistant } from '@/components/RetroAIAssistant';
import { AppLayout } from '@/components/AppLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';

export default function AIAssistantPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4 h-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="h-full min-h-[500px] md:min-h-0">
            <RetroAIAssistant 
              className="h-full" 
              initialContext="Welcome to Quixlit's local LLM-powered AI Assistant. No data leaves your machine - all inference happens locally!" 
            />
          </div>
          
          <div className="h-full min-h-[500px] md:min-h-0 flex flex-col gap-4">
            <RetroWindow title="AI Model Information" className="h-1/2">
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-primary">Local LLM Integration</h3>
                <p className="text-sm">
                  Quixlit integrates llama.cpp to run large language models directly on your machine, without sending data to external servers.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-bold">Available Models:</h4>
                  <div className="border border-border rounded-md p-3 bg-card/50">
                    <div className="flex items-center">
                      <span className="w-24 font-bold text-xs text-primary">Text Model:</span>
                      <span className="text-xs">Llama 3 8B (4-bit Quantized)</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="w-24 font-bold text-xs text-accent">Code Model:</span>
                      <span className="text-xs">CodeLlama 7B (4-bit Quantized)</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="w-24 font-bold text-xs text-yellow-400">Reasoning:</span>
                      <span className="text-xs">Llama 3 70B (4-bit Quantized)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold">Performance Notes:</h4>
                  <p className="text-xs text-muted-foreground">
                    • Small models (7-8B) can run on most systems with 8GB+ RAM<br />
                    • Medium models (13B) require 16GB+ RAM<br />
                    • Large models (34B+) need GPU acceleration<br />
                    • Silicon optimized builds available for Apple M1/M2/M3
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                  Note: This is a simulated implementation. In the full application, llama.cpp would be integrated via a Tauri native module.
                </p>
              </div>
            </RetroWindow>
            
            <RetroWindow title="Model Management" className="flex-1">
              <div className="p-4 space-y-4">
                <h3 className="text-md font-bold">Model Configuration</h3>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-secondary/30 rounded-md p-2">
                    <h4 className="font-bold text-xs text-primary mb-2">Text Model Settings</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span>0.7</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Context Size:</span>
                        <span>8192 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model Size:</span>
                        <span>8B parameters</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-md p-2">
                    <h4 className="font-bold text-xs text-accent mb-2">Code Model Settings</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Temperature:</span>
                        <span>0.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Context Size:</span>
                        <span>8192 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model Size:</span>
                        <span>7B parameters</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-md p-2 mt-3">
                  <h4 className="font-bold text-xs text-yellow-400 mb-2">Reasoning Model Settings</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span>0.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Context Size:</span>
                      <span>8192 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model Size:</span>
                      <span>70B parameters</span>
                    </div>
                    <div className="flex justify-between text-yellow-500">
                      <span>GPU Required:</span>
                      <span>Yes (8GB+ VRAM)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground italic mt-2">
                  For a full implementation, these settings would be configurable through a settings interface.
                </p>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

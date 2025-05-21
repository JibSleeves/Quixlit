
"use client";

import { AppLayout } from '@/components/AppLayout';
import { RetroWindow } from '@/components/RetroWindow';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Define some file/folder data - in a real app, this would come from an API or state
const fileSystemItems = [
  { type: 'folder', name: 'project_root/', depth: 0 },
  { type: 'file', name: 'README.md', depth: 1 },
  { type: 'folder', name: 'src/', depth: 1 },
  { type: 'file', name: 'app.tsx', depth: 2 },
  { type: 'folder', name: 'components/', depth: 2 },
  { type: 'file', name: 'Button.tsx', depth: 3 },
  { type: 'file', name: 'Dialog.tsx', depth: 3 },
  { type: 'folder', name: 'utils/', depth: 2 },
  { type: 'file', name: 'helpers.ts', depth: 3 },
];

export default function EditorPage() {
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* File Explorer Panel */}
        <div className="lg:w-1/4 h-full min-h-[300px] lg:min-h-0">
          <RetroWindow title="File Explorer" className="h-full flex flex-col" contentClassName="p-0">
            <ScrollArea className="flex-grow bg-input">
              <ul className="p-2 space-y-0.5">
                {fileSystemItems.map((item, index) => (
                  <li
                    key={index}
                    className={cn(
                      "text-sm text-foreground cursor-pointer hover:bg-muted/50 p-1 select-none",
                      "border border-transparent active:border-[hsl(var(--border-dark))] active:shadow-inner active:bg-input", // Basic button-like interaction
                      item.type === 'folder' ? 'font-medium' : ''
                    )}
                    style={{ paddingLeft: `${0.5 + item.depth * 1}rem` }} // Indentation based on depth
                  >
                    {item.type === 'folder' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 h-4 w-4 text-primary">
                        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 h-4 w-4 text-accent">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    )}
                    {item.name}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </RetroWindow>
        </div>

        {/* Code Editor Area Panel */}
        <div className="lg:w-3/4 h-full min-h-[500px] lg:min-h-0">
          <RetroWindow title="Code Editor - untitled.txt" className="h-full flex flex-col" contentClassName="p-0 flex-grow">
            <Textarea
              placeholder="Start typing your code here..."
              className="flex-grow w-full h-full bg-input text-foreground border-0 focus:ring-0 resize-none font-mono text-sm rounded-none" // Ensure textarea fills space and has no internal padding/border
              aria-label="Code Editor"
            />
          </RetroWindow>
        </div>
      </div>
    </AppLayout>
  );
}

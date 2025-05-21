
"use client";

import { AppLayout } from '@/components/AppLayout';
import { RetroWindow } from '@/components/RetroWindow';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EditorPage() {
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* File Explorer Panel */}
        <div className="lg:w-1/4 h-full min-h-[300px] lg:min-h-0">
          <RetroWindow title="File Explorer" className="h-full flex flex-col">
            <ScrollArea className="flex-grow p-2 bg-input">
              {/* Placeholder for file tree */}
              <p className="text-sm text-muted-foreground">File explorer content will go here.</p>
              <ul>
                <li className="text-sm text-foreground mt-2 ml-2 cursor-pointer hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 h-4 w-4"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                  project_root/
                </li>
                <li className="text-sm text-foreground mt-1 ml-6 cursor-pointer hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 h-4 w-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  README.md
                </li>
                <li className="text-sm text-foreground mt-1 ml-6 cursor-pointer hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 h-4 w-4"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
                  src/
                </li>
                 <li className="text-sm text-foreground mt-1 ml-10 cursor-pointer hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-2 h-4 w-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  app.tsx
                </li>
              </ul>
            </ScrollArea>
          </RetroWindow>
        </div>

        {/* Code Editor Area Panel */}
        <div className="lg:w-3/4 h-full min-h-[500px] lg:min-h-0">
          <RetroWindow title="Code Editor - untitled.txt" className="h-full flex flex-col">
            <Textarea
              placeholder="Start typing your code here..."
              className="flex-grow w-full h-full bg-input text-foreground border-0 focus:ring-0 resize-none font-mono text-sm"
              aria-label="Code Editor"
            />
          </RetroWindow>
        </div>
      </div>
    </AppLayout>
  );
}

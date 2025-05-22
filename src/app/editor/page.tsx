
"use client";

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { RetroWindow } from '@/components/RetroWindow';
import { RetroTerminal } from '@/components/RetroTerminal';
import { RetroMonacoEditor } from '@/components/RetroMonacoEditor';
import { RetroFileExplorer } from '@/components/RetroFileExplorer';
import { FileSystemItem, fileSystem } from '@/services/FileSystemService';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

// Sample welcome code
const welcomeCode = `// Welcome to Quixlit Editor
// A retro-styled code editor with local AI capabilities

/**
 * Key Features:
 * 
 * - Monaco Editor with retro styling
 * - File management system
 * - Multiple language support
 * - Local LLM integration via llama.cpp
 * - Multi-model support for different tasks
 * - Git integration
 * - Terminal with command execution
 */

function start() {
  console.log('Quixlit Editor is ready!');
  return true;
}

// Try selecting a file from the File Explorer!
`;

export default function EditorPage() {
  const [code, setCode] = useState(welcomeCode);
  const [activeFile, setActiveFile] = useState<FileSystemItem | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [terminalContent, setTerminalContent] = useState('> Terminal ready. Type commands here...');

  // Handle file selection
  const handleFileSelect = async (file: FileSystemItem) => {
    if (file.type === 'file') {
      setLoadingFile(true);
      try {
        // Load file content
        const content = await fileSystem.readFile(file.path);
        setCode(content);
        setActiveFile(file);
      } catch (error) {
        console.error('Error loading file:', error);
        // Add error message to terminal
        setTerminalContent(prev => `${prev}\n> Error loading file: ${file.path}`);
      } finally {
        setLoadingFile(false);
      }
    }
  };

  // Save file content
  const handleSaveFile = async () => {
    if (!activeFile || activeFile.type !== 'file') return;
    
    try {
      await fileSystem.writeFile(activeFile.path, code);
      setTerminalContent(prev => `${prev}\n> Saved file: ${activeFile.path}`);
    } catch (error) {
      console.error('Error saving file:', error);
      setTerminalContent(prev => `${prev}\n> Error saving file: ${activeFile.path}`);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSaveFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, code]);

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 h-full flex-grow">
        {/* Top row for File Explorer and Code Editor */}
        <div className="flex flex-col lg:flex-row gap-4 flex-grow min-h-0">
          {/* File Explorer Panel */}
          <div className="lg:w-1/4 h-full min-h-[200px] lg:min-h-0">
            <RetroWindow title="File Explorer" className="h-full flex flex-col" contentClassName="p-0">
              <RetroFileExplorer
                rootPath="/project"
                onFileSelect={handleFileSelect}
              />
            </RetroWindow>
          </div>

          {/* Code Editor Area Panel */}
          <div className="lg:w-3/4 h-full min-h-[300px] lg:min-h-0">
            <RetroWindow 
              title={activeFile ? `Code Editor - ${activeFile.name}` : 'Code Editor - Welcome'} 
              className="h-full flex flex-col" 
              contentClassName="p-0 flex-grow relative"
            >
              {loadingFile ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading file...</span>
                  </div>
                </div>
              ) : null}
              
              <RetroMonacoEditor
                value={code}
                language={activeFile?.language || 'javascript'}
                onChange={(value) => setCode(value || '')}
                height="100%"
                options={{
                  minimap: { enabled: true },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </RetroWindow>
          </div>
        </div>

        {/* Bottom row for Terminal/Logs */}
        <div className="h-1/3 min-h-[150px]">
          <RetroWindow title="Terminal / System Logs" className="h-full flex flex-col" contentClassName="p-0 flex-grow">
            <RetroTerminal 
              initialContent="Welcome to Quixlit Terminal v1.0.0
> Type 'help' to see available commands."
              onCommand={async (command) => {
                // Process terminal commands
                const cmd = command.toLowerCase().trim();
                
                if (cmd === 'help') {
                  return `Available commands:
  help - Show this help message
  clear - Clear the terminal
  save - Save the current file
  ls - List files in the current directory
  version - Show Quixlit version info`;
                } else if (cmd === 'clear') {
                  // The terminal will be cleared on the next render
                  return '';
                } else if (cmd === 'save') {
                  // Save the current file
                  await handleSaveFile();
                  return activeFile 
                    ? `File saved: ${activeFile.name}` 
                    : 'No active file to save.';
                } else if (cmd === 'ls') {
                  return `Mock directory listing:
  README.md
  package.json
  /src
  /public`;
                } else if (cmd === 'version') {
                  return `Quixlit Editor v1.0.0
  - Monaco Editor v1.74.1
  - Next.js 15.2.3
  - React 18.3.1`;
                } else if (cmd.startsWith('echo ')) {
                  return command.substring(5);
                } else {
                  return `Command not found: ${command}. Type 'help' for available commands.`;
                }
              }}
            />
          </RetroWindow>
        </div>
      </div>
    </AppLayout>
  );
}

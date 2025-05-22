"use client";

export interface FileSystemItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemItem[];
  size?: number;
  modifiedTime?: Date;
  language?: string; // For syntax highlighting
}

// Mock file content for demonstration
const mockFileContents: Record<string, string> = {
  'README.md': '# Quixlit Editor\n\nA retro-styled code editor with local AI capabilities.\n\n## Features\n\n- Monaco Editor integration\n- Retro UI styling\n- Local LLM integration via llama.cpp\n- File management\n- Git integration',
  
  'app.tsx': `"use client";

import { AppLayout } from '@/components/AppLayout';

export default function HomePage() {
  return (
    <AppLayout>
      <div className="grid place-items-center h-full">
        <h1 className="text-3xl font-bold text-primary">Welcome to Quixlit</h1>
      </div>
    </AppLayout>
  );
}`,

  'Button.tsx': `"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          "retro-btn",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === 'primary',
            "bg-secondary text-secondary-foreground hover:bg-secondary/90": variant === 'secondary',
            "bg-accent text-accent-foreground hover:bg-accent/90": variant === 'accent',
            "bg-transparent hover:bg-muted": variant === 'ghost',
            "px-2 py-1 text-sm": size === 'sm',
            "px-4 py-2": size === 'md',
            "px-6 py-3 text-lg": size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };`,

  'helpers.ts': `/**
 * Utility functions for the application
 */

/**
 * Formats a date object into a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}`,

  'package.json': `{
  "name": "quixlit",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}`,
};

// Detect language based on file extension
function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    py: 'python',
    rs: 'rust',
    go: 'go',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    sh: 'shell',
    sql: 'sql',
    yaml: 'yaml',
    yml: 'yaml'
  };
  
  return languageMap[ext] || 'plaintext';
}

export class FileSystemService {
  // In browser mode, this will use mock data or localStorage
  // When converted to Tauri, this will use actual file system APIs
  
  async listDirectory(path: string): Promise<FileSystemItem[]> {
    // Mock implementation for now
    // We'll simulate a file structure based on our mock files
    
    const items: FileSystemItem[] = [
      { name: 'README.md', path: `${path}/README.md`, type: 'file', size: 250, modifiedTime: new Date(), language: 'markdown' },
      { name: 'src', path: `${path}/src`, type: 'directory', children: [] },
      { name: 'package.json', path: `${path}/package.json`, type: 'file', size: 180, modifiedTime: new Date(), language: 'json' },
      { name: 'public', path: `${path}/public`, type: 'directory', children: [] },
    ];
    
    // Add children to src directory
    const srcDir = items.find(item => item.name === 'src');
    if (srcDir && srcDir.children) {
      srcDir.children = [
        { name: 'app.tsx', path: `${srcDir.path}/app.tsx`, type: 'file', size: 300, modifiedTime: new Date(), language: 'typescript' },
        { name: 'components', path: `${srcDir.path}/components`, type: 'directory', children: [] },
        { name: 'utils', path: `${srcDir.path}/utils`, type: 'directory', children: [] }
      ];
      
      // Add children to components directory
      const componentsDir = srcDir.children.find(item => item.name === 'components');
      if (componentsDir && componentsDir.children) {
        componentsDir.children = [
          { name: 'Button.tsx', path: `${componentsDir.path}/Button.tsx`, type: 'file', size: 850, modifiedTime: new Date(), language: 'typescript' },
          { name: 'Dialog.tsx', path: `${componentsDir.path}/Dialog.tsx`, type: 'file', size: 1200, modifiedTime: new Date(), language: 'typescript' },
        ];
      }
      
      // Add children to utils directory
      const utilsDir = srcDir.children.find(item => item.name === 'utils');
      if (utilsDir && utilsDir.children) {
        utilsDir.children = [
          { name: 'helpers.ts', path: `${utilsDir.path}/helpers.ts`, type: 'file', size: 500, modifiedTime: new Date(), language: 'typescript' },
        ];
      }
    }
    
    // Only return the top level of the requested directory
    if (path.includes('/src')) {
      return srcDir?.children || [];
    } else if (path.includes('/src/components')) {
      const componentsDir = srcDir?.children?.find(item => item.name === 'components');
      return componentsDir?.children || [];
    } else if (path.includes('/src/utils')) {
      const utilsDir = srcDir?.children?.find(item => item.name === 'utils');
      return utilsDir?.children || [];
    }
    
    return items;
  }
  
  async readFile(path: string): Promise<string> {
    // Extract filename from path
    const filename = path.split('/').pop() || '';
    
    // Return mock content if available, otherwise return placeholder
    if (mockFileContents[filename]) {
      return Promise.resolve(mockFileContents[filename]);
    }
    
    return Promise.resolve(`// File ${filename} content placeholder`);
  }
  
  async writeFile(path: string, content: string): Promise<void> {
    // In a real app, this would write to the file system
    // For now, we'll just log it
    console.log(`[Mock] Writing to ${path}:`, content);
    
    // Update our mock file contents
    const filename = path.split('/').pop() || '';
    if (filename) {
      // Update mock content (would be persistent in a real app)
      mockFileContents[filename] = content;
    }
    
    return Promise.resolve();
  }
  
  async createDirectory(path: string): Promise<void> {
    // Mock implementation
    console.log(`[Mock] Creating directory at ${path}`);
    return Promise.resolve();
  }
  
  async deleteItem(path: string): Promise<void> {
    // Mock implementation
    console.log(`[Mock] Deleting ${path}`);
    return Promise.resolve();
  }
  
  async renameItem(oldPath: string, newPath: string): Promise<void> {
    // Mock implementation
    console.log(`[Mock] Renaming ${oldPath} to ${newPath}`);
    return Promise.resolve();
  }
  
  getLanguageFromFilename(filename: string): string {
    return getLanguageFromFilename(filename);
  }
}

// Create singleton instance
export const fileSystem = new FileSystemService();

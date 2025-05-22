"use client";

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FileSystemService, FileSystemItem, fileSystem } from '@/services/FileSystemService';
import { Folder, FilePlus, FolderPlus, Trash2, RefreshCw, FileText, FileCode, FileJson, Coffee, Image } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface RetroFileExplorerProps {
  rootPath?: string;
  onFileSelect: (file: FileSystemItem) => void;
  className?: string;
}

export function RetroFileExplorer({ 
  rootPath = '/project', 
  onFileSelect, 
  className
}: RetroFileExplorerProps) {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDirectory(rootPath);
  }, [rootPath]);

  const loadDirectory = async (path: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const files = await fileSystem.listDirectory(path);
      setItems(files);
    } catch (err) {
      console.error('Failed to load directory:', err);
      setError('Failed to load directory structure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'directory') {
      // Toggle folder expansion
      setExpandedFolders(prev => ({
        ...prev,
        [item.path]: !prev[item.path]
      }));

      // If folder is being expanded, load its contents
      if (!expandedFolders[item.path]) {
        loadSubDirectory(item.path);
      }
    } else {
      // Select file
      setSelectedFile(item.path);
      onFileSelect(item);
    }
  };

  const loadSubDirectory = async (path: string) => {
    // This would load real subdirectory in Tauri implementation
    // For now, we'll just use our mock implementation
    console.log('Loading subdirectory:', path);
  };

  // Get appropriate icon based on file type or extension
  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === 'directory') {
      return <Folder size={16} className="text-primary" />;
    }

    const extension = item.name.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts':
        return <FileCode size={16} className="text-accent" />;
      case 'json':
        return <FileJson size={16} className="text-yellow-400" />;
      case 'md':
        return <FileText size={16} className="text-blue-400" />;
      case 'jpg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'ico':
        return <Image size={16} className="text-green-400" />;
      case 'java':
        return <Coffee size={16} className="text-red-400" />;
      default:
        return <FileText size={16} className="text-muted-foreground" />;
    }
  };

  // Render file explorer item with appropriate indentation and icons
  const renderItem = (item: FileSystemItem, index: number) => {
    const isExpanded = expandedFolders[item.path];
    const isDirectory = item.type === 'directory';
    const isSelected = selectedFile === item.path;
    
    return (
      <li
        key={`${item.path}-${index}`}
        className={cn(
          "text-sm text-foreground cursor-pointer p-1 select-none truncate flex items-center",
          "border border-transparent",
          "hover:bg-muted/60 hover:border-[hsl(var(--border))]",
          "active:bg-muted active:border-[hsl(var(--border-dark))] active:shadow-inner",
          isSelected && !isDirectory ? "bg-secondary/50 border-[hsl(var(--border))]" : "",
          isDirectory ? "font-medium" : ""
        )}
        onClick={() => handleItemClick(item)}
        title={item.name}
      >
        <span className="mr-1.5">{getFileIcon(item)}</span>
        {item.name}
      </li>
    );
  };

  // Toolbar for file operations
  const renderToolbar = () => (
    <div className="flex justify-between items-center p-1 border-b border-[hsl(var(--border-dark))] bg-card text-xs">
      <div className="flex space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="p-1 hover:bg-muted rounded border border-transparent hover:border-[hsl(var(--border))]" 
              onClick={() => loadDirectory(rootPath)}
              aria-label="Refresh"
            >
              <RefreshCw size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Refresh</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="p-1 hover:bg-muted rounded border border-transparent hover:border-[hsl(var(--border))]" 
              onClick={() => console.log('New file (not implemented)')}
              aria-label="New File"
            >
              <FilePlus size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>New File</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              className="p-1 hover:bg-muted rounded border border-transparent hover:border-[hsl(var(--border))]" 
              onClick={() => console.log('New folder (not implemented)')}
              aria-label="New Folder"
            >
              <FolderPlus size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>New Folder</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div>
        {selectedFile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-1 hover:bg-muted rounded border border-transparent hover:border-[hsl(var(--border))] text-destructive" 
                onClick={() => console.log('Delete (not implemented)')}
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {renderToolbar()}
      
      <ScrollArea className="flex-grow">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            <span className="inline-block animate-pulse">Loading files...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive text-sm">
            {error}
          </div>
        ) : (
          <ul className="p-2 space-y-0.5">
            {items.map((item, index) => renderItem(item, index))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}

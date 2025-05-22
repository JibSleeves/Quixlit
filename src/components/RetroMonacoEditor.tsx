"use client";

import { useRef, useEffect } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface RetroMonacoEditorProps {
  value: string;
  language: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
  options?: Record<string, any>;
}

export function RetroMonacoEditor({
  value,
  language,
  onChange,
  readOnly = false,
  height = "100%",
  className,
  options = {},
}: RetroMonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Apply retro font and styling
    monaco.editor.defineTheme('retroTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#559955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#9cdcfe', fontStyle: 'bold' },
        { token: 'string', foreground: '#ce9178' },
        { token: 'number', foreground: '#b5cea8' },
        { token: 'operator', foreground: '#d4d4d4' },
        { token: 'function', foreground: '#dcdcaa' },
        { token: 'type', foreground: '#4ec9b0' },
        { token: 'variable', foreground: '#9cdcfe' },
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#33ff33', // Classic green text
        'editorCursor.foreground': '#33ff33',
        'editor.lineHighlightBackground': '#222222',
        'editorLineNumber.foreground': '#33ff33',
        'editor.selectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#1c384e',
        'editorIndentGuide.background': '#404040',
      }
    });
    
    monaco.editor.setTheme('retroTheme');
    
    // Add pixelated font styling
    editor.updateOptions({
      fontFamily: '"Courier New", monospace', // We'll use Courier New as a fallback until we add custom fonts
      fontSize: 14,
      lineHeight: 18,
      cursorBlinking: 'phase',
      cursorWidth: 2,
    });
  };

  return (
    <div className={cn("retro-monaco-container", className)}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          readOnly,
          cursorBlinking: 'phase',
          cursorWidth: 2,
          ...options
        }}
        onMount={handleEditorDidMount}
        className="retro-monaco-editor"
      />
    </div>
  );
}

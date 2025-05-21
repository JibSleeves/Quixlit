
"use client";

import { useState, type FormEvent } from 'react';
import { RetroWindow } from '@/components/RetroWindow';
import { RetroButton } from '@/components/RetroButton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DefragmenterAnimation } from '@/components/DefragmenterAnimation';
import { useToast } from '@/hooks/use-toast';
import { generateIndex, type GenerateIndexInput } from '@/ai/flows/generate-index';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info } from 'lucide-react';

interface CodeIndexerProps {
  onIndexGenerated: (index: string) => void;
}

export function CodeIndexer({ onIndexGenerated }: CodeIndexerProps) {
  const [codebaseDescription, setCodebaseDescription] = useState('');
  const [generatedIndex, setGeneratedIndex] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!codebaseDescription.trim()) {
      setError('Codebase description cannot be empty.');
      toast({ title: "Error", description: "Codebase description cannot be empty.", variant: "destructive" });
      return;
    }
    setError(null);
    setIsIndexing(true);
    setGeneratedIndex('');

    try {
      const input: GenerateIndexInput = { codebaseDescription };
      const result = await generateIndex(input);
      setGeneratedIndex(result.index);
      onIndexGenerated(result.index);
      toast({ title: "Success", description: "Codebase index generated successfully!" });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate index: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to generate index: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <RetroWindow title="Codebase Indexer v1.0" className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
        <div>
          <Label htmlFor="codebaseDescription" className="block mb-1 text-sm font-medium text-foreground">
            Enter Codebase Description:
          </Label>
          <Textarea
            id="codebaseDescription"
            value={codebaseDescription}
            onChange={(e) => setCodebaseDescription(e.target.value)}
            placeholder="e.g., A Next.js app with TypeScript, Tailwind CSS, and Firebase integration for a to-do list..."
            rows={4}
            className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary min-h-[80px]"
            disabled={isIndexing}
          />
        </div>

        <RetroButton type="submit" disabled={isIndexing} variant="primary" className="w-full">
          {isIndexing ? 'Indexing Codebase...' : 'Generate Index'}
        </RetroButton>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      <DefragmenterAnimation isIndexing={isIndexing} />

      {!isIndexing && !generatedIndex && !error && (
        <div className="mt-4 flex flex-col items-center justify-center flex-grow text-muted-foreground text-center">
          <Info className="h-8 w-8 text-muted-foreground mb-2" />
          <p>Describe your codebase above to generate an index.</p>
          <p className="text-xs">This index will power the AI Code Assistant.</p>
        </div>
      )}
      
      {generatedIndex && !isIndexing && (
        <div className="mt-4 flex-grow flex flex-col min-h-0">
          <h3 className="text-md font-semibold text-accent">Generated Index:</h3>
          <ScrollArea className="flex-grow mt-1 p-2 border border-[hsl(var(--border-dark))] bg-input min-h-[100px] max-h-[150px]">
            <Textarea 
                value={generatedIndex} 
                readOnly 
                className="text-xs whitespace-pre-wrap break-all w-full h-full bg-input text-foreground border-0 focus:ring-0 resize-none font-mono"
                aria-label="Generated codebase index"
            />
          </ScrollArea>
        </div>
      )}
    </RetroWindow>
  );
}

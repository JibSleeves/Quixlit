"use client";

import { useState, type FormEvent } from 'react';
import { RetroWindow } from '@/components/RetroWindow';
import { RetroButton } from '@/components/RetroButton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { askAboutCodebase, type AskAboutCodebaseInput } from '@/ai/flows/codebase-aware-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeAssistantProps {
  codebaseIndex: string | null;
}

export function CodeAssistant({ codebaseIndex }: CodeAssistantProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) {
      setError('Question cannot be empty.');
      toast({ title: "Error", description: "Question cannot be empty.", variant: "destructive" });
      return;
    }
    if (!codebaseIndex) {
      setError('Codebase index is not available. Please generate an index first.');
      toast({ title: "Error", description: "Codebase index is not available. Please generate an index first.", variant: "destructive" });
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnswer('');

    try {
      const input: AskAboutCodebaseInput = { question, codebaseIndex };
      const result = await askAboutCodebase(input);
      setAnswer(result.answer);
      toast({ title: "Success", description: "Answer received!" });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to get answer: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to get answer: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RetroWindow title="AI Code Assistant 2000" className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
        <div>
          <Label htmlFor="question" className="block mb-1 text-sm font-medium text-foreground">
            Ask about your codebase:
          </Label>
          <Input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How is authentication handled?"
            className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary"
            disabled={isLoading || !codebaseIndex}
          />
        </div>

        <RetroButton type="submit" disabled={isLoading || !codebaseIndex} variant="accent" className="w-full">
          {isLoading ? 'Thinking...' : 'Ask Assistant'}
        </RetroButton>

        {!codebaseIndex && <p className="text-sm text-muted-foreground">Please generate a codebase index first to enable the assistant.</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
      
      {answer && (
        <div className="mt-4 flex-grow flex flex-col">
          <h3 className="text-md font-semibold text-primary">Assistant's Answer:</h3>
          <ScrollArea className="h-48 flex-grow mt-1 p-2 border border-[hsl(var(--border-dark))] bg-input">
             <Textarea
                value={answer}
                readOnly
                rows={8}
                className="w-full bg-input text-foreground border-0 focus:ring-0 resize-none"
             />
          </ScrollArea>
        </div>
      )}
    </RetroWindow>
  );
}

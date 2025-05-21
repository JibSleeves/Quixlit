
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
import { Loader2 } from 'lucide-react'; // Import a loader icon

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
    setAnswer(''); // Clear previous answer

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
      <form onSubmit={handleSubmit} className="space-y-4">
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            'Ask Assistant'
          )}
        </RetroButton>

        {!codebaseIndex && !isLoading && <p className="text-sm text-muted-foreground">Please generate a codebase index first to enable the assistant.</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
      
      <div className="mt-4 flex-grow flex flex-col min-h-0">
        {isLoading && !answer && (
          <div className="flex items-center justify-center flex-grow">
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p>Consulting the AI archives...</p>
            </div>
          </div>
        )}
        {answer && (
          <>
            <h3 className="text-md font-semibold text-primary mb-1">Assistant's Answer:</h3>
            <ScrollArea className="flex-grow p-2 border border-[hsl(var(--border-dark))] bg-input">
              <Textarea
                  value={answer}
                  readOnly
                  className="w-full h-full bg-input text-foreground border-0 focus:ring-0 resize-none min-h-[100px]"
                  aria-label="Assistant's answer"
              />
            </ScrollArea>
          </>
        )}
         {!isLoading && !answer && !error && codebaseIndex && (
           <div className="flex items-center justify-center flex-grow text-muted-foreground">
             <p>Ask a question to get started.</p>
           </div>
         )}
      </div>
    </RetroWindow>
  );
}

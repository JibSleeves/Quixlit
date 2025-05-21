
"use client";

import { useState, type FormEvent } from 'react';
import { RetroWindow } from '@/components/RetroWindow';
import { RetroButton } from '@/components/RetroButton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { refactorCode, type RefactorCodeInput, type RefactorCodeOutput } from '@/ai/flows/refactor-code-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Wand2 } from 'lucide-react'; // Import loader and an icon for refactoring

export function CodeRefactorer() {
  const [originalCode, setOriginalCode] = useState('');
  const [instruction, setInstruction] = useState('');
  const [refactoredResult, setRefactoredResult] = useState<RefactorCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!originalCode.trim()) {
      setError('Original code cannot be empty.');
      toast({ title: "Error", description: "Original code cannot be empty.", variant: "destructive" });
      return;
    }
    if (!instruction.trim()) {
      setError('Refactoring instruction cannot be empty.');
      toast({ title: "Error", description: "Refactoring instruction cannot be empty.", variant: "destructive" });
      return;
    }
    setError(null);
    setIsLoading(true);
    setRefactoredResult(null);

    try {
      const input: RefactorCodeInput = { codeToRefactor: originalCode, refactoringInstruction: instruction };
      const result = await refactorCode(input);
      setRefactoredResult(result);
      toast({ title: "Success", description: "Code refactored successfully!" });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to refactor code: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to refactor code: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RetroWindow title="AI Code Refactorer Wizard" className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="originalCode" className="block mb-1 text-sm font-medium text-foreground">
            Original Code:
          </Label>
          <Textarea
            id="originalCode"
            value={originalCode}
            onChange={(e) => setOriginalCode(e.target.value)}
            placeholder="Paste your code snippet here..."
            rows={6}
            className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary min-h-[100px] font-mono text-xs"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="instruction" className="block mb-1 text-sm font-medium text-foreground">
            Refactoring Instruction:
          </Label>
          <Input
            id="instruction"
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., Convert to async/await, add JSDoc comments"
            className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <RetroButton type="submit" disabled={isLoading} variant="accent" className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refactoring...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Refactor Code
            </>
          )}
        </RetroButton>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
      
      <div className="mt-4 flex-grow flex flex-col min-h-0">
        {isLoading && !refactoredResult && (
          <div className="flex items-center justify-center flex-grow">
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p>AI is conjuring improvements...</p>
            </div>
          </div>
        )}
        {refactoredResult && (
          <>
            <h3 className="text-md font-semibold text-primary mb-1">Refactored Code:</h3>
            <ScrollArea className="flex-grow p-2 border border-[hsl(var(--border-dark))] bg-input mb-2">
              <Textarea
                  value={refactoredResult.refactoredCode}
                  readOnly
                  className="w-full h-full bg-input text-foreground border-0 focus:ring-0 resize-none min-h-[100px] font-mono text-xs"
                  aria-label="Refactored code"
              />
            </ScrollArea>
            {refactoredResult.explanation && (
                <>
                <h4 className="text-sm font-semibold text-accent mb-1">Explanation:</h4>
                <ScrollArea className="h-20 p-2 border border-[hsl(var(--border-dark))] bg-input">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{refactoredResult.explanation}</p>
                </ScrollArea>
                </>
            )}
          </>
        )}
         {!isLoading && !refactoredResult && !error && (
           <div className="flex items-center justify-center flex-grow text-muted-foreground">
             <p>Enter code and instructions to start refactoring.</p>
           </div>
         )}
      </div>
    </RetroWindow>
  );
}


"use client";

import { useState, type FormEvent } from 'react';
import { RetroWindow } from '@/components/RetroWindow';
import { RetroButton } from '@/components/RetroButton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateCodeFromPrompt, type GenerateCodeFromPromptInput, type GenerateCodeFromPromptOutput } from '@/ai/flows/generate-code-from-prompt-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Sparkles, Wand } from 'lucide-react';

export function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('');
  const [currentCodeContext, setCurrentCodeContext] = useState('');
  const [generatedResult, setGeneratedResult] = useState<GenerateCodeFromPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      toast({ title: "Error", description: "Prompt cannot be empty.", variant: "destructive" });
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedResult(null);

    try {
      const input: GenerateCodeFromPromptInput = { 
        prompt, 
        language: language || undefined,
        currentCodeContext: currentCodeContext || undefined,
      };
      const result = await generateCodeFromPrompt(input);
      setGeneratedResult(result);
      toast({ title: "Success", description: `Code generated in ${result.languageUsed}!` });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate code: ${errorMessage}`);
      toast({ title: "Error", description: `Failed to generate code: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RetroWindow title="AI CodeGen Pro" className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-3 flex-grow flex flex-col">
        <div className="flex-grow flex flex-col space-y-3">
          <div>
            <Label htmlFor="codePrompt" className="block mb-1 text-sm font-medium text-foreground">
              Describe the code to generate:
            </Label>
            <Textarea
              id="codePrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A Python function to sort a list of dictionaries by a specific key."
              rows={2} // Reduced rows for prompt
              className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary min-h-[40px] text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="currentCodeContext" className="block mb-1 text-sm font-medium text-foreground">
              Current Code Context (optional):
            </Label>
            <Textarea
              id="currentCodeContext"
              value={currentCodeContext}
              onChange={(e) => setCurrentCodeContext(e.target.value)}
              placeholder="Paste existing code here if the new code should integrate with it."
              rows={3} // Reduced rows for context
              className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary min-h-[60px] text-sm font-mono"
              disabled={isLoading}
            />
          </div>
        
          <div>
            <Label htmlFor="language" className="block mb-1 text-sm font-medium text-foreground">
              Preferred Language (optional):
            </Label>
            <Input
              id="language"
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g., JavaScript, Python"
              className="w-full bg-input text-foreground border-[hsl(var(--border))] focus:border-primary text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-auto"> {/* Pushes button to bottom if form grows */}
          <RetroButton type="submit" disabled={isLoading} variant="primary" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Code
              </>
            )}
          </RetroButton>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      </form>
      
      <div className="mt-4 flex-grow flex flex-col min-h-0">
        {isLoading && !generatedResult && (
          <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>AI is drafting your code...</p>
          </div>
        )}
        {generatedResult && !isLoading && (
          <>
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-md font-semibold text-primary">Generated Code:</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 border border-border-dark rounded">
                    Language: {generatedResult.languageUsed}
                </span>
            </div>
            <ScrollArea className="flex-grow p-2 border border-[hsl(var(--border-dark))] bg-input mb-2 min-h-[80px] max-h-[150px]">
              <Textarea
                  value={generatedResult.generatedCode}
                  readOnly
                  className="w-full h-full bg-input text-foreground border-0 focus:ring-0 resize-none font-mono text-xs"
                  aria-label="Generated code"
              />
            </ScrollArea>
            {generatedResult.explanation && (
                <>
                <h4 className="text-sm font-semibold text-accent mb-1">Explanation:</h4>
                <ScrollArea className="h-[60px] p-2 border border-[hsl(var(--border-dark))] bg-input">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{generatedResult.explanation}</p>
                </ScrollArea>
                </>
            )}
          </>
        )}
         {!isLoading && !generatedResult && !error && (
           <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground">
             <Wand className="h-8 w-8 text-muted-foreground mb-2" />
             <p>Describe the code you want to generate.</p>
             <p className="text-xs">Optionally, provide context and language.</p>
           </div>
         )}
      </div>
    </RetroWindow>
  );
}

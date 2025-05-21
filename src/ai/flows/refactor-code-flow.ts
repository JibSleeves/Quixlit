
'use server';
/**
 * @fileOverview An AI agent that refactors code based on user instructions.
 *
 * - refactorCode - A function that handles the code refactoring process.
 * - RefactorCodeInput - The input type for the refactorCode function.
 * - RefactorCodeOutput - The return type for the refactorCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefactorCodeInputSchema = z.object({
  codeToRefactor: z.string().describe('The source code snippet to be refactored.'),
  refactoringInstruction: z.string().describe('A natural language instruction describing the desired refactoring (e.g., "convert to arrow functions", "add try-catch blocks", "improve readability").'),
});
export type RefactorCodeInput = z.infer<typeof RefactorCodeInputSchema>;

const RefactorCodeOutputSchema = z.object({
  refactoredCode: z.string().describe('The refactored code snippet.'),
  explanation: z.string().optional().describe('An optional explanation of the changes made during refactoring.'),
});
export type RefactorCodeOutput = z.infer<typeof RefactorCodeOutputSchema>;

export async function refactorCode(input: RefactorCodeInput): Promise<RefactorCodeOutput> {
  return refactorCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refactorCodePrompt',
  input: {schema: RefactorCodeInputSchema},
  output: {schema: RefactorCodeOutputSchema},
  prompt: `You are an expert software engineer specializing in code refactoring and optimization.
You will be given a piece of source code and an instruction on how to refactor it.
Apply the refactoring instruction to the best of your ability, ensuring the code remains functional and adheres to best practices.
If possible, provide a brief explanation of the changes you made.

Original Code:
\`\`\`
{{{codeToRefactor}}}
\`\`\`

Refactoring Instruction:
{{{refactoringInstruction}}}

Provide the refactored code and an optional explanation.
`,
});

const refactorCodeFlow = ai.defineFlow(
  {
    name: 'refactorCodeFlow',
    inputSchema: RefactorCodeInputSchema,
    outputSchema: RefactorCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';
/**
 * @fileOverview An AI agent that generates code from natural language prompts.
 *
 * - generateCodeFromPrompt - A function that handles the code generation process.
 * - GenerateCodeFromPromptInput - The input type for the generateCodeFromPrompt function.
 * - GenerateCodeFromPromptOutput - The return type for the generateCodeFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeFromPromptInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the program or code snippet to generate.'),
  language: z.string().optional().describe('The preferred programming language (e.g., "TypeScript", "Python"). If not specified, the AI will choose a suitable language based on the prompt.'),
});
export type GenerateCodeFromPromptInput = z.infer<typeof GenerateCodeFromPromptInputSchema>;

const GenerateCodeFromPromptOutputSchema = z.object({
  generatedCode: z.string().describe('The generated code snippet or program.'),
  languageUsed: z.string().describe('The programming language of the generated code.'),
  explanation: z.string().optional().describe('An optional explanation of the generated code.'),
});
export type GenerateCodeFromPromptOutput = z.infer<typeof GenerateCodeFromPromptOutputSchema>;

export async function generateCodeFromPrompt(input: GenerateCodeFromPromptInput): Promise<GenerateCodeFromPromptOutput> {
  return generateCodeFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeFromPromptPrompt',
  input: {schema: GenerateCodeFromPromptInputSchema},
  output: {schema: GenerateCodeFromPromptOutputSchema},
  prompt: `You are an expert software engineer and AI assistant.
Your task is to generate a functional code snippet or a small program based on the user's natural language prompt.
Ensure the generated code is complete, runnable where appropriate, and adheres to best practices for the chosen language.

User Prompt:
{{{prompt}}}

{{#if language}}
Preferred Language: {{{language}}}
Consider this preferred language. If the prompt implies a different language or context, you may choose the most suitable one and state it in 'languageUsed'.
{{else}}
No specific language preferred. Choose the most appropriate language based on the prompt and state it in 'languageUsed'.
{{/if}}

Generate the code and provide an optional explanation.
Focus on generating the code for the core request. Avoid creating full HTML pages or extensive boilerplate unless specifically asked.
For example, if asked for "a React component that displays a button", generate the JSX and JavaScript for the component, not an entire HTML document with React setup.
`,
});

const generateCodeFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCodeFromPromptFlow',
    inputSchema: GenerateCodeFromPromptInputSchema,
    outputSchema: GenerateCodeFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure languageUsed is set, defaulting if necessary
    if (output && !output.languageUsed) {
        output.languageUsed = input.language || "unknown";
    }
    return output!;
  }
);


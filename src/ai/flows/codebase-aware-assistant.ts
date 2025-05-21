'use server';

/**
 * @fileOverview An AI agent that answers questions about the codebase using an index.
 *
 * - askAboutCodebase - A function that handles the process of asking questions about the codebase.
 * - AskAboutCodebaseInput - The input type for the askAboutCodebase function.
 * - AskAboutCodebaseOutput - The return type for the askAboutCodebase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAboutCodebaseInputSchema = z.object({
  question: z.string().describe('The question about the codebase.'),
  codebaseIndex: z.string().describe('The index of the codebase.'),
});
export type AskAboutCodebaseInput = z.infer<typeof AskAboutCodebaseInputSchema>;

const AskAboutCodebaseOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the codebase.'),
});
export type AskAboutCodebaseOutput = z.infer<typeof AskAboutCodebaseOutputSchema>;

export async function askAboutCodebase(input: AskAboutCodebaseInput): Promise<AskAboutCodebaseOutput> {
  return askAboutCodebaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAboutCodebasePrompt',
  input: {schema: AskAboutCodebaseInputSchema},
  output: {schema: AskAboutCodebaseOutputSchema},
  prompt: `You are an AI assistant that answers questions about a codebase.

  Use the following codebase index to answer the question.

  Codebase Index: {{{codebaseIndex}}}

  Question: {{{question}}}
  Answer: `,
});

const askAboutCodebaseFlow = ai.defineFlow(
  {
    name: 'askAboutCodebaseFlow',
    inputSchema: AskAboutCodebaseInputSchema,
    outputSchema: AskAboutCodebaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

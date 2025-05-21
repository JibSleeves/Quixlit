'use server';

/**
 * @fileOverview Generates an index of the codebase for codebase-aware AI assistance.
 *
 * - generateIndex - A function that handles the codebase indexing process.
 * - GenerateIndexInput - The input type for the generateIndex function.
 * - GenerateIndexOutput - The return type for the generateIndex function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIndexInputSchema = z.object({
  codebaseDescription: z
    .string()
    .describe('A description of the codebase to be indexed.'),
});
export type GenerateIndexInput = z.infer<typeof GenerateIndexInputSchema>;

const GenerateIndexOutputSchema = z.object({
  index: z
    .string()
    .describe('The generated index of the codebase.'),
});
export type GenerateIndexOutput = z.infer<typeof GenerateIndexOutputSchema>;

export async function generateIndex(input: GenerateIndexInput): Promise<GenerateIndexOutput> {
  return generateIndexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIndexPrompt',
  input: {schema: GenerateIndexInputSchema},
  output: {schema: GenerateIndexOutputSchema},
  prompt: `You are an expert software engineer.

You will generate an index of the codebase based on the description provided.

Description: {{{codebaseDescription}}}

Index:`,
});

const generateIndexFlow = ai.defineFlow(
  {
    name: 'generateIndexFlow',
    inputSchema: GenerateIndexInputSchema,
    outputSchema: GenerateIndexOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

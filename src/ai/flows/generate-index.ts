
'use server';

/**
 * @fileOverview Generates a semantic index of the codebase for codebase-aware AI assistance.
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
    .describe('A detailed textual description of the codebase, including its main technologies, components, and functionalities. This description will be used to generate a semantic index.'),
});
export type GenerateIndexInput = z.infer<typeof GenerateIndexInputSchema>;

const GenerateIndexOutputSchema = z.object({
  index: z
    .string()
    .describe('The generated semantic index of the codebase. This should be a structured representation highlighting key entities, relationships, and functionalities based on the provided description.'),
});
export type GenerateIndexOutput = z.infer<typeof GenerateIndexOutputSchema>;

export async function generateIndex(input: GenerateIndexInput): Promise<GenerateIndexOutput> {
  return generateIndexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIndexPrompt',
  input: {schema: GenerateIndexInputSchema},
  output: {schema: GenerateIndexOutputSchema},
  prompt: `You are an expert software architect and AI assistant.
Your task is to generate a comprehensive and semantically rich index of a codebase based on the detailed description provided.
This index should not just be a summary, but a structured representation that captures:
- Key modules, components, and their primary responsibilities.
- Core functionalities and how they are likely interconnected.
- Data structures and their purposes.
- Important architectural patterns or design choices mentioned.
- Any other details that would be crucial for an AI to understand the codebase for tasks like answering questions or assisting with modifications.

Think of this index as a knowledge graph or a detailed outline that an AI can use to reason about the codebase.

Codebase Description:
{{{codebaseDescription}}}

Generate the Semantic Index:`,
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

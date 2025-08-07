
'use server';
/**
 * @fileOverview A strategy generation AI agent for small claims court.
 *
 * - generateStrategy - A function that handles the strategy generation process.
 * - GenerateStrategyInput - The input type for the generateStrategy function.
 * - GenerateStrategyOutput - The return type for the generateStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateStrategyInputSchema = z.object({
  caseDetails: z.string().describe('A detailed description of the user\'s case, including what happened, key dates, and evidence they have.'),
  desiredOutcome: z.string().describe('What the user hopes to achieve (e.g., get back a security deposit of $500, get a car repair refunded for $1200).'),
});

export type GenerateStrategyInput = z.infer<typeof GenerateStrategyInputSchema>;

const GenerateStrategyOutputSchema = z.object({
  strategy: z.string().describe('A step-by-step strategy for the user to follow. It should be clear, actionable, and formatted with markdown for readability (e.g., using headings, bold text, and lists).'),
});

export type GenerateStrategyOutput = z.infer<typeof GenerateStrategyOutputSchema>;

export async function generateStrategy(input: GenerateStrategyInput): Promise<GenerateStrategyOutput> {
  return generateStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrategyPrompt',
  input: {schema: GenerateStrategyInputSchema},
  output: {schema: GenerateStrategyOutputSchema},
  prompt: `
You are an expert legal assistant specializing in small claims court procedures. Your task is to create a clear, step-by-step strategy for a user based on their case details.

The strategy should be practical, easy to understand for a non-lawyer, and focused on actions that will increase their chances of success.

**Instructions:**
1.  **Analyze the Case:** Carefully review the user's case details and their desired outcome.
2.  **Structure the Strategy:** Organize the output into logical, numbered steps. Use markdown for formatting (e.g., # for headings, ** for bolding, and * for list items).
3.  **Key Strategy Points:** The strategy should always include steps like:
    *   Gathering and organizing specific types of evidence relevant to their case.
    *   The importance of sending a formal demand letter (if not already done).
    *   How to prepare for the court hearing (e.g., outlining their argument, preparing questions for the other party).
    *   Tips on courtroom etiquette and presentation.
4.  **Tone:** Be encouraging and empowering, but maintain a professional and objective tone.
5.  **Disclaimer:** Do not include a disclaimer in your response. The application will add it separately.

**User's Case Information:**
- **Case Details:** {{{caseDetails}}}
- **Desired Outcome:** {{{desiredOutcome}}}

Generate the step-by-step strategy now.
`,
});

const generateStrategyFlow = ai.defineFlow(
  {
    name: 'generateStrategyFlow',
    inputSchema: GenerateStrategyInputSchema,
    outputSchema: GenerateStrategyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

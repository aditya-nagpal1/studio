
'use server';
/**
 * @fileOverview An AI agent for finding court filing fees.
 *
 * - findFilingFee - A function that handles the filing fee search process.
 * - FindFilingFeeInput - The input type for the findFilingFee function.
 * - FindFilingFeeOutput - The return type for the findFilingFee function.
 */

import {ai} from '@/ai/genkit';
import {googleSearch} from '@genkit-ai/google-cloud';
import {z} from 'zod';

const FindFilingFeeInputSchema = z.object({
  courtName: z.string().describe('The full name of the court.'),
  courtAddress: z.string().describe('The full address of the court.'),
});
export type FindFilingFeeInput = z.infer<typeof FindFilingFeeInputSchema>;

const FindFilingFeeOutputSchema = z.object({
    filingFee: z.string().describe("A concise summary of the small claims court filing fee. If a definitive fee isn't available, provide a general estimate or a 'Not Found' message."),
    source: z.string().describe("The direct URL to the official court or government webpage where the filing fee information was found. If no source was found, this can be empty."),
});
export type FindFilingFeeOutput = z.infer<typeof FindFilingFeeOutputSchema>;

export async function findFilingFee(input: FindFilingFeeInput): Promise<FindFilingFeeOutput> {
  return findFilingFeeFlow(input);
}

const prompt = ai.definePrompt({
    name: 'findFilingFeePrompt',
    input: {schema: FindFilingFeeInputSchema},
    output: {schema: FindFilingFeeOutputSchema},
    tools: [googleSearch],
    prompt: `
You are a specialized legal research assistant. Your task is to find the official small claims court filing fee for a specific courthouse.

**Instructions:**
1.  Use the provided court name and address to conduct a web search.
2.  Prioritize official court or government websites (.gov domains) to ensure accuracy.
3.  Locate the specific fee for filing a *small claims* case. Fees often vary by the amount of the claim, so note that if possible.
4.  If you cannot find a specific fee, state that clearly. Do not invent a number.
5.  Provide a direct URL to the source page where you found the information.

**Court Information:**
-   Court Name: {{{courtName}}}
-   Court Address: {{{courtAddress}}}

Find the small claims filing fee now.
`,
});

const findFilingFeeFlow = ai.defineFlow(
  {
    name: 'findFilingFeeFlow',
    inputSchema: FindFilingFeeInputSchema,
    outputSchema: FindFilingFeeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

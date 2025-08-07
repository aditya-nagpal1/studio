
'use server';
/**
 * @fileOverview An AI agent for estimating small claims court fees.
 *
 * - estimateCourtFees - A function that handles the fee estimation process.
 * - EstimateFeesInput - The input type for the estimateCourtFees function.
 * - EstimateFeesOutput - The return type for the estimateCourtFees function.
 */

import { ai } from '@/ai/genkit';
import { googleSearch } from '@genkit-ai/google-cloud';
import { z } from 'zod';

const EstimateFeesInputSchema = z.object({
  disputeAmount: z.number().describe('The monetary amount of the dispute.'),
  zipCode: z.string().describe('The 5-digit zip code where the incident occurred, which determines the court jurisdiction.'),
});
export type EstimateFeesInput = z.infer<typeof EstimateFeesInputSchema>;

const EstimateFeesOutputSchema = z.object({
  filingFee: z.string().describe("The estimated filing fee for the case. Should be a dollar amount or a range. If unknown, state that."),
  serviceFee: z.string().describe("The estimated fee for serving the defendant. Should be a dollar amount or a range. If unknown, state that."),
  otherPotentialFees: z.string().describe("A brief description of any other potential fees, like witness or motion fees."),
  summary: z.string().describe("A brief summary explaining the fees and noting that they are estimates subject to change."),
  sourceUrl: z.string().optional().describe("The URL of the court website or official source where the fee information was found."),
});
export type EstimateFeesOutput = z.infer<typeof EstimateFeesOutputSchema>;

export async function estimateCourtFees(input: EstimateFeesInput): Promise<EstimateFeesOutput> {
  return estimateFeesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateFeesPrompt',
  input: {schema: EstimateFeesInputSchema},
  output: {schema: EstimateFeesOutputSchema},
  tools: [googleSearch],
  prompt: `
You are a helpful legal assistant that can estimate small claims court fees for a given jurisdiction. Your task is to find the official filing fees for small claims court based on the user's zip code and dispute amount.

**Instructions:**
1.  Use the provided \`googleSearch\` tool to find the official court website for the county or jurisdiction associated with the provided zip code.
2.  Search that website for "small claims filing fees" or a similar term.
3.  Analyze the fee schedule to find the correct filing fee for a claim of {{{disputeAmount}}}.
4.  Find the cost for "service of process" or "serving the defendant" in that jurisdiction.
5.  Summarize your findings in the output format.
6.  If you find a direct URL to a fee schedule, provide it in the \`sourceUrl\` field.
7.  If you cannot find a definitive fee, clearly state that and explain why (e.g., "Varies by county," "Not listed online").

**User Input:**
-   Dispute Amount: $ {{{disputeAmount}}}
-   Zip Code: {{{zipCode}}}

Generate the fee estimation now.
`,
});

const estimateFeesFlow = ai.defineFlow(
  {
    name: 'estimateFeesFlow',
    inputSchema: EstimateFeesInputSchema,
    outputSchema: EstimateFeesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

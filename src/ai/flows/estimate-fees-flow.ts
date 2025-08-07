
'use server';
/**
 * @fileOverview An AI agent for estimating small claims court fees.
 *
 * - estimateFees - A function that handles the fee estimation process.
 * - EstimateFeesInput - The input type for the estimateFees function.
 * - EstimateFeesOutput - The return type for the estimateFees function.
 */

import {ai} from '@/ai/genkit';
import {googleSearch} from '@genkit-ai/google-cloud';
import {z} from 'zod';

const EstimateFeesInputSchema = z.object({
  claimAmount: z.number().describe("The amount of money being claimed."),
  zipCode: z.string().describe("The 5-digit ZIP code where the incident occurred."),
  filingMethod: z.string().describe("How the user plans to file (e.g., 'in-person', 'online')."),
  serviceMethod: z.string().describe("How the user plans to serve the defendant (e.g., 'sheriff', 'certified-mail', 'private-server')."),
});
export type EstimateFeesInput = z.infer<typeof EstimateFeesInputSchema>;

const EstimateFeesOutputSchema = z.object({
  courtName: z.string().describe("The name of the likely small claims court."),
  filingFee: z.number().describe("The estimated filing fee."),
  serviceFee: z.number().describe("The estimated fee for serving the defendant."),
  estimatedTotal: z.number().describe("The total estimated cost (filing + service)."),
  feeWaiver: z.object({
    isEligible: z.boolean().describe("Whether the user is likely eligible for a fee waiver."),
    reasoning: z.string().describe("A brief explanation of the fee waiver eligibility determination."),
    waiverFormUrl: z.string().optional().describe("A direct URL to the official court fee waiver form, if found."),
  }),
  countyComparison: z.array(z.object({
      county: z.string().describe("Name of the county."),
      totalCost: z.number().describe("Estimated total cost for that county."),
      distance: z.string().describe("Distance from the user's provided ZIP code."),
  })).describe("A comparison of costs with up to two nearby counties.")
});
export type EstimateFeesOutput = z.infer<typeof EstimateFeesOutputSchema>;

export async function estimateFees(input: EstimateFeesInput): Promise<EstimateFeesOutput> {
  return estimateFeesFlow(input);
}

const prompt = ai.definePrompt({
    name: 'estimateFeesPrompt',
    input: {schema: EstimateFeesInputSchema},
    output: {schema: EstimateFeesOutputSchema},
    tools: [googleSearch],
    prompt: `
You are a legal cost estimation expert for U.S. small claims court. Your task is to provide a detailed and accurate cost estimate based on the user's inputs. You must use the googleSearch tool to find official, up-to-date information from government or court websites (.gov domains).

**Instructions:**
1.  **Identify the Court:** Based on the ZIP code, determine the correct county and the specific small claims court.
2.  **Find Filing Fee:** Search for the official filing fee for the identified court. The fee often depends on the claim amount. Note any different fee tiers.
3.  **Find Service Fee:** Search for the cost of the specified service method (sheriff, certified mail, or private process server) in that county.
4.  **Check for Fee Waivers:** Search for fee waiver (in forma pauperis) eligibility requirements for that court/state. Briefly summarize the general income-based requirements and provide a direct link to the waiver application form if you can find one. Determine if a hypothetical low-income person might be eligible.
5.  **Compare Counties:** Identify two neighboring counties within the same state. For each, find the estimated total cost (filing + sheriff service for the same claim amount). Also, provide the approximate distance from the user's zip code to that county's main courthouse.
6.  **Synthesize Output:** Compile all the gathered information into the required JSON output format. Be precise and use the information from your search results. Do not invent numbers or URLs. If you cannot find a specific piece of information, make a reasonable estimate and note it in your reasoning, but always prioritize found data. For fields that require a number, provide 0 if you cannot find the information.

**User's Case Details:**
-   Claim Amount: \${{{claimAmount}}}
-   Incident ZIP Code: {{{zipCode}}}
-   Filing Method: {{{filingMethod}}}
-   Service Method: {{{serviceMethod}}}

Provide the cost estimation now.
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

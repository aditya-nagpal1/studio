
'use server';
/**
 * @fileOverview A demand letter generation AI agent.
 *
 * - generateDemandLetter - A function that handles the demand letter generation process.
 * - GenerateDemandLetterInput - The input type for the generateDemandLetter function.
 * - GenerateDemandLetterOutput - The return type for the generateDemandLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {format} from 'date-fns';

const GenerateDemandLetterInputSchema = z.object({
  yourName: z.string().describe('The name of the person sending the letter (claimant).'),
  yourAddress: z.string().describe('The full address of the claimant.'),
  defendantName: z.string().describe("The name of the person the letter is being sent to (defendant)."),
  defendantAddress: z.string().describe("The full address of the defendant."),
  disputeDescription: z.string().describe('A clear and detailed description of the dispute and what happened.'),
  amount: z.number().describe('The monetary amount being demanded.'),
  incidentDate: z.string().describe('The date the incident occurred.'),
});

export type GenerateDemandLetterInput = z.infer<typeof GenerateDemandLetterInputSchema>;

const GenerateDemandLetterOutputSchema = z.object({
  letter: z.string().describe('The full text of the generated demand letter, formatted professionally for legal use. It should follow a standard legal letter format, starting with the claimant\'s information, date, defendant\'s information, a RE: line, and then the body of the letter. The font should be standard like Times New Roman or Arial. Do not include placeholders for contact information like phone or email.'),
});

export type GenerateDemandLetterOutput = z.infer<typeof GenerateDemandLetterOutputSchema>;

export async function generateDemandLetter(input: GenerateDemandLetterInput): Promise<GenerateDemandLetterOutput> {
  return generateDemandLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDemandLetterPrompt',
  input: {schema: GenerateDemandLetterInputSchema},
  output: {schema: GenerateDemandLetterOutputSchema},
  prompt: `
You are an AI assistant creating a formal, legally-formatted demand letter.
The letter must be suitable for use in a legal setting, such as a precursor to a small claims court filing.
Generate the full text of the demand letter based on the following details.

**Claimant Information:**
Name: {{yourName}}
Address: {{yourAddress}}

**Defendant Information:**
Name: {{defendantName}}
Address: {{defendantAddress}}

**Dispute Details:**
Incident Date: {{incidentDate}}
Amount Demanded: \${{amount}}
Description of Dispute: {{disputeDescription}}

**Letter Requirements:**
1.  **Format:**
    - Start with the claimant's (your) full name and address at the top left.
    - Below that, add the current date: {{currentDate}}.
    - Below the date, add the defendant's full name and address.
    - Include a subject line, formatted as: "RE: Demand for Payment Regarding Incident on {{incidentDate}}"
2.  **Content:**
    - The opening paragraph must clearly state that this is a formal demand for payment.
    - The body must detail the claim, referencing the incident on {{incidentDate}} and the basis for the \${{amount}} demand as described in {{disputeDescription}}.
    - State a clear deadline for payment (e.g., "within 15 calendar days of the date of this letter").
    - Include a concluding paragraph that explicitly states if payment is not received by the deadline, you will pursue all available legal remedies, including but not limited to, filing a lawsuit in small claims court. Mention that they may be liable for court costs and interest.
    - This letter should be considered a final attempt to resolve this matter amicably.
3.  **Tone & Style:**
    - The tone must be serious, formal, and professional. Use clear, unambiguous language.
    - The output must be plain text, formatted to look like a standard letter printed on a physical document. Use a font style similar to Times New Roman.
4.  **No Placeholders:**
    - The generated letter must be complete and ready to send.
    - Do NOT include any placeholders like "[Your Phone Number]", "[Your Email Address]", or bracketed instructions.

Generate the letter now.
`,
});

const generateDemandLetterFlow = ai.defineFlow(
  {
    name: 'generateDemandLetterFlow',
    inputSchema: GenerateDemandLetterInputSchema,
    outputSchema: GenerateDemandLetterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt({
        ...input,
        currentDate: format(new Date(), "MMMM d, yyyy"),
    });
    return output!;
  }
);

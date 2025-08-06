
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
You are an AI assistant creating a legally-formatted demand letter.
Generate a formal demand letter with a serious, professional tone suitable for legal use.

**Claimant Information:**
Name: {{yourName}}
Address: {{yourAddress}}

**Defendant Information:**
Name: {{defendantName}}
Address: {{defendantAddress}}

**Dispute Details:**
Incident Date: {{incidentDate}}
Amount Demanded: \${{amount}}
Description: {{disputeDescription}}

**Instructions:**
1.  **Format:** Create the full letter text. Start with the claimant's address block, followed by the date, the defendant's address block, a subject line (RE:), and the letter body.
2.  **Content:** The body must state the demand for \${{amount}}, mention the incident on {{incidentDate}} related to {{disputeDescription}}, and warn of potential legal action (like small claims court) if payment is not made within 15 days.
3.  **Closing:** End with "Sincerely," and the claimant's name.
4.  **Tone & Style:** The tone must be formal. The output must be plain text, formatted to look like a standard letter printed on paper with a font like Times New Roman.
5.  **No Placeholders:** Do not include placeholders like "[Your Phone Number]" or "[Your Email Address]". Generate only the complete letter text.
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

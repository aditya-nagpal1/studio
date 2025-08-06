
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
You are a legal writing assistant experienced in drafting demand letters suitable for small claims court. Generate a professional, fully formatted demand letter to be used in a small claims case.

The letter must be complete and ready to send, with no placeholders. It should be written in a formal tone, be clear and concise, and be legally appropriate for a U.S. small claims court.

**Instructions:**
1.  **Format:** Use a standard U.S. business letter format.
2.  **Sender/Recipient:** The letter should begin with the sender's name and address, followed by the current date, and then the recipient's name and address. Integrate this information naturally into the letter's header.
3.  **Subject Line:** Include a "RE:" (Regarding) line that briefly states the purpose of the letter (e.g., "Demand for Payment for Property Damage").
4.  **Content:** The body of the letter must clearly state the facts of the dispute, reference the date of the incident, demand a specific resolution (payment of the specified amount), set a firm deadline for payment (e.g., 14 days from the date of the letter), and state the intent to pursue legal action in small claims court if the demand is not met.
5.  **Tone:** Maintain a polite but firm and professional tone throughout.
6.  **No Placeholders:** The final letter must be complete. Do not use placeholders like "[Your Name]" or "[Date]".

**Input Information:**
- Your Full Name (Claimant): {{{yourName}}}
- Your Full Address: {{{yourAddress}}}
- Defendant's Full Name: {{{defendantName}}}
- Defendant's Full Address: {{{defendantAddress}}}
- Description of Dispute: {{{disputeDescription}}}
- Amount Owed ($): {{{amount}}}
- Date of Incident: {{{incidentDate}}}
- Current Date: {{{currentDate}}}

Generate the demand letter now.
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

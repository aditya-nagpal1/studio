
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
You are a legal writing assistant experienced in drafting demand letters suitable for small claims court. Generate a professional, fully formatted demand letter to be used in a small claims case based on the information provided below. The letter should be written in a formal tone, clear and concise, legally appropriate for a U.S. small claims court, and should include the following sections:

Sender's contact information
Date
Recipient's contact information
Subject line
Salutation
Introduction and summary of the dispute
Detailed explanation of the incident, including date and what occurred
The demand (i.e., what is being requested, including amount owed)
A deadline for resolution (e.g., 14 days from the date of the letter)
Statement of intent to file a small claims case if the matter is not resolved
Closing and signature line

The final letter must be complete, with no placeholders for information like phone numbers or emails. It should be ready to be copied and used in court without any further editing.

**Input Information:**
Your Full Name: {{yourName}}
Your Full Address: {{yourAddress}}
Defendant's Full Name: {{defendantName}}
Defendant's Full Address: {{defendantAddress}}
Brief Description of Dispute: {{disputeDescription}}
Amount Owed ($): {{amount}}
Date of Incident: {{incidentDate}}
Current Date: {{currentDate}}

Generate the demand letter now in standard U.S. business letter format.
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

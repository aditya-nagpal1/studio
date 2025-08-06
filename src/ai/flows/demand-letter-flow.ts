
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
  letter: z.string().describe('The full text of the generated demand letter.'),
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
You are an AI assistant that specializes in creating legally-formatted documents. Your task is to generate a formal demand letter based on the user's input. The tone should be serious, professional, and suitable for use in a legal context. The font should be a standard, legible typeface like Times New Roman or Arial.

**Format the letter exactly as follows:**

[Your Name]
[Your Address]
{{yourName}}
{{yourAddress}}

{{currentDate}}

VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED

[Defendant's Name]
[Defendant's Address]
{{defendantName}}
{{defendantAddress}}

**RE: Formal Demand for Payment in the Amount of $
{{amount}}**

Dear {{defendantName}},

This letter serves as a formal demand for payment in the amount of $
{{amount}}. This demand arises from an incident that occurred on {{incidentDate}}, the details of which are as follows:

{{disputeDescription}}

I have made this demand in good faith in an attempt to resolve this matter without the need for litigation. You are hereby directed to remit payment in the full amount of $
{{amount}} within fifteen (15) calendar days from your receipt of this letter.

Should you fail to remit payment within the specified timeframe, I will be compelled to pursue all available legal and equitable remedies, including, but not limited to, initiating a lawsuit in small claims court. Please be advised that in the event of legal action, I will seek to recover the principal amount, as well as all associated court costs, pre-judgment interest, and any other fees permitted by law.

This letter constitutes a final attempt to resolve this matter amicably before legal proceedings are commenced. Your prompt attention to this matter is required.

You may contact me at [Your Phone Number] or [Your Email Address] to arrange for payment.

Sincerely,

_________________________
{{yourName}}
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

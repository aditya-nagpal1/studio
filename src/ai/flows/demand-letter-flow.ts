
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
  letter: z.string().describe('The full text of the generated demand letter, formatted professionally for legal use.'),
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
You are an AI assistant specializing in creating legally-formatted documents. Your task is to generate a formal demand letter based on the user's input. The tone must be serious, professional, and suitable for use in a legal context. The font should appear as a standard, legible typeface like Times New Roman or Arial when printed.

Generate the full text for the letter. Start with the claimant's information, followed by the date, the defendant's information, a subject line, and then the body of the letter. The letter should clearly state the reason for the demand, the amount owed, and the consequences of non-payment. Conclude with a closing and the claimant's name.

**Do not include placeholders like "[Your Phone Number]" or "[Your Email Address]". Generate the complete letter body.**

Here is the information provided by the user:
- Claimant Name: {{yourName}}
- Claimant Address: {{yourAddress}}
- Defendant Name: {{defendantName}}
- Defendant Address: {{defendantAddress}}
- Incident Date: {{incidentDate}}
- Amount Demanded: \${{amount}}
- Dispute Description: {{disputeDescription}}

**Here is the required structure:**

{{yourName}}
{{yourAddress}}

{{currentDate}}

VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED

{{defendantName}}
{{defendantAddress}}

**RE: Formal Demand for Payment in the Amount of \${{amount}}**

Dear {{defendantName}},

This letter serves as a formal demand for payment in the amount of \${{amount}}. This demand arises from an incident that occurred on {{incidentDate}}, concerning the following: {{disputeDescription}}.

I have made this demand in good faith to resolve this matter without resorting to litigation. You are hereby directed to remit payment in the full amount of \${{amount}} within fifteen (15) calendar days from your receipt of this letter.

Should you fail to remit payment within the specified timeframe, I will be compelled to pursue all available legal remedies, including, but not limited to, initiating a lawsuit in small claims court. In the event of legal action, I will seek to recover the principal amount, as well as all associated court costs, pre-judgment interest, and any other fees permitted by law.

This letter constitutes a final attempt to resolve this matter amicably before legal proceedings are commenced. Your prompt attention is required.

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

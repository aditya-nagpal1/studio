"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Copy, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  yourName: z.string().min(1, "Your name is required."),
  yourAddress: z.string().min(1, "Your address is required."),
  defendantName: z.string().min(1, "Defendant's name is required."),
  defendantAddress: z.string().min(1, "Defendant's address is required."),
  disputeDescription: z.string().min(20, "Please provide a detailed description (at least 20 characters)."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  incidentDate: z.string().min(1, "Incident date is required."),
});

type FormValues = z.infer<typeof formSchema>;

const generateDemandLetter = (data: FormValues): string => {
  return `
[Your Name]
[Your Address]
${data.yourName}
${data.yourAddress}

${format(new Date(), "MMMM d, yyyy")}

VIA CERTIFIED MAIL

[Defendant's Name]
[Defendant's Address]
${data.defendantName}
${data.defendantAddress}

RE: Demand for Payment in the Amount of $${data.amount.toLocaleString()}

Dear ${data.defendantName},

This letter is a formal demand for payment for the amount of $${data.amount.toLocaleString()}. This amount is owed due to an incident that occurred on ${data.incidentDate}.

The circumstances are as follows:
${data.disputeDescription}

I have made this demand in good faith to resolve this matter amicably. Please remit payment in the full amount of $${data.amount.toLocaleString()} within 15 days from the receipt of this letter.

If I do not receive payment within 15 days, I will have no choice but to pursue all available legal remedies, including filing a lawsuit in small claims court. Please be advised that in the event of legal action, I will also seek to recover court costs and any other applicable fees.

This letter constitutes a final attempt to resolve this matter before legal proceedings are initiated.

You can contact me at [Your Phone Number] or [Your Email Address] to arrange for payment.

Sincerely,

${data.yourName}
  `.trim();
};


export default function DemandLetterGenerator() {
  const [letter, setLetter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const generatedLetter = generateDemandLetter(data);
    setLetter(generatedLetter);
    setIsModalOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the letter into any text editor.",
    });
  };

  const handlePrint = () => {
    const printableArea = document.getElementById('printable-letter');
    if (printableArea) {
      const parent = printableArea.parentElement;
      if(parent) {
         parent.classList.add('printable-area');
         window.print();
         parent.classList.remove('printable-area');
      }
    }
  };

  return (
    <section id="demand-letter" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Generate Your Demand Letter</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A formal demand letter is a powerful first step. Fill out the form below to create yours in seconds.
            </p>
        </div>

        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Demand Letter Details</CardTitle>
                <CardDescription>Provide the necessary information to generate your letter.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-6">
                             <FormField control={form.control} name="yourName" render={({ field }) => (
                                <FormItem><FormLabel>Your Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={form.control} name="yourAddress" render={({ field }) => (
                                <FormItem><FormLabel>Your Full Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                           <div className="space-y-6">
                             <FormField control={form.control} name="defendantName" render={({ field }) => (
                                <FormItem><FormLabel>Defendant's Full Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={form.control} name="defendantAddress" render={({ field }) => (
                                <FormItem><FormLabel>Defendant's Full Address</FormLabel><FormControl><Input placeholder="456 Oak Ave, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                        </div>
                        <FormField control={form.control} name="disputeDescription" render={({ field }) => (
                            <FormItem><FormLabel>Brief Description of Dispute</FormLabel><FormControl><Textarea placeholder="On May 1, 2023, Jane Smith's dog dug under the fence and damaged my garden..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem><FormLabel>Amount Owed ($)</FormLabel><FormControl><Input type="number" placeholder="500" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="incidentDate" render={({ field }) => (
                                <FormItem><FormLabel>Date of Incident</FormLabel><FormControl><Input type="text" placeholder="e.g., May 1, 2023" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button type="submit" className="w-full">Generate Letter</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Your Generated Demand Letter</DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[60vh] overflow-y-auto p-4 border rounded-md" >
                                  <pre id="printable-letter" className="text-sm whitespace-pre-wrap font-body">{letter}</pre>
                                </div>
                                <DialogFooter className="sm:justify-end gap-2">
                                    <Button type="button" variant="secondary" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                                    <Button type="button" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}

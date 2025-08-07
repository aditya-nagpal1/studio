
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Copy, Download, Printer } from "lucide-react";
import jsPDF from "jspdf";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generateDemandLetter } from "@/ai/flows/demand-letter-flow";

const text = {
    title: { en: "Generate Your Demand Letter", es: "Genere su Carta de Demanda" },
    description: { en: "A formal demand letter is a powerful first step. Fill out the form below to create yours in seconds.", es: "Una carta de demanda formal es un primer paso poderoso. Complete el formulario a continuación para crear la suya en segundos." },
    cardTitle: { en: "Demand Letter Details", es: "Detalles de la Carta de Demanda" },
    cardDescription: { en: "Provide the necessary information to generate your letter.", es: "Proporcione la información necesaria para generar su carta." },
    yourName: { en: "Your Full Name", es: "Su Nombre Completo" },
    yourAddress: { en: "Your Full Address", es: "Su Dirección Completa" },
    defendantName: { en: "Defendant's Full Name", es: "Nombre Completo del Demandado" },
    defendantAddress: { en: "Defendant's Full Address", es: "Dirección Completa del Demandado" },
    disputeDescription: { en: "Brief Description of Dispute", es: "Breve Descripción de la Disputa" },
    disputePlaceholder: { en: "On May 1, 2023, Jane Smith's dog dug under the fence and damaged my garden...", es: "El 1 de mayo de 2023, el perro de Jane Smith cavó debajo de la cerca y dañó mi jardín..." },
    amountOwed: { en: "Amount Owed ($)", es: "Monto Adeudado ($)" },
    incidentDate: { en: "Date of Incident", es: "Fecha del Incidente" },
    datePlaceholder: { en: "ex: May 1, 2023", es: "ej., 1 de mayo de 2023" },
    generateLetter: { en: "Generate Letter", es: "Generar Carta" },
    generating: { en: "Generating...", es: "Generando..." },
    modalTitle: { en: "Your Generated Demand Letter", es: "Su Carta de Demanda Generada" },
    copy: { en: "Copy", es: "Copiar" },
    download: { en: "Download PDF", es: "Descargar PDF" },
    print: { en: "Print", es: "Imprimir" },
    copied: { en: "Copied to clipboard!", es: "¡Copiado al portapapeles!" },
    copiedDesc: { en: "You can now paste the letter into any text editor.", es: "Ahora puede pegar la carta en cualquier editor de texto." },
    error: { en: "Error", es: "Error" },
    errorDesc: { en: "Failed to generate demand letter. Please try again.", es: "No se pudo generar la carta de demanda. Por favor, inténtelo de nuevo." },
}

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


export default function DemandLetterGenerator() {
  const [letter, setLetter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yourName: '',
      yourAddress: '',
      defendantName: '',
      defendantAddress: '',
      disputeDescription: '',
      amount: 0,
      incidentDate: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await generateDemandLetter(data);
      setLetter(result.letter);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating letter:", error);
      toast({
        variant: "destructive",
        title: t(text.error),
        description: t(text.errorDesc),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    toast({
      title: t(text.copied),
      description: t(text.copiedDesc),
    });
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFont("Times-Roman", "normal");
    doc.setFontSize(12);

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;

    const lines = doc.splitTextToSize(letter, usableWidth);
    doc.text(lines, margin, margin);
    
    doc.save("demand-letter.pdf");
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Demand Letter</title>');
      printWindow.document.write('<style>body { font-family: Times, serif; font-size: 12pt; margin: 1in; } pre { white-space: pre-wrap; word-wrap: break-word; font-family: Times, serif; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<pre>${letter}</pre>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };


  return (
    <section id="demand-letter" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t(text.title)}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t(text.description)}
            </p>
        </div>

        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{t(text.cardTitle)}</CardTitle>
                <CardDescription>{t(text.cardDescription)}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-6">
                             <FormField control={form.control} name="yourName" render={({ field }) => (
                                <FormItem><FormLabel>{t(text.yourName)}</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={form.control} name="yourAddress" render={({ field }) => (
                                <FormItem><FormLabel>{t(text.yourAddress)}</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                           <div className="space-y-6">
                             <FormField control={form.control} name="defendantName" render={({ field }) => (
                                <FormItem><FormLabel>{t(text.defendantName)}</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={form.control} name="defendantAddress" render={({ field }) => (
                                <FormItem><FormLabel>{t(text.defendantAddress)}</FormLabel><FormControl><Input placeholder="456 Oak Ave, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                        </div>
                        <FormField control={form.control} name="disputeDescription" render={({ field }) => (
                            <FormItem><FormLabel>{t(text.disputeDescription)}</FormLabel><FormControl><Textarea placeholder={t(text.disputePlaceholder)} rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem><FormLabel>{t(text.amountOwed)}</FormLabel><FormControl><Input type="number" placeholder="500" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="incidentDate" render={({ field }) => (
                                <FormItem><FormLabel>{t(text.incidentDate)}</FormLabel><FormControl><Input type="text" placeholder={t(text.datePlaceholder)} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? t(text.generating) : t(text.generateLetter)}</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>{t(text.modalTitle)}</DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[60vh] overflow-y-auto p-4 border rounded-md" >
                                  <div id="printable-area">
                                    <pre className="text-sm whitespace-pre-wrap font-serif">{letter}</pre>
                                  </div>
                                </div>
                                <DialogFooter className="sm:justify-end gap-2">
                                    <Button type="button" variant="secondary" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> {t(text.copy)}</Button>
                                    <Button type="button" onClick={handleDownloadPdf}><Download className="mr-2 h-4 w-4" /> {t(text.download)}</Button>
                                    <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> {t(text.print)}</Button>
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

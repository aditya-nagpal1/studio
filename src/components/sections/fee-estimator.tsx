
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, Info, Loader2, Scale } from "lucide-react";
import { estimateCourtFees, type EstimateFeesOutput } from "@/ai/flows/estimate-fees-flow";

const text = {
    title: { en: "Smart Fee & Cost Estimator", es: "Estimador Inteligente de Tarifas y Costos" },
    description: { en: "Get a real-time estimate of court filing and service fees for your specific case. Powered by AI.", es: "Obtenga una estimación en tiempo real de las tarifas de presentación y servicio judicial para su caso específico. Con tecnología de IA." },
    cardTitle: { en: "Estimate Your Costs", es: "Estime sus Costos" },
    cardDescription: { en: "Enter your case details to get a fee estimate.", es: "Ingrese los detalles de su caso para obtener una estimación de las tarifas." },
    disputeAmount: { en: "Dispute Amount ($)", es: "Monto de la Disputa ($)" },
    zipCode: { en: "Zip Code of Incident", es: "Código Postal del Incidente" },
    disputePlaceholder: { en: "ex: 1500", es: "ej., 1500" },
    zipPlaceholder: { en: "ex: 90210", es: "ej., 90210" },
    getEstimate: { en: "Get Estimate", es: "Obtener Estimación" },
    estimating: { en: "Estimating...", es: "Estimando..." },
    errorTitle: { en: "Error", es: "Error" },
    errorDesc: { en: "Could not retrieve fee information at this time. Please try again later.", es: "No se pudo recuperar la información de la tarifa en este momento. Por favor, inténtelo de nuevo más tarde." },
    resultsTitle: { en: "Estimated Costs", es: "Costos Estimados" },
    filingFee: { en: "Filing Fee", es: "Tarifa de Presentación" },
    serviceFee: { en: "Service Fee", es: "Tarifa de Servicio" },
    otherFees: { en: "Other Potential Fees", es: "Otras Tarifas Potenciales" },
    source: { en: "Source", es: "Fuente" },
};

const formSchema = z.object({
  disputeAmount: z.coerce.number().positive("Amount must be a positive number."),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code."),
});
type FormValues = z.infer<typeof formSchema>;

export default function FeeEstimator() {
  const [result, setResult] = useState<EstimateFeesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeAmount: 0,
      zipCode: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await estimateCourtFees(data);
      setResult(response);
    } catch (e) {
      console.error(e);
      setError(t(text.errorDesc));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="fee-estimator" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t(text.title)}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t(text.description)}
            </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
                <CardTitle>{t(text.cardTitle)}</CardTitle>
                <CardDescription>{t(text.cardDescription)}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="disputeAmount" render={({ field }) => (
                            <FormItem><FormLabel>{t(text.disputeAmount)}</FormLabel><FormControl><Input type="number" placeholder={t(text.disputePlaceholder)} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="zipCode" render={({ field }) => (
                            <FormItem><FormLabel>{t(text.zipCode)}</FormLabel><FormControl><Input placeholder={t(text.zipPlaceholder)} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t(text.estimating)}</> : t(text.getEstimate)}
                        </Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center">
             {isLoading && (
                <div className="text-center p-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">{t(text.estimating)}</p>
                </div>
            )}
            {error && (
                <Alert variant="destructive">
                    <Info className="h-4 w-4" />
                    <AlertTitle>{t(text.errorTitle)}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {result && (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>{t(text.resultsTitle)}</CardTitle>
                        <CardDescription>{result.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">{t(text.filingFee)}</span>
                            <span className="font-bold text-lg">{result.filingFee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-muted-foreground">{t(text.serviceFee)}</span>
                            <span className="font-bold text-lg">{result.serviceFee}</span>
                        </div>
                        <div>
                            <h4 className="font-medium text-muted-foreground mb-1">{t(text.otherFees)}</h4>
                            <p className="text-sm">{result.otherPotentialFees}</p>
                        </div>
                        {result.sourceUrl && (
                             <div>
                                <h4 className="font-medium text-muted-foreground mb-1">{t(text.source)}</h4>
                                <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                                    {result.sourceUrl}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
            {!isLoading && !result && !error && (
                <div className="text-center text-muted-foreground p-8">
                    <Scale className="h-16 w-16 mx-auto mb-4" />
                    <p>Your estimated costs will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

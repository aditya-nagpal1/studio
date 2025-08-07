
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info, FileText, UserCheck } from "lucide-react";
import { estimateFees, type EstimateFeesOutput } from "@/ai/flows/estimate-fees-flow";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const text = {
    title: { en: "Smart Fee & Cost Estimator", es: "Estimador Inteligente de Tarifas y Costos" },
    description: { en: "Get a detailed breakdown of potential court costs to help you budget for your case.", es: "Obtenga un desglose detallado de los posibles costos judiciales para ayudarlo a presupuestar su caso." },
    cardTitle: { en: "Estimate Your Costs", es: "Estime sus Costos" },
    cardDescription: { en: "Fill in the details below to get an estimate.", es: "Complete los detalles a continuación para obtener una estimación." },
    claimAmount: { en: "Claim Amount ($)", es: "Monto del Reclamo ($)" },
    zipCode: { en: "ZIP Code of Incident", es: "Código Postal del Incidente" },
    filingMethod: { en: "Filing Method", es: "Método de Presentación" },
    inPerson: { en: "In-Person", es: "En Persona" },
    online: { en: "Online", es: "En Línea" },
    serviceMethod: { en: "Service Method", es: "Método de Notificación" },
    sheriff: { en: "Sheriff", es: "Sheriff" },
    certifiedMail: { en: "Certified Mail", es: "Correo Certificado" },
    privateServer: { en: "Private Process Server", es: "Notificador Privado" },
    estimateButton: { en: "Estimate Costs", es: "Estimar Costos" },
    estimatingButton: { en: "Estimating...", es: "Estimando..." },
    resultsTitle: { en: "Estimated Costs", es: "Costos Estimados" },
    totalCost: { en: "Total Estimated Cost", es: "Costo Total Estimado" },
    costBreakdown: { en: "Cost Breakdown", es: "Desglose de Costos" },
    filingFee: { en: "Filing Fee", es: "Tarifa de Presentación" },
    serviceFee: { en: "Service of Process Fee", es: "Tarifa de Notificación" },
    feeWaiverTitle: { en: "Fee Waiver Eligibility", es: "Elegibilidad para Exención de Tarifas" },
    comparisonTitle: { en: "Cost Comparison with Nearby Counties", es: "Comparación de Costos con Condados Cercanos" },
    disclaimer: { en: "Disclaimer: This is an AI-generated estimate. All costs are approximate. Please verify with your local court for exact fees and procedures.", es: "Descargo de responsabilidad: Esta es una estimación generada por IA. Todos los costos son aproximados. Verifique con su tribunal local para conocer las tarifas y procedimientos exactos." },
    errorTitle: { en: "Error", es: "Error" },
    errorDesc: { en: "Could not estimate fees at this time. Please try again later.", es: "No se pudieron estimar las tarifas en este momento. Inténtelo de nuevo más tarde." },
};

const formSchema = z.object({
  claimAmount: z.coerce.number().positive("Claim amount must be positive."),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code."),
  filingMethod: z.string(),
  serviceMethod: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export default function FeeEstimator() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EstimateFeesOutput | null>(null);
  const [error, setError] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      claimAmount: 1000,
      zipCode: "90210",
      filingMethod: "in-person",
      serviceMethod: "sheriff",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResults(null);
    setError(false);
    try {
      const res = await estimateFees(data);
      setResults(res);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="estimator" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
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
                  <FormField control={form.control} name="claimAmount" render={({ field }) => (
                      <FormItem><FormLabel>{t(text.claimAmount)}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="zipCode" render={({ field }) => (
                      <FormItem><FormLabel>{t(text.zipCode)}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="filingMethod" render={({ field }) => (
                      <FormItem>
                          <FormLabel>{t(text.filingMethod)}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="in-person">{t(text.inPerson)}</SelectItem>
                                  <SelectItem value="online">{t(text.online)}</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="serviceMethod" render={({ field }) => (
                      <FormItem>
                          <FormLabel>{t(text.serviceMethod)}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="sheriff">{t(text.sheriff)}</SelectItem>
                                  <SelectItem value="certified-mail">{t(text.certifiedMail)}</SelectItem>
                                  <SelectItem value="private-server">{t(text.privateServer)}</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t(text.estimatingButton)}</> : t(text.estimateButton)}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            {isLoading && (
              <Card className="flex items-center justify-center h-full">
                <CardContent className="text-center p-6">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground mt-4">Finding the latest fees...</p>
                </CardContent>
              </Card>
            )}
            {error && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>{t(text.errorTitle)}</AlertTitle>
                <AlertDescription>{t(text.errorDesc)}</AlertDescription>
              </Alert>
            )}
            {results && (
              <Card>
                <CardHeader>
                    <CardTitle>{t(text.resultsTitle)}</CardTitle>
                    <CardDescription>{results.courtName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">{t(text.totalCost)}</p>
                        <p className="text-4xl font-bold">${results.estimatedTotal.toFixed(2)}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">{t(text.costBreakdown)}</h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between items-center p-2 rounded-md hover:bg-secondary"><span className="flex items-center gap-2"><FileText size={16}/>{t(text.filingFee)}</span> <span className="font-medium">${results.filingFee.toFixed(2)}</span></div>
                           <div className="flex justify-between items-center p-2 rounded-md hover:bg-secondary"><span className="flex items-center gap-2"><UserCheck size={16}/>{t(text.serviceFee)}</span> <span className="font-medium">${results.serviceFee.toFixed(2)}</span></div>
                        </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">{t(text.feeWaiverTitle)}</h4>
                      <Alert variant={results.feeWaiver.isEligible ? "default" : "destructive"}>
                        <Info className="h-4 w-4" />
                        <AlertTitle>{results.feeWaiver.isEligible ? "Likely Eligible" : "Likely Not Eligible"}</AlertTitle>
                        <AlertDescription>
                          {results.feeWaiver.reasoning}
                          {results.feeWaiver.waiverFormUrl && <a href={results.feeWaiver.waiverFormUrl} target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline mt-2">Find Waiver Form Here</a>}
                        </AlertDescription>
                      </Alert>
                    </div>
                    
                    {results.countyComparison.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">{t(text.comparisonTitle)}</h4>
                        <div className="h-[250px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={results.countyComparison}>
                                <XAxis dataKey="county" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Bar dataKey="totalCost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-center text-muted-foreground pt-4">{t(text.disclaimer)}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );


"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lightbulb, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { generateStrategy } from "@/ai/flows/strategy-generator-flow";

const text = {
    title: { en: "Generate Your Winning Strategy", es: "Genere su Estrategia Ganadora" },
    description: { en: "Describe your case and what you want to achieve, and our AI assistant will create a customized, step-by-step plan to help you prepare.", es: "Describa su caso y lo que quiere lograr, y nuestro asistente de IA creará un plan personalizado paso a paso para ayudarlo a prepararse." },
    cardTitle: { en: "Case Details", es: "Detalles del Caso" },
    cardDescription: { en: "Provide the necessary information to generate your strategy.", es: "Proporcione la información necesaria para generar su estrategia." },
    caseDetails: { en: "Describe your case", es: "Describa su caso" },
    caseDetailsPlaceholder: { en: "Explain what happened, who was involved, and what evidence you have (e.g., texts, photos, contracts).", es: "Explique qué sucedió, quién estuvo involucrado y qué evidencia tiene (por ejemplo, textos, fotos, contratos)." },
    desiredOutcome: { en: "What is your desired outcome?", es: "Cuál es el resultado deseado?" },
    desiredOutcomePlaceholder: { en: "e.g., Get my security deposit of $800 back.", es: "ej., Recuperar mi depósito de seguridad de $800." },
    generateStrategy: { en: "Generate Strategy", es: "Generar Estrategia" },
    generating: { en: "Generating...", es: "Generando..." },
    strategyTitle: { en: "Your Custom Strategy", es: "Su Estrategia Personalizada" },
    disclaimer: { en: "Disclaimer: This is not legal advice and is for informational purposes only. You should consult with a qualified attorney for advice regarding your individual situation.", es: "Descargo de responsabilidad: Esto no es un consejo legal y es solo para fines informativos. Debe consultar con un abogado calificado para obtener asesoramiento sobre su situación individual." },
    error: { en: "Error", es: "Error" },
    errorDesc: { en: "Failed to generate strategy. Please try again.", es: "No se pudo generar la estrategia. Por favor, inténtelo de nuevo." },
}

const formSchema = z.object({
  caseDetails: z.string().min(20, "Please provide more details about your case (at least 20 characters)."),
  desiredOutcome: z.string().min(5, "Please describe your desired outcome."),
});

type FormValues = z.infer<typeof formSchema>;


export default function StrategyGenerator() {
  const [strategy, setStrategy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseDetails: '',
      desiredOutcome: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setStrategy("");
    try {
      const result = await generateStrategy(data);
      // Replace newlines with <br /> for HTML rendering
      setStrategy(result.strategy.replace(/\n/g, '<br />'));
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast({
        variant: "destructive",
        title: t(text.error),
        description: t(text.errorDesc),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="strategy-generator" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
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
                            <FormField control={form.control} name="caseDetails" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t(text.caseDetails)}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t(text.caseDetailsPlaceholder)} rows={8} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="desiredOutcome" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t(text.desiredOutcome)}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t(text.desiredOutcomePlaceholder)} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t(text.generating)}</>
                                ) : (
                                    <>{t(text.generateStrategy)}</>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="flex flex-col space-y-4">
                 {isLoading && !strategy && (
                     <Card className="flex-grow flex items-center justify-center">
                         <div className="text-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <p className="text-muted-foreground mt-2">{t(text.generating)}</p>
                        </div>
                     </Card>
                )}

                {strategy && (
                     <Card>
                        <CardHeader>
                            <CardTitle>{t(text.strategyTitle)}</CardTitle>
                        </CardHeader>
                        <CardContent className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: strategy }} />
                            <Alert variant="default" className="mt-6">
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle>Disclaimer</AlertTitle>
                                <AlertDescription>
                                    {t(text.disclaimer)}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}
                 {!isLoading && !strategy && (
                     <Card className="flex-grow flex items-center justify-center bg-muted/50 border-dashed">
                        <div className="text-center p-8 text-muted-foreground">
                            <Lightbulb className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">Your Strategy Will Appear Here</h3>
                            <p className="text-sm">Fill out the form to get started.</p>
                        </div>
                     </Card>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}

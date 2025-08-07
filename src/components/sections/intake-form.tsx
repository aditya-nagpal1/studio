
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { findCourt } from "@/services/court-finder-service";

const text = {
  title: { en: "Check Your Eligibility", es: "Verifique su Elegibilidad" },
  description: { en: "Answer a few questions to see if your case is a good fit for small claims court. This is the first step toward getting what you're owed.", es: "Responda algunas preguntas para ver si su caso es adecuado para el tribunal de reclamos menores. Este es el primer paso para obtener lo que se le debe." },
  cardTitle: { en: "Smart Eligibility Intake", es: "Formulario de Elegibilidad Inteligente" },
  disputeType: { en: "Dispute Type", es: "Tipo de Disputa" },
  selectDispute: { en: "Select a dispute type", es: "Seleccione un tipo de disputa" },
  unpaidWages: { en: "Unpaid Wages", es: "Salarios no Pagados" },
  landlordTenant: { en: "Landlord-Tenant", es: "Propietario-Inquilino" },
  carDamage: { en: "Car Damage", es: "Daños al Automóvil" },
  breachOfContract: { en: "Breach of Contract", es: "Incumplimiento de Contrato" },
  other: { en: "Other", es: "Otro" },
  disputeAmount: { en: "Dispute Amount", es: "Monto de la Disputa" },
  disputeAmountPlaceholder: { en: "ex: 1500", es: "ej., 1500" },
  zipCode: { en: "Zip Code of Incident", es: "Código Postal del Incidente" },
  zipCodePlaceholder: { en: "ex: 90210", es: "ej., 90210" },
  incidentDate: { en: "Incident Date", es: "Fecha del Incidente" },
  pickDate: { en: "Pick a date", es: "Elija una fecha" },
  checkEligibility: { en: "Check Eligibility", es: "Verificar Elegibilidad" },
  checking: { en: "Checking...", es: "Verificando..." },
  likelyEligible: { en: "Likely Eligible for Small Claims", es: "Probablemente Elegible para Reclamos Menores" },
  potentiallyIneligible: { en: "Potentially Ineligible for Small Claims", es: "Potencialmente Inelegible para Reclamos Menores" },
  amountTooHigh: { en: (amount: number) => `The dispute amount of $${amount.toLocaleString()} may be too high for small claims court in many jurisdictions (typically capped at $10,000).`, es: (amount: number) => `El monto de la disputa de $${amount.toLocaleString()} puede ser demasiado alto para el tribunal de reclamos menores en muchas jurisdicciones (generalmente limitado a $10,000).` },
  amountOk: { en: (amount: number) => `The dispute amount of $${amount.toLocaleString()} is within the typical limit for small claims.`, es: (amount: number) => `El monto de la disputa de $${amount.toLocaleString()} está dentro del límite típico para reclamos menores.` },
  dateTooOld: { en: "The incident occurred more than 3 years ago, which may be past the statute of limitations in many places.", es: "El incidente ocurrió hace más de 3 años, lo que puede haber excedido el estatuto de limitaciones en muchos lugares." },
  dateOk: { en: "The incident occurred within the last 3 years, which is generally within the statute of limitations.", es: "El incidente ocurrió en los últimos 3 años, lo que generalmente está dentro del estatuto de limitaciones." },
  courtFound: { en: (name: string, address: string) => `Your case would likely be filed at: ${name}, ${address}.`, es: (name: string, address: string) => `Su caso probablemente se presentaría en: ${name}, ${address}.` },
  courtNotFound: { en: "We couldn't find a specific court for your zip code, but you can find it on your local government's website.", es: "No pudimos encontrar un tribunal específico para su código postal, pero puede encontrarlo en el sitio web de su gobierno local." },
  courtError: { en: "Could not verify courthouse information at this time.", es: "No se pudo verificar la información del tribunal en este momento." },
};

const formSchema = z.object({
  disputeType: z.string({ required_error: "Please select a dispute type." }),
  disputeAmount: z.coerce.number().positive("Amount must be positive.").max(100000, "Amount is too high."),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code."),
  incidentDate: z.date({ required_error: "Please select the date of the incident." }),
});

type FormValues = z.infer<typeof formSchema>;

type ResultState = {
  status: "eligible" | "ineligible" | "info";
  title: string;
  messages: string[];
} | null;

const GOOGLE_MAPS_API_KEY = "AIzaSyCaOabsXSqNzVHFljI2zbUv46sMBhWEyHU";

export default function IntakeForm() {
  const [result, setResult] = useState<ResultState>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeType: undefined,
      disputeAmount: 0,
      zipCode: "",
      incidentDate: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const messages: string[] = [];
    let isEligible = true;

    if (data.disputeAmount >= 10000) {
      messages.push(t({en: text.amountTooHigh.en(data.disputeAmount), es: text.amountTooHigh.es(data.disputeAmount)}));
      isEligible = false;
    } else {
      messages.push(t({en: text.amountOk.en(data.disputeAmount), es: text.amountOk.es(data.disputeAmount)}));
    }

    const yearsAgo = (new Date().getTime() - data.incidentDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsAgo > 3) {
      messages.push(t(text.dateTooOld));
      isEligible = false;
    } else {
       messages.push(t(text.dateOk));
    }
    
    try {
      const court = await findCourt(data.zipCode, GOOGLE_MAPS_API_KEY);
      if (court) {
        messages.push(t({en: text.courtFound.en(court.name, court.address), es: text.courtFound.es(court.name, court.address)}));
      } else {
        messages.push(t(text.courtNotFound));
      }
    } catch (error) {
       messages.push(t(text.courtError));
    }

    if(isEligible) {
      setResult({
        status: "eligible",
        title: t(text.likelyEligible),
        messages: messages,
      });
    } else {
      setResult({
        status: "ineligible",
        title: t(text.potentiallyIneligible),
        messages: messages,
      });
    }
    setIsLoading(false);
  };

  return (
    <section id="intake-form" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">{t(text.title)}</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              {t(text.description)}
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t(text.cardTitle)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="disputeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(text.disputeType)}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t(text.selectDispute)} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unpaid_wages">{t(text.unpaidWages)}</SelectItem>
                            <SelectItem value="landlord_tenant">{t(text.landlordTenant)}</SelectItem>
                            <SelectItem value="car_damage">{t(text.carDamage)}</SelectItem>
                            <SelectItem value="breach_of_contract">{t(text.breachOfContract)}</SelectItem>
                            <SelectItem value="other">{t(text.other)}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="disputeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(text.disputeAmount)}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={t(text.disputeAmountPlaceholder)} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(text.zipCode)}</FormLabel>
                        <FormControl>
                          <Input placeholder={t(text.zipCodePlaceholder)} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t(text.incidentDate)}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: language === 'es' ? es : undefined })
                                ) : (
                                  <span>{t(text.pickDate)}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              locale={language === 'es' ? es : undefined}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? t(text.checking) : t(text.checkEligibility)}</Button>
                </form>
              </Form>

              {result && (
                <Alert variant={result.status === 'ineligible' ? 'destructive' : 'default'} className="mt-6">
                  {result.status === 'eligible' && <CheckCircle className="h-4 w-4" />}
                  {result.status === 'ineligible' && <AlertCircle className="h-4 w-4" />}
                  {result.status === 'info' && <Info className="h-4 w-4" />}
                  <AlertTitle>{result.title}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {result.messages.map((msg, i) => <li key={i}>{msg}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

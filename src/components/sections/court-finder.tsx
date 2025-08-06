
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/context/language-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Building, Phone } from "lucide-react";
import { findCourt } from "@/services/court-finder-service";
import Image from "next/image";

const text = {
    title: { en: "Find Your Courthouse", es: "Encuentre su Tribunal" },
    description: { en: "Enter the zip code where the incident occurred to find the correct small claims court.", es: "Ingrese el código postal donde ocurrió el incidente para encontrar el tribunal de reclamos menores correcto." },
    cardTitle: { en: "Court Finder", es: "Buscador de Tribunales" },
    cardDescription: { en: "Enter a 5-digit zip code to find court information.", es: "Ingrese un código postal de 5 dígitos para encontrar información del tribunal." },
    zipPlaceholder: { en: "e.g., 90210", es: "ej., 90210" },
    findCourt: { en: "Find Court", es: "Buscar Tribunal" },
    searching: { en: "Searching...", es: "Buscando..." },
    notFoundTitle: { en: "Not Found", es: "No Encontrado" },
    notFoundDesc: { en: "We couldn't find a court for that zip code. Please check the zip code or try another one. For official information, check your local county or city government website.", es: "No pudimos encontrar un tribunal para ese código postal. Verifique el código postal o intente con otro. Para obtener información oficial, consulte el sitio web de su condado o gobierno local." },
    zipRegexError: { en: "Please enter a valid 5-digit zip code.", es: "Por favor ingrese un código postal válido de 5 dígitos." },
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCaOabsXSqNzVHFljI2zbUv46sMBhWEyHU";

type CourtInfo = {
    name: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
};

export default function CourtFinder() {
  const [courtInfo, setCourtInfo] = useState<CourtInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const formSchema = z.object({
    zipCode: z.string().regex(/^\d{5}$/, t(text.zipRegexError)),
  });
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        zipCode: "",
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setCourtInfo(null);
    setNotFound(false);
    try {
        const court = await findCourt(data.zipCode, GOOGLE_MAPS_API_KEY);
        if (court) {
            setCourtInfo(court);
        } else {
            setNotFound(true);
        }
    } catch (error) {
        setNotFound(true);
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section id="court-finder" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
         <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t(text.title)}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t(text.description)}
            </p>
        </div>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{t(text.cardTitle)}</CardTitle>
                <CardDescription>{t(text.cardDescription)}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder={t(text.zipPlaceholder)} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>{isLoading ? t(text.searching) : t(text.findCourt)}</Button>
                    </form>
                </Form>

                {courtInfo && (
                    <div className="mt-6 border rounded-lg overflow-hidden">
                        <div className="p-4">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Building /> {courtInfo.name}</h3>
                            <p className="text-muted-foreground flex items-center gap-2 mt-2"><MapPin className="w-4 h-4"/> {courtInfo.address}</p>
                            {courtInfo.phone && <p className="text-muted-foreground flex items-center gap-2 mt-1"><Phone className="w-4 h-4"/> {courtInfo.phone}</p>}
                        </div>
                         <div className="w-full h-64 bg-gray-300">
                           <Image
                                src={`https://maps.googleapis.com/maps/api/staticmap?center=${courtInfo.latitude},${courtInfo.longitude}&zoom=15&size=600x300&markers=color:blue%7Clabel:C%7C${courtInfo.latitude},${courtInfo.longitude}&key=${GOOGLE_MAPS_API_KEY}`}
                                alt={`Map of ${courtInfo.name}`}
                                width={600}
                                height={300}
                                className="w-full h-full object-cover"
                           />
                        </div>
                    </div>
                )}
                
                {notFound && (
                    <Alert variant="destructive" className="mt-6">
                        <AlertTitle>{t(text.notFoundTitle)}</AlertTitle>
                        <AlertDescription>
                            {t(text.notFoundDesc)}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      </div>
    </section>
  );
}

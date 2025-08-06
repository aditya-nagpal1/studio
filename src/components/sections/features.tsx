
"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, FileText, ShieldCheck, ListChecks, Map } from "lucide-react";


const featuresContent = {
  en: {
    tag: "Key Features",
    title: "Everything You Need to Win",
    description: "Court Companion provides a suite of tools designed to demystify the small claims process and empower you to seek justice.",
    features: [
      {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Eligibility Checker",
        description: "Quickly determine if your case qualifies for small claims court based on amount, location, and date.",
        href: "#intake-form",
      },
      {
        icon: <FileText className="w-8 h-8 text-primary" />,
        title: "Demand Letter Generator",
        description: "Create a professional demand letter to send to the opposing party before you file your claim.",
        href: "#demand-letter",
      },
      {
        icon: <Gavel className="w-8 h-8 text-primary" />,
        title: "Claim Strength Analyzer",
        description: "Assess the strength of your case based on your evidence and other key factors.",
        href: "#analyzer",
      },
      {
        icon: <ListChecks className="w-8 h-8 text-primary" />,
        title: "Step-by-Step Guide",
        description: "Follow our interactive checklist to navigate the small claims process from start to finish.",
        href: "#guide",
      },
      {
        icon: <Map className="w-8 h-8 text-primary" />,
        title: "Court Finder",
        description: "Easily find the correct courthouse for your small claims case using just your zip code.",
        href: "#court-finder",
      },
    ],
  },
  es: {
    tag: "Características Clave",
    title: "Todo lo que Necesitas para Ganar",
    description: "Court Companion ofrece un conjunto de herramientas diseñadas para desmitificar el proceso de reclamos menores y empoderarte para buscar justicia.",
    features: [
      {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Verificador de Elegibilidad",
        description: "Determina rápidamente si tu caso califica para el tribunal de reclamos menores según el monto, la ubicación y la fecha.",
        href: "#intake-form",
      },
      {
        icon: <FileText className="w-8 h-8 text-primary" />,
        title: "Generador de Cartas de Demanda",
        description: "Crea una carta de demanda profesional para enviar a la parte contraria antes de presentar tu reclamo.",
        href: "#demand-letter",
      },
      {
        icon: <Gavel className="w-8 h-8 text-primary" />,
        title: "Analizador de Fortaleza del Reclamo",
        description: "Evalúa la solidez de tu caso basándote en tu evidencia y otros factores clave.",
        href: "#analyzer",
      },
      {
        icon: <ListChecks className="w-8 h-8 text-primary" />,
        title: "Guía Paso a Paso",
        description: "Sigue nuestra lista de verificación interactiva para navegar el proceso de reclamos menores de principio a fin.",
        href: "#guide",
      },
      {
        icon: <Map className="w-8 h-8 text-primary" />,
        title: "Buscador de Tribunales",
        description: "Encuentra fácilmente el tribunal correcto para tu caso de reclamos menores usando solo tu código postal.",
        href: "#court-finder",
      },
    ],
  }
};

export default function FeaturesSection() {
  const { language } = useLanguage();
  const content = featuresContent[language];

  return (
    <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{content.tag}</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{content.title}</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {content.description}
          </p>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          {content.features.map((feature) => (
            <a key={feature.title} href={feature.href} className="block group">
              <Card className="bg-background group-hover:shadow-lg transition-all duration-300 h-full group-hover:-translate-y-2">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

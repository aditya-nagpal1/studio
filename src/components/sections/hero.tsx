
"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

const text = {
    title: {
        en: "Small Claims. Big Help.",
        es: "Reclamos Menores. Gran Ayuda.",
    },
    subtitle: {
        en: "Empowering you to take legal action without a lawyer. Court Companion provides the tools you need to file and win your small claims case.",
        es: "Empoderándote para tomar acciones legales sin un abogado. Court Companion te proporciona las herramientas que necesitas para presentar y ganar tu caso de reclamos menores.",
    },
    cta: {
        en: "Start Now",
        es: "Empezar Ahora",
    }
}

export default function HeroSection() {
  const { t } = useLanguage();
  const handleScroll = () => {
    const element = document.getElementById("intake-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary">
              {t(text.title)}
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              {t(text.subtitle)}
            </p>
          </div>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleScroll}>
            {t(text.cta)}
          </Button>
        </div>
      </div>
    </section>
  );
}

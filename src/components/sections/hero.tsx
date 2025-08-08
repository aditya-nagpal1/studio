
"use client";

import { useState, useEffect, useMemo } from "react";
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
    },
    courtCompanion: {
        en: "Court Companion",
        es: "Court Companion"
    }
}

export default function HeroSection() {
  const { t, language } = useLanguage();
  
  const toRotate = useMemo(() => [
    t(text.courtCompanion),
    t(text.title),
  ], [language, t]);
  
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(75);

  useEffect(() => {
      setDisplayedText('');
      setLoopNum(0);
      setIsDeleting(false);
  }, [language]);

  useEffect(() => {
    let ticker: NodeJS.Timeout;
    const handleTyping = () => {
      const i = loopNum % toRotate.length;
      const fullText = toRotate[i];

      const updatedText = isDeleting
        ? fullText.substring(0, displayedText.length - 1)
        : fullText.substring(0, displayedText.length + 1);

      setDisplayedText(updatedText);

      if (isDeleting) {
        setTypingSpeed(30);
      }

      if (!isDeleting && updatedText === fullText) {
        setTypingSpeed(1500); // Pause at the end
        setIsDeleting(true);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(75);
      }
    };

    ticker = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, typingSpeed, loopNum, toRotate]);


  const handleScroll = () => {
    const element = document.getElementById("intake-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full py-20 md:py-32 lg:py-40 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary min-h-[84px] sm:min-h-[100px] md:min-h-[120px]">
              {displayedText}<span className="animate-pulse">|</span>
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

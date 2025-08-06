
"use client";

import { useState, useEffect } from "react";
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
  const { t, language } = useLanguage();
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const fullText = t(text.title);

  useEffect(() => {
    setDisplayedText('');
    setIsDeleting(false);
    setLoopNum(prev => prev + 1); // a new loop for the new language
  }, [language]);
  
  useEffect(() => {
    let ticker: NodeJS.Timeout;
    const handleTyping = () => {
      const currentText = fullText;
      const updatedText = isDeleting
        ? currentText.substring(0, displayedText.length - 1)
        : currentText.substring(0, displayedText.length + 1);

      setDisplayedText(updatedText);

      if (isDeleting) {
        setTypingSpeed(prevSpeed => prevSpeed / 1.5);
      }

      if (!isDeleting && updatedText === currentText) {
        setTypingSpeed(2000); // Pause at the end
        setIsDeleting(true);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setTypingSpeed(150);
      } else {
         setTypingSpeed(isDeleting ? 75 : 150);
      }
    };

    ticker = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, typingSpeed, fullText]);


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

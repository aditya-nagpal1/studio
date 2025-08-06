"use client";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
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
              Small Claims. Big Help.
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Empowering you to take legal action without a lawyer. ClaimHero provides the tools you need to file and win your small claims case.
            </p>
          </div>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleScroll}>
            Start Now
          </Button>
        </div>
      </div>
    </section>
  );
}

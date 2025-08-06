
"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Menu, Scale, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = {
    en: [
        { href: "#features", label: "Features" },
        { href: "#guide", label: "Guide" },
        { href: "#contact", label: "Contact" },
    ],
    es: [
        { href: "#features", label: "Características" },
        { href: "#guide", label: "Guía" },
        { href: "#contact", label: "Contacto" },
    ]
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const closeMenu = () => setIsMenuOpen(false);
  
  const currentNavLinks = navLinks[language];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="flex items-center mr-6">
            <Scale className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold font-headline">Court Companion</span>
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            {currentNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLanguage("es")}>
                Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <a href="#" className="mr-6 flex items-center" onClick={closeMenu}>
                <Scale className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold font-headline">Court Companion</span>
              </a>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {currentNavLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-muted-foreground"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

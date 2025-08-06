
"use client";

import { Facebook, Linkedin, Scale, Twitter } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const text = {
  disclaimer: {
    en: "Court Companion does not provide legal advice. All information on this site is for informational purposes only.",
    es: "Court Companion no proporciona asesoramiento legal. Toda la información en este sitio es solo para fines informativos.",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    es: "Política de Privacidad",
  },
  termsOfUse: {
    en: "Terms of Use",
    es: "Términos de Uso",
  }
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-background border-t">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">Court Companion</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            {t(text.disclaimer)}
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Court Companion. All rights reserved. | 
            <a href="#" className="ml-1 hover:text-primary">{t(text.privacyPolicy)}</a> |
            <a href="#" className="ml-1 hover:text-primary">{t(text.termsOfUse)}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

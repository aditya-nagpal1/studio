import { Facebook, Linkedin, Scale, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-secondary">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">ClaimHero</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            ClaimHero does not provide legal advice. All information on this site is for informational purposes only.
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
            © {new Date().getFullYear()} ClaimHero. All rights reserved. | 
            <a href="#" className="ml-1 hover:text-primary">Privacy Policy</a> |
            <a href="#" className="ml-1 hover:text-primary">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

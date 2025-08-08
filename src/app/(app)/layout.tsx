
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/context/language-context";
import { Gavel, FileText, ShieldCheck, ListChecks, Map, Lightbulb, Home } from "lucide-react";

const navLinks = {
    en: [
        { href: "#hero", label: "Home", icon: <Home /> },
        { href: "#features", label: "Features", icon: <ListChecks /> },
        { href: "#intake-form", label: "Eligibility", icon: <ShieldCheck /> },
        { href: "#demand-letter", label: "Demand Letter", icon: <FileText /> },
        { href: "#strategy-generator", label: "Strategy", icon: <Lightbulb /> },
        { href: "#analyzer", label: "Analyzer", icon: <Gavel /> },
        { href: "#guide", label: "Guide", icon: <ListChecks /> },
        { href: "#court-finder", label: "Court Finder", icon: <Map /> },
    ],
    es: [
        { href: "#hero", label: "Inicio", icon: <Home /> },
        { href: "#features", label: "Características", icon: <ListChecks /> },
        { href: "#intake-form", label: "Elegibilidad", icon: <ShieldCheck /> },
        { href: "#demand-letter", label: "Carta de Demanda", icon: <FileText /> },
        { href: "#strategy-generator", label: "Estrategia", icon: <Lightbulb /> },
        { href: "#analyzer", label: "Analizador", icon: <Gavel /> },
        { href: "#guide", label: "Guía", icon: <ListChecks /> },
        { href: "#court-finder", label: "Buscador de Tribunales", icon: <Map /> },
    ]
};


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { language } = useLanguage();
  const currentNavLinks = navLinks[language];
  
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarContent className="p-2">
                <SidebarMenu>
                    {currentNavLinks.map((link) => (
                         <SidebarMenuItem key={link.label}>
                            <SidebarMenuButton
                                onClick={(e) => handleScroll(e, link.href)}
                                tooltip={{
                                    children: link.label,
                                    side: "right",
                                    align: "center",
                                }}
                            >
                                {link.icon}
                                <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarRail />
        <SidebarInset>
            <div className="flex items-center gap-2 p-2 border-b md:hidden sticky top-0 bg-background z-10">
                <SidebarTrigger />
                <h2 className="font-bold">Court Companion</h2>
            </div>
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}

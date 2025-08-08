
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LanguageProvider, useLanguage } from "@/context/language-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Gavel, FileText, ShieldCheck, ListChecks, Map, Lightbulb, Home, Languages, LogIn, UserPlus, User as UserIcon, LogOut } from "lucide-react";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import Link from "next/link";


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

function AppLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const currentNavLinks = navLinks[language];
  
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
      await logout();
      router.push('/login');
  }

  const languageLabels = {
    en: "Language",
    es: "Idioma"
  };

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarRail />
            <SidebarContent className="p-2 flex flex-col">
                <SidebarMenu className="flex-grow">
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
                <div className="mt-auto p-2 space-y-2">
                    {user ? (
                        <>
                          <SidebarMenuItem>
                              <Link href="/profile" className="w-full">
                                <SidebarMenuButton tooltip={{ children: "Profile", side: "right", align: "center" }}>
                                    <UserIcon />
                                    <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                                </SidebarMenuButton>
                              </Link>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleLogout} tooltip={{ children: "Logout", side: "right", align: "center" }}>
                                <LogOut />
                                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </>
                    ) : (
                        <>
                           <SidebarMenuItem>
                              <Link href="/login" className="w-full">
                                <SidebarMenuButton tooltip={{ children: "Login", side: "right", align: "center" }}>
                                    <LogIn />
                                    <span className="group-data-[collapsible=icon]:hidden">Login</span>
                                </SidebarMenuButton>
                               </Link>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                              <Link href="/signup" className="w-full">
                                <SidebarMenuButton tooltip={{ children: "Sign Up", side: "right", align: "center" }}>
                                    <UserPlus />
                                    <span className="group-data-[collapsible=icon]:hidden">Sign Up</span>
                                </SidebarMenuButton>
                               </Link>
                           </SidebarMenuItem>
                        </>
                    )}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="w-full justify-start items-center gap-2"
                            tooltip={{
                                children: t(languageLabels),
                                side: "right",
                                align: "center",
                            }}
                           >
                             <Languages />
                              <span className="group-data-[collapsible=icon]:hidden">{t(languageLabels)}</span>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="end">
                            <DropdownMenuItem onSelect={() => setLanguage("en")}>
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setLanguage("es")}>
                                Español
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarContent>
        </Sidebar>
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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-gramm="false" data-gramm_editor="false" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
            <LanguageProvider>
              <AppLayout>{children}</AppLayout>
              <Toaster />
            </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


"use client";

import { useState } from 'react';
import { LanguageProvider } from '@/context/language-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import IntakeForm from '@/components/sections/intake-form';
import Guide from '@/components/sections/guide';
import DemandLetterGenerator from '@/components/sections/demand-letter-generator';
import ClaimStrengthAnalyzer from '@/components/sections/claim-strength-analyzer';
import CourtFinder from '@/components/sections/court-finder';

export default function Home() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <IntakeForm />
          <Guide />
          <DemandLetterGenerator />
          <ClaimStrengthAnalyzer />
          <CourtFinder />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}


"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);


  return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            <div className="prose prose-gray max-w-4xl mx-auto dark:prose-invert">
              <h1 className="text-4xl font-bold font-headline mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>

              <p>
                Welcome to Court Companion ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">1. Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide to us when you fill out forms on our site, such as the eligibility intake form or the demand letter generator. This information may include:
              </p>
              <ul>
                <li>Your name and contact information (e.g., address)</li>
                <li>Information about the other party in your dispute (e.g., name, address)</li>
                <li>Details about your legal dispute, including dates, amounts, and descriptions</li>
                <li>Your IP address and location data (e.g., zip code) for finding appropriate court venues</li>
              </ul>

              <h2 className="text-2xl font-bold font-headline mt-8">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our services</li>
                <li>Generate documents such as demand letters on your behalf</li>
                <li>Analyze the strength of your claim and provide guidance</li>
                <li>Find relevant courthouse information based on your location</li>
                <li>Improve our website and services through the use of AI models</li>
                <li>Communicate with you, including responding to your inquiries</li>
              </ul>
              <p>
                The information you provide is processed by generative AI models to provide the core functionality of our service. We do not use your personal data to train these AI models.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">3. Sharing Your Information</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business, such as Google for its Maps and AI services, so long as those parties agree to keep this information confidential.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">4. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
              </p>
              
              <h2 className="text-2xl font-bold font-headline mt-8">5. Cookies and Local Storage</h2>
                <p>
                    We use browser local storage to save your progress in the step-by-step guide. This information is stored only on your device and is not transmitted to our servers. We do not use tracking cookies for advertising purposes.
                </p>

              <h2 className="text-2xl font-bold font-headline mt-8">6. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us via the contact information provided in the footer.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}

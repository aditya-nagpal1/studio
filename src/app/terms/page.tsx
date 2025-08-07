
import { LanguageProvider } from '@/context/language-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function TermsOfServicePage() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
            <div className="prose prose-gray max-w-4xl mx-auto dark:prose-invert">
              <h1 className="text-4xl font-bold font-headline mb-4">Terms of Use</h1>
              <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <p>
                Please read these Terms of Use ("Terms") carefully before using the Court Companion website (the "Service") operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">1. Not Legal Advice</h2>
              <p>
                Court Companion is a software tool designed to assist users in navigating the small claims court process. The information and documents provided through the Service are for informational purposes only and do not constitute legal advice. We are not a law firm and do not provide legal representation. No attorney-client relationship is formed by using this Service. You should consult with a qualified attorney for advice regarding your individual situation.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">2. Use of AI</h2>
              <p>
                The Service uses artificial intelligence and large language models to generate documents and provide information. While we strive for accuracy, we do not guarantee that the information or documents generated will be accurate, complete, or suitable for your specific circumstances. You are solely responsible for reviewing and verifying all information and documents before use.
              </p>
              
              <h2 className="text-2xl font-bold font-headline mt-8">3. User Responsibilities</h2>
              <p>
                You agree to provide accurate and complete information when using the Service. You are responsible for the final content of any document generated and for meeting all legal deadlines and requirements related to your case. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">4. Limitation of Liability</h2>
              <p>
                In no event shall Court Companion, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-2xl font-bold font-headline mt-8">5. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is based, without regard to its conflict of law provisions.
              </p>
              
              <h2 className="text-2xl font-bold font-headline mt-8">6. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
              </p>

               <h2 className="text-2xl font-bold font-headline mt-8">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

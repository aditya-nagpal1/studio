import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, FileText, ShieldCheck, ListChecks, Map } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Eligibility Checker",
    description: "Quickly determine if your case qualifies for small claims court based on amount, location, and date.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Demand Letter Generator",
    description: "Create a professional demand letter to send to the opposing party before you file your claim.",
  },
  {
    icon: <Gavel className="w-8 h-8 text-primary" />,
    title: "Claim Strength Analyzer",
    description: "Assess the strength of your case based on your evidence and other key factors.",
  },
  {
    icon: <ListChecks className="w-8 h-8 text-primary" />,
    title: "Step-by-Step Guide",
    description: "Follow our interactive checklist to navigate the small claims process from start to finish.",
  },
   {
    icon: <Map className="w-8 h-8 text-primary" />,
    title: "Court Finder",
    description: "Easily find the correct courthouse for your small claims case using just your zip code.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Win</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Court Companion provides a suite of tools designed to demystify the small claims process and empower you to seek justice.
          </p>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-background hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

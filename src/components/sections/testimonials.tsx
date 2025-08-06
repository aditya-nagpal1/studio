import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria G.",
    avatar: "MG",
    text: "ClaimHero was a lifesaver! It helped me get my full security deposit back from a difficult landlord without having to hire an expensive lawyer. The demand letter generator was so easy to use.",
  },
  {
    name: "Devon R.",
    avatar: "DR",
    text: "I was owed $1,800 for a freelance job and was getting the runaround. I used ClaimHero to analyze my case, file the claim, and I won in court! The step-by-step guide kept me on track.",
  },
  {
    name: "Sam K.",
    avatar: "SK",
    text: "A local mechanic did a shoddy repair on my car. I used the tools on this site to build my case, and the mechanic settled with me right after receiving my formal demand letter. Highly recommend!",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Success Stories from Real Users</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            See how ClaimHero has empowered people just like you to achieve justice.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardHeader>
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-foreground">{testimonial.text}</p>
              </CardHeader>
              <CardContent className="flex items-center">
                <Avatar>
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.avatar}`} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="font-semibold">{testimonial.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

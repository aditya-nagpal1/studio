
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, AlertCircle, CheckCircle, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { findCourt } from "@/services/court-finder-service";


const formSchema = z.object({
  disputeType: z.string({ required_error: "Please select a dispute type." }),
  disputeAmount: z.coerce.number().positive("Amount must be positive.").max(100000, "Amount is too high."),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code."),
  incidentDate: z.date({ required_error: "Please select the date of the incident." }),
});

type FormValues = z.infer<typeof formSchema>;

type ResultState = {
  status: "eligible" | "ineligible" | "info";
  title: string;
  messages: string[];
} | null;

export default function IntakeForm() {
  const [result, setResult] = useState<ResultState>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeType: undefined,
      disputeAmount: 0,
      zipCode: "",
      incidentDate: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const messages: string[] = [];
    let isEligible = true;

    // Check amount
    if (data.disputeAmount >= 10000) {
      messages.push(`The dispute amount of $${data.disputeAmount.toLocaleString()} may be too high for small claims court in many jurisdictions (typically capped at $10,000).`);
      isEligible = false;
    } else {
      messages.push(`The dispute amount of $${data.disputeAmount.toLocaleString()} is within the typical limit for small claims.`);
    }

    // Check date
    const yearsAgo = (new Date().getTime() - data.incidentDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsAgo > 3) {
      messages.push("The incident occurred more than 3 years ago, which may be past the statute of limitations in many places.");
      isEligible = false;
    } else {
       messages.push("The incident occurred within the last 3 years, which is generally within the statute of limitations.");
    }
    
    // Check zip code
    try {
      const court = await findCourt(data.zipCode);
      if (court) {
        messages.push(`Your case would likely be filed at: ${court.name}, ${court.address}.`);
      } else {
        messages.push("We couldn't find a specific court for your zip code, but you can find it on your local government's website.");
      }
    } catch (error) {
       messages.push("Could not verify courthouse information at this time.");
    }

    if(isEligible) {
      setResult({
        status: "eligible",
        title: "Likely Eligible for Small Claims",
        messages: messages,
      });
    } else {
      setResult({
        status: "ineligible",
        title: "Potentially Ineligible for Small Claims",
        messages: messages,
      });
    }
    setIsLoading(false);
  };

  return (
    <section id="intake-form" className="w-full py-20 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Check Your Eligibility</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Answer a few questions to see if your case is a good fit for small claims court. This is the first step toward getting what you're owed.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Smart Eligibility Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="disputeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dispute Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dispute type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unpaid_wages">Unpaid Wages</SelectItem>
                            <SelectItem value="landlord_tenant">Landlord-Tenant</SelectItem>
                            <SelectItem value="car_damage">Car Damage</SelectItem>
                            <SelectItem value="breach_of_contract">Breach of Contract</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="disputeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dispute Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code of Incident</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 90210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Incident Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Checking...' : 'Check Eligibility'}</Button>
                </form>
              </Form>

              {result && (
                <Alert variant={result.status === 'ineligible' ? 'destructive' : 'default'} className="mt-6">
                  {result.status === 'eligible' && <CheckCircle className="h-4 w-4" />}
                  {result.status === 'ineligible' && <AlertCircle className="h-4 w-4" />}
                  {result.status === 'info' && <Info className="h-4 w-4" />}
                  <AlertTitle>{result.title}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {result.messages.map((msg, i) => <li key={i}>{msg}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

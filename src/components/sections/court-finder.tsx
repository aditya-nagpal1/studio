"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Building, Phone } from "lucide-react";

type CourtInfo = {
    name: string;
    address: string;
    phone: string;
};

const MOCK_COURTS: Record<string, CourtInfo> = {
  "90210": { name: "Beverly Hills Courthouse", address: "9355 Burton Way, Beverly Hills, CA 90210", phone: "(310) 281-2499" },
  "10001": { name: "New York County Civil Court", address: "111 Centre Street, New York, NY 10013", phone: "(646) 386-5700" },
  "60611": { name: "Richard J. Daley Center", address: "50 W Washington St, Chicago, IL 60602", phone: "(312) 603-5030" },
  "33131": { name: "Miami-Dade County Courthouse", address: "73 W Flagler St, Miami, FL 33130", phone: "(305) 275-1155" },
  "77002": { name: "Harris County Civil Courthouse", address: "201 Caroline St, Houston, TX 77002", phone: "(713) 755-6758" },
  "94102": { name: "San Francisco Superior Court", address: "400 McAllister St, San Francisco, CA 94102", phone: "(415) 551-4000" },
  "02108": { name: "Suffolk Superior Courthouse", address: "3 Pemberton Square, Boston, MA 02108", phone: "(617) 788-8400" },
  "98104": { name: "King County Superior Court", address: "516 3rd Ave, Seattle, WA 98104", phone: "(206) 296-9300" },
  "80202": { name: "Denver County Court", address: "1437 Bannock St, Denver, CO 80202", phone: "(720) 865-7800" },
  "20001": { name: "Superior Court of D.C.", address: "500 Indiana Ave NW, Washington, DC 20001", phone: "(202) 879-1010" },
};

const formSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code."),
});

type FormValues = z.infer<typeof formSchema>;

export default function CourtFinder() {
  const [courtInfo, setCourtInfo] = useState<CourtInfo | null>(null);
  const [notFound, setNotFound] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const court = MOCK_COURTS[data.zipCode];
    if (court) {
      setCourtInfo(court);
      setNotFound(false);
    } else {
      setCourtInfo(null);
      setNotFound(true);
    }
  };

  return (
    <section id="court-finder" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
         <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Find Your Courthouse</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Enter the zip code where the incident occurred to find the correct small claims court.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Court Finder</CardTitle>
                <CardDescription>Enter a 5-digit zip code to find court information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder="e.g., 90210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Find Court</Button>
                    </form>
                </Form>

                {courtInfo && (
                    <div className="mt-6 p-4 border rounded-lg">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Building /> {courtInfo.name}</h3>
                        <p className="text-muted-foreground flex items-center gap-2 mt-2"><MapPin className="w-4 h-4"/> {courtInfo.address}</p>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1"><Phone className="w-4 h-4"/> {courtInfo.phone}</p>
                    </div>
                )}
                
                {notFound && (
                    <Alert variant="destructive" className="mt-6">
                        <AlertTitle>Not Found</AlertTitle>
                        <AlertDescription>
                            We couldn't find a court for that zip code in our sample data. Please check your local county or city government website for official information.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      </div>
    </section>
  );
}

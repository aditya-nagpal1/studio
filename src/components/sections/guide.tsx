"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

const initialSteps = [
  { id: "step1", label: "Send a Demand Letter", checked: false, description: "Formally ask the other party for payment or action before going to court." },
  { id: "step2", label: "File a Claim Form", checked: false, description: "Officially start your lawsuit by filing the required forms with the court." },
  { id: "step3", label: "Serve the Defendant", checked: false, description: "Legally notify the person or business you are suing about the case." },
  { id: "step4", label: "Prepare Your Evidence", checked: false, description: "Gather all documents, photos, and witness information to support your claim." },
  { id: "step5", label: "Attend Your Hearing", checked: false, description: "Present your case to the judge in court on your scheduled date." },
];

const LOCAL_STORAGE_KEY = "court-companion-guide-progress";

export default function Guide() {
  const [steps, setSteps] = useState(initialSteps);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress: { id: string; checked: boolean }[] = JSON.parse(savedProgress);
        // Merge saved progress with initial steps to ensure labels are up to date
        setSteps(currentSteps => currentSteps.map(step => {
            const savedStep = parsedProgress.find(s => s.id === step.id);
            return savedStep ? { ...step, checked: savedStep.checked } : step;
        }));
      }
    } catch (error) {
      console.error("Failed to load guide progress from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const progressToSave = steps.map(({ id, checked }) => ({ id, checked }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressToSave));
      } catch (error) {
        console.error("Failed to save guide progress to localStorage", error);
      }
    }
  }, [steps, isClient]);

  const handleCheckedChange = (id: string) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, checked: !step.checked } : step
      )
    );
  };
  
  const progressPercentage = (steps.filter(step => step.checked).length / steps.length) * 100;

  return (
    <section id="guide" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Your Roadmap to Justice</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Follow this interactive checklist to stay on track. Your progress is saved automatically.
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks /> Small Claims Process</CardTitle>
                <CardDescription>Check off items as you complete them.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-sm text-right text-muted-foreground">{Math.round(progressPercentage)}% Complete</p>
                </div>

                <div className="space-y-6">
                    {isClient && steps.map((step, index) => (
                        <div key={step.id} className="flex items-start">
                            <div className="flex items-center h-5">
                                <Checkbox
                                    id={step.id}
                                    checked={step.checked}
                                    onCheckedChange={() => handleCheckedChange(step.id)}
                                    aria-describedby={`${step.id}-description`}
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="ml-4 text-sm">
                                <label htmlFor={step.id} className={`font-medium text-lg ${step.checked ? 'line-through text-muted-foreground' : ''}`}>
                                    {index + 1}. {step.label}
                                </label>
                                <p id={`${step.id}-description`} className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {!isClient && <div>Loading checklist...</div>}
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}

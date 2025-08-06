
"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

const stepsContent = {
  en: [
    { id: "step1", label: "Send a Demand Letter", description: "Formally ask the other party for payment or action before going to court." },
    { id: "step2", label: "File a Claim Form", description: "Officially start your lawsuit by filing the required forms with the court." },
    { id: "step3", label: "Serve the Defendant", description: "Legally notify the person or business you are suing about the case." },
    { id: "step4", label: "Prepare Your Evidence", description: "Gather all documents, photos, and witness information to support your claim." },
    { id: "step5", label: "Attend Your Hearing", description: "Present your case to the judge in court on your scheduled date." },
  ],
  es: [
    { id: "step1", label: "Enviar una Carta de Demanda", description: "Solicite formalmente a la otra parte el pago o la acción antes de ir a juicio." },
    { id: "step2", label: "Presentar un Formulario de Reclamo", description: "Inicie oficialmente su demanda presentando los formularios requeridos en el tribunal." },
    { id: "step3", label: "Notificar al Demandado", description: "Notifique legalmente a la persona o empresa que está demandando sobre el caso." },
    { id: "step4", label: "Preparar su Evidencia", description: "Reúna todos los documentos, fotos e información de testigos para respaldar su reclamo." },
    { id: "step5", label: "Asistir a su Audiencia", description: "Presente su caso ante el juez en el tribunal en la fecha programada." },
  ]
};

const text = {
    title: { en: "Your Roadmap to Justice", es: "Su Hoja de Ruta hacia la Justicia" },
    description: { en: "Follow this interactive checklist to stay on track. Your progress is saved automatically.", es: "Siga esta lista de verificación interactiva para no perder el rumbo. Su progreso se guarda automáticamente." },
    cardTitle: { en: "Small Claims Process", es: "Proceso de Reclamos Menores" },
    cardDescription: { en: "Check off items as you complete them.", es: "Marque los elementos a medida que los completa." },
    complete: { en: "Complete", es: "Completado" },
    loading: { en: "Loading checklist...", es: "Cargando lista de verificación..." },
}

const LOCAL_STORAGE_KEY = "court-companion-guide-progress";

export default function Guide() {
  const { language, t } = useLanguage();
  const initialSteps = stepsContent[language].map(step => ({...step, checked: false}));
  const [steps, setSteps] = useState(initialSteps);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress: { id: string; checked: boolean }[] = JSON.parse(savedProgress);
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
      const newSteps = stepsContent[language];
      setSteps(currentSteps => newSteps.map(newStep => {
          const existingStep = currentSteps.find(cs => cs.id === newStep.id);
          return { ...newStep, checked: existingStep?.checked || false };
      }));
  }, [language]);

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
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t(text.title)}</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t(text.description)}
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks /> {t(text.cardTitle)}</CardTitle>
                <CardDescription>{t(text.cardDescription)}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-sm text-right text-muted-foreground">{Math.round(progressPercentage)}% {t(text.complete)}</p>
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
                    {!isClient && <div>{t(text.loading)}</div>}
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}

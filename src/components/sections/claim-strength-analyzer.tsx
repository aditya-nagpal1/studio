
"use client";

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Gavel, HelpCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

const text = {
    title: { en: "Analyze Your Claim's Strength", es: "Analice la Fortaleza de su Reclamo" },
    description: { en: "Get an instant assessment of your case's potential. This is not legal advice, but a tool to help you strategize.", es: "Obtenga una evaluación instantánea del potencial de su caso. Esto no es un consejo legal, sino una herramienta para ayudarlo a crear una estrategia." },
    cardTitle: { en: "Case Assessment", es: "Evaluación del Caso" },
    cardDescription: { en: "Answer these questions for a quick analysis.", es: "Responda estas preguntas para un análisis rápido." },
    q1: { en: "Do you have written evidence (contracts, emails, photos)?", es: "¿Tiene evidencia por escrito (contratos, correos electrónicos, fotos)?" },
    q2: { en: "Have you sent a formal demand letter?", es: "¿Ha enviado una carta de demanda formal?" },
    q3: { en: "Was the incident less than 3 years ago?", es: "¿Ocurrió el incidente hace menos de 3 años?" },
    q4: { en: "Did you clearly tell the other party they were at fault?", es: "¿Le dijo claramente a la otra parte que ellos tuvieron la culpa?" },
    q5: { en: "Have you documented all your expenses and losses?", es: "¿Ha documentado todos sus gastos y pérdidas?" },
    yes: { en: "Yes", es: "Sí" },
    no: { en: "No", es: "No" },
    awaitingInput: { en: "Awaiting Input", es: "Esperando Información" },
    awaitingInputDesc: { en: "Please answer all questions to see your claim strength.", es: "Por favor, responda todas las preguntas para ver la fortaleza de su reclamo." },
    strongCase: { en: "Strong Case", es: "Caso Sólido" },
    strongCaseDesc: { en: "You have key elements in place, such as written evidence and timely action, which significantly strengthen your claim.", es: "Tiene elementos clave, como evidencia por escrito y acción oportuna, que fortalecen significativamente su reclamo." },
    moderateChance: { en: "Moderate Chance", es: "Probabilidad Moderada" },
    moderateChanceDesc: { en: "Your case has some good points, but could be strengthened. Consider gathering more evidence or sending a formal demand letter.", es: "Su caso tiene algunos puntos buenos, pero podría fortalecerse. Considere reunir más evidencia o enviar una carta de demanda formal." },
    weakClaim: { en: "Weak Claim", es: "Reclamo Débil" },
    weakClaimDesc: { en: "Your case may face challenges. Lacking written evidence or clear communication can make it difficult to win.", es: "Su caso puede enfrentar desafíos. La falta de evidencia por escrito o una comunicación clara puede dificultar la victoria." },
    claimStrengthScore: { en: "Claim Strength Score", es: "Puntuación de Fortaleza del Reclamo" },
    progress: { en: "Progress", es: "Progreso" },
}

type Answers = {
  evidence: 'yes' | 'no' | null;
  demandLetter: 'yes' | 'no' | null;
  timeline: 'yes' | 'no' | null;
  communication: 'yes' | 'no' | null;
  expenses: 'yes' | 'no' | null;
};

export default function ClaimStrengthAnalyzer() {
  const [answers, setAnswers] = useState<Answers>({
    evidence: null,
    demandLetter: null,
    timeline: null,
    communication: null,
    expenses: null,
  });
  const { t } = useLanguage();

  const handleValueChange = (key: keyof Answers, value: 'yes' | 'no') => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const { score, verdict, explanation, Icon, progress } = useMemo(() => {
    let currentScore = 0;
    const answeredQuestions = Object.values(answers).filter(v => v !== null).length;

    if (answers.evidence === 'yes') currentScore += 3;
    if (answers.demandLetter === 'yes') currentScore += 2;
    if (answers.timeline === 'yes') currentScore += 2;
    if (answers.communication === 'yes') currentScore += 2;
    if (answers.expenses === 'yes') currentScore += 1;
    
    const maxScore = 10;
    
    if (answeredQuestions < 5) {
      return { score: 0, progress: answeredQuestions * 20, verdict: t(text.awaitingInput), explanation: t(text.awaitingInputDesc), Icon: HelpCircle };
    }

    if (currentScore >= 8) {
      return { score: currentScore, progress: currentScore * 10, verdict: t(text.strongCase), explanation: t(text.strongCaseDesc), Icon: ShieldCheck };
    } else if (currentScore >= 5) {
      return { score: currentScore, progress: currentScore * 10, verdict: t(text.moderateChance), explanation: t(text.moderateChanceDesc), Icon: Gavel };
    } else {
      return { score: currentScore, progress: currentScore * 10, verdict: t(text.weakClaim), explanation: t(text.weakClaimDesc), Icon: ShieldAlert };
    }
  }, [answers, t]);

  return (
    <section id="analyzer" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">{t(text.title)}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t(text.description)}
            </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
                <CardTitle>{t(text.cardTitle)}</CardTitle>
                <CardDescription>{t(text.cardDescription)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">{t(text.q1)}</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('evidence', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="e_yes" /><Label htmlFor="e_yes">{t(text.yes)}</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="e_no" /><Label htmlFor="e_no">{t(text.no)}</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-base">{t(text.q2)}</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('demandLetter', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="d_yes" /><Label htmlFor="d_yes">{t(text.yes)}</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="d_no" /><Label htmlFor="d_no">{t(text.no)}</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-base">{t(text.q3)}</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('timeline', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="t_yes" /><Label htmlFor="t_yes">{t(text.yes)}</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="t_no" /><Label htmlFor="t_no">{t(text.no)}</Label></div>
                </RadioGroup>
              </div>
               <div className="space-y-2">
                <Label className="text-base">{t(text.q4)}</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('communication', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="c_yes" /><Label htmlFor="c_yes">{t(text.yes)}</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="c_no" /><Label htmlFor="c_no">{t(text.no)}</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-base">{t(text.q5)}</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('expenses', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="exp_yes" /><Label htmlFor="exp_yes">{t(text.yes)}</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="exp_no" /><Label htmlFor="exp_no">{t(text.no)}</Label></div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center">
            <Card className="w-full bg-background">
                <CardHeader className="items-center text-center">
                   <Icon className="w-16 h-16 text-primary" />
                   <CardTitle className="text-3xl font-headline">{verdict}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                   <p className="text-muted-foreground">{explanation}</p>
                   <div>
                       <Label>{score > 0 ? `${t(text.claimStrengthScore)}: ${score}/10` : t(text.progress)}</Label>
                       <Progress value={progress} className="w-full mt-2" />
                   </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Gavel, HelpCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

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
      return { score: 0, progress: answeredQuestions * 20, verdict: 'Awaiting Input', explanation: 'Please answer all questions to see your claim strength.', Icon: HelpCircle };
    }

    if (currentScore >= 8) {
      return { score: currentScore, progress: currentScore * 10, verdict: 'Strong Case', explanation: 'You have key elements in place, such as written evidence and timely action, which significantly strengthen your claim.', Icon: ShieldCheck };
    } else if (currentScore >= 5) {
      return { score: currentScore, progress: currentScore * 10, verdict: 'Moderate Chance', explanation: 'Your case has some good points, but could be strengthened. Consider gathering more evidence or sending a formal demand letter.', Icon: Gavel };
    } else {
      return { score: currentScore, progress: currentScore * 10, verdict: 'Weak Claim', explanation: 'Your case may face challenges. Lacking written evidence or clear communication can make it difficult to win.', Icon: ShieldAlert };
    }
  }, [answers]);

  return (
    <section id="analyzer" className="w-full py-20 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Analyze Your Claim's Strength</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get an instant assessment of your case's potential. This is not legal advice, but a tool to help you strategize.
            </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
                <CardTitle>Case Assessment</CardTitle>
                <CardDescription>Answer these questions for a quick analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">Do you have written evidence (contracts, emails, photos)?</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('evidence', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="e_yes" /><Label htmlFor="e_yes">Yes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="e_no" /><Label htmlFor="e_no">No</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Have you sent a formal demand letter?</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('demandLetter', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="d_yes" /><Label htmlFor="d_yes">Yes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="d_no" /><Label htmlFor="d_no">No</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Was the incident less than 3 years ago?</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('timeline', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="t_yes" /><Label htmlFor="t_yes">Yes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="t_no" /><Label htmlFor="t_no">No</Label></div>
                </RadioGroup>
              </div>
               <div className="space-y-2">
                <Label className="text-base">Did you clearly tell the other party they were at fault?</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('communication', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="c_yes" /><Label htmlFor="c_yes">Yes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="c_no" /><Label htmlFor="c_no">No</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-base">Have you documented all your expenses and losses?</Label>
                <RadioGroup onValueChange={(v: 'yes' | 'no') => handleValueChange('expenses', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="exp_yes" /><Label htmlFor="exp_yes">Yes</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="exp_no" /><Label htmlFor="exp_no">No</Label></div>
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
                       <Label>{score > 0 ? `Claim Strength Score: ${score}/10` : 'Progress'}</Label>
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

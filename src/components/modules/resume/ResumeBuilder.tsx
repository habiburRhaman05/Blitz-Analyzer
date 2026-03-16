'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Loader2, CloudCheck, Sparkles, X, LayoutDashboard, Download, Eye, 
  User, FileText, Briefcase, GraduationCap, Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ResumePreview } from "./ResumePreview";
import { SkeletonBuilder } from "./SkelectionBuilder";
import { ResumeFormData } from "@/interfaces/resume";
import { useDebounce } from "@/hooks/useDebounce";

// Steps & Validation
import { OverviewStep, validateResume } from "./steps/OverView";
import { PersonalStep } from "./steps/PersonalStep";
import { SummaryStep } from "./steps/SummaryStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { EducationStep } from "./steps/EducationStep";
import { SkillsStep } from "./steps/SkillsStep";
import { useApiMutation } from "@/hooks/useApiMutation";

const SECTION_MAP: Record<string, { label: string; icon: any; component: any }> = {
  personal: { label: "Basics", icon: <User className="h-3.5 w-3.5" />, component: PersonalStep },
  summary: { label: "Summary", icon: <FileText className="h-3.5 w-3.5" />, component: SummaryStep },
  experience: { label: "Experience", icon: <Briefcase className="h-3.5 w-3.5" />, component: ExperienceStep },
  education: { label: "Education", icon: <GraduationCap className="h-3.5 w-3.5" />, component: EducationStep },
  skills: { label: "Skills", icon: <Zap className="h-3.5 w-3.5" />, component: SkillsStep },
};

const DEFAULT_FORM_DATA: ResumeFormData = {
  personal: { fullName: "", email: "", phone: "", location: "", title: "", linkedin: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

// Success Overlay Component
const SuccessOverlay = ({ resumeUrl, onDashboard }: { resumeUrl: string, onDashboard: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="fixed inset-0 z-[200] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl border border-white/10"
    >
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CloudCheck className="h-10 w-10 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Resume is Ready!</h2>
      <p className="text-zinc-500 text-sm mb-8">Your professional resume has been generated and is ready for download.</p>
      
      <div className="grid gap-3">
        <Button 
          onClick={() => window.open(resumeUrl, '_blank')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold"
        >
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button 
          variant="ghost" 
          onClick={onDashboard}
          className="w-full text-zinc-500 hover:text-zinc-800 dark:hover:text-white font-semibold"
        >
          Back to Dashboard
        </Button>
      </div>
    </motion.div>
  </motion.div>
);

export default function ResumeBuilderPageForm({ builderId, id }: { builderId: string, id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const [formData, setFormData] = useState<ResumeFormData>(DEFAULT_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [successData, setSuccessData] = useState<{ url: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const generateResumeMutation = useApiMutation({
    actionName: "generate-resume",
    actionType: "SERVER_SIDE",
    endpoint: "/resume/create-resume",
    method: "POST"
  });

  const handleGenerateResume = async () => {
    try {
      setIsGenerating(true);
      const res = await generateResumeMutation.mutateAsync({
        templateId: id,
        resumeId: builderId,
        resumeData: formData
      });

      if (res.success) {
        setSuccessData({ url: res.data.resumeUrl });
      }
    } catch (error) {
      console.error("Failed to generate resume:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const { data: apiResponse, isFetching } = useApiQuery(["templates", id], `/template/templateDetails/${id}`, "axios");
  const template = apiResponse?.data;

  useEffect(() => {
    if (template?.resumeData) {
      setFormData(template.resumeData);
    } else {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [template]);

  const dynamicSteps = useMemo(() => {
    if (!template?.sections) return [];
    
    const steps = template.sections.map((sec: any) => ({
      id: sec.key,
      label: sec.label,
      icon: SECTION_MAP[sec.key]?.icon || <LayoutDashboard className="h-3.5 w-3.5" />
    }));

    return [...steps, { id: "overview", label: "Review", icon: <LayoutDashboard className="h-3.5 w-3.5" /> }];
  }, [template]);

  const debouncedFormData = useDebounce(formData, 800);
  const { isValid: canGenerate } = useMemo(() => validateResume(formData), [formData]);

  const handleDataChange = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  if (isFetching || !template) return <SkeletonBuilder />;

  const activeStep = dynamicSteps[currentStep];
  const isLastStep = currentStep === dynamicSteps.length - 1;

  return (
    <div className="h-screen bg-white dark:bg-zinc-950 flex flex-col overflow-hidden relative">
      <AnimatePresence>
        {successData && (
          <SuccessOverlay 
            resumeUrl={successData.url} 
            onDashboard={() => router.push('/dashboard')} 
          />
        )}
      </AnimatePresence>

      <header className="h-14 border-b px-4 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-[60]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-bold truncate max-w-[150px]">
            {isEditMode ? `Editing: ${template.name}` : template.name}
          </h1>
          <div className="flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-md">
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin text-zinc-400" /> : <CloudCheck className="h-3 w-3 text-emerald-500" />}
            <span className="text-[10px] font-bold text-zinc-500 uppercase">{isSaving ? "Syncing" : "Saved"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden h-8 rounded-full" onClick={() => setShowMobilePreview(!showMobilePreview)}>
            {showMobilePreview ? <X className="h-3.5 w-3.5 mr-2" /> : <Eye className="h-3.5 w-3.5 mr-2" />}
            Preview
          </Button>
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 text-xs font-bold">
            <Sparkles className="h-3 w-3 mr-2" /> AI Review
          </Button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_580px] overflow-hidden">
        <div className="flex flex-col relative h-full bg-zinc-50/20 dark:bg-zinc-950">
          <nav className="sticky top-0 z-40 w-full border-b bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl px-4 py-3 flex gap-1.5 overflow-x-auto no-scrollbar">
            {dynamicSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0
                  ${idx === currentStep 
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg' 
                    : 'bg-white text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'}`}
              >
                {step.icon} {step.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto p-6 md:p-12 pb-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeStep?.id === "overview" ? (
                    <OverviewStep 
                      data={formData} 
                      onNavigate={(id) => setCurrentStep(dynamicSteps.findIndex(s => s.id === id))} 
                    />
                  ) : (() => {
                      const stepId = activeStep?.id;
                      const StepComponent = SECTION_MAP[stepId]?.component;
                      if (!StepComponent) return <div className="p-10 text-center">Loading section...</div>;
                      
                      return (
                        <StepComponent 
                          data={formData[stepId as keyof ResumeFormData] || DEFAULT_FORM_DATA[stepId as keyof ResumeFormData]} 
                          onChange={(val: any) => handleDataChange(stepId, val)} 
                        />
                      );
                    })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-auto z-50">
            <div className="bg-zinc-900 dark:bg-zinc-100 p-2 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
              <Button 
                variant="ghost" 
                disabled={currentStep === 0} 
                onClick={() => setCurrentStep(s => s - 1)}
                className="text-zinc-400 hover:text-white dark:text-zinc-500 rounded-xl"
              >
                Back
              </Button>
              
              <div className="flex gap-1 mx-2">
                {dynamicSteps.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-blue-500' : 'w-1.5 bg-zinc-700 dark:bg-zinc-300'}`} />
                ))}
              </div>

              {isLastStep ? (
                <Button 
                  disabled={isGenerating || !canGenerate} 
                  onClick={handleGenerateResume}
                  className={`rounded-xl px-6 font-bold flex items-center gap-2 shadow-lg transition-all
                    ${!canGenerate ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isEditMode ? "Save" : "Generate"}
                </Button>
              ) : (
                <Button 
                  onClick={() => setCurrentStep(s => s + 1)}
                  className="bg-white text-black dark:bg-zinc-900 dark:text-white rounded-xl px-8 font-bold"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="hidden lg:block border-l bg-zinc-100/30 dark:bg-zinc-950 p-6 overflow-hidden">
          <ResumePreview htmlLayout={template.htmlLayout} resumeData={debouncedFormData} />
        </aside>

        <AnimatePresence>
          {showMobilePreview && (
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 p-4 pt-16 lg:hidden">
              <ResumePreview htmlLayout={template.htmlLayout} resumeData={debouncedFormData} />
              <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setShowMobilePreview(false)}><X /></Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForm,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  AlertCircle,
  Download,
  Cloud,
  CloudOff,
} from "lucide-react";
import Handlebars from "handlebars";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SkeletonBuilder } from "./SkelectionBuilder";
import { useApiQuery } from "@/hooks/useApiQuery";

import type { DynamicSection } from "@/interfaces/builder";
import {
  countErrorsForSection,
  deepEqual,
  generateZodSchema,
  normalizeResumeData,
} from "@/validations-schemas/auth/resume-builder.schema"
import { SectionRenderer } from "./builder/ResumeBuilderField";
import { ResumePreview } from "./ResumePreview";
import httpClient from "@/lib/axios-client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { updateResumeName } from "@/services/resume.services";
import { getAllTemplateDetailsPublic } from "@/services/admin.services";
import { useQuery } from "@tanstack/react-query";


export default function PremiumResumeBuilder({
  id,
  builderId,
}: {
  id: string;
  builderId: string;
}) {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement | null>(null);
const searchParams = useSearchParams();
  const page_mode = searchParams.get('mode')// e.g., if URL is /page?name=test
  const [currentStep, setCurrentStep] = useState(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sectionValidationMap, setSectionValidationMap] = useState<
    Record<string, { valid: boolean; count: number; fields: string[] }>
  >({});

  
  const { data: apiResponse, isFetching } = useQuery(
    {
      queryKey:[`templates-${id}`],
      queryFn:()=>getAllTemplateDetailsPublic(id)
    }
  )

  const template: any = apiResponse?.data;
  console.log(template);

  const findCurrentResume = (template) =>{
    console.log(template);
    
  //  if(isEditMode){
     const crr = template.resume?.map((res) => {
      if(res.id === builderId){
        return res.resumeData
      }
    })
    return crr[0]
  //  }
  }
  


  

  const sections: DynamicSection[] = useMemo(
    () => [...(template?.sections || [])].sort((a, b) => a.order - b.order),
    [template]
  );

  const dynamicSchema = useMemo(() => generateZodSchema(sections), [sections]);

  const methods = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const { watch, handleSubmit, trigger, reset, formState } = methods;
  const formData = watch();

  useEffect(() => {
    if (!template) return;
   const crr = template && template?.resume?.filter((res) => {
     return res.id === builderId
    })

    console.log(crr);
    

    const normalized = normalizeResumeData(sections,  crr[0].resumeData || {});
    reset(normalized);
    setLastSaved(new Date());
    setCurrentStep(0);
    setReviewMode(false);
  }, [template, reset, sections]);

  const prevDataRef = useRef<any>(null);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performAutoSave = useCallback(async (data: any) => {
    // setIsAutoSaving(true);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // setLastSaved(new Date());
    // setIsAutoSaving(false);
    // toast.success("Progress auto-saved", { id: "auto-save" });
  }, []);

  // useEffect(() => {
  //   if (!prevDataRef.current) {
  //     prevDataRef.current = formData;
  //     return;
  //   }

  //   if (!deepEqual(prevDataRef.current, formData)) {
  //     if (autoSaveTimeoutRef.current) {
  //       clearTimeout(autoSaveTimeoutRef.current);
  //     }

  //     autoSaveTimeoutRef.current = setTimeout(() => {
  //       performAutoSave(formData);
  //       prevDataRef.current = formData;
  //     }, 2000);
  //   }

  //   return () => {
  //     if (autoSaveTimeoutRef.current) {
  //       clearTimeout(autoSaveTimeoutRef.current);
  //     }
  //   };
  // }, [formData, performAutoSave]);

  const progressPercent = useMemo(() => {
    if (!sections.length) return 0;

    const filled = sections.reduce((acc, sec) => {
      const secValues = (formData as any)[sec.key];
      if (!secValues) return acc;

      if (Array.isArray(secValues)) {
        const hasAny = secValues.some((it: any) =>
          Object.values(it || {}).some(
            (v) => v !== undefined && v !== "" && v !== null
          )
        );
        return acc + (hasAny ? 1 : 0);
      }

      const hasAny = Object.values(secValues || {}).some(
        (v) => v !== undefined && v !== "" && v !== null
      );
      return acc + (hasAny ? 1 : 0);
    }, 0);

    return Math.round((filled / sections.length) * 100);
  }, [formData, sections]);

  const validateAllSections = async () => {
    const map: Record<string, { valid: boolean; count: number; fields: string[] }> = {};

    for (const sec of sections) {
      const isValid = await trigger(sec.key as any);
      const errorsSnapshot = methods.formState.errors;
      const { count, fields } = countErrorsForSection(errorsSnapshot, sec.key);

      map[sec.key] = { valid: isValid, count, fields };
    }

    setSectionValidationMap(map);
    return map;
  };

  useEffect(() => {
    if (reviewMode) {
      validateAllSections();
      setShowMobilePreview(false);
    }
  }, [reviewMode]);

  const onSubmit = async (data: any) => {
      setIsGenerating(true);
       const result =  await updateResumeName(builderId,{resumeData:data,templateId:id} );
  if(result.success){
 toast.success("Resume saved successfully!");
    setLastSaved(new Date());
    setIsGenerating(false);
  }
   
  };
  

  const handleGenerateResume = async () => {
    if (!template?.htmlLayout) return;

    setIsDownloading(true);
    try {
      
      const result = await (await httpClient.post(`/resume/${builderId}/generate-download`)).data
console.log(result);

      if(result.success){
        console.log(result.data);
     
        setShowSuccessModal(true);

        handleClickDownload(result.data.resumeUrl)

        toast.success("Your Resume is Downloaded");
      }

     

    } catch (err) {
      toast.error("Failed to generate resume");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClickDownload = (url:string)=>{
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.slug || "resume"}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  }

  const nextStep = async () => {
    if (reviewMode) {
      setReviewMode(false);
      return;
    }

    const currentKey = sections[currentStep]?.key;
    if (!currentKey) return;

    const valid = await trigger(currentKey as any);

    if (!valid) {
      const errorsSnapshot = methods.formState.errors;
      const { count, fields } = countErrorsForSection(errorsSnapshot, currentKey);

      setSectionValidationMap((prev) => ({
        ...prev,
        [currentKey]: { valid, count, fields },
      }));

      const container = document.querySelector("#form-scroll-container");
      (container as HTMLElement | null)?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep < sections.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setReviewMode(true);
    }
  };

  if (isFetching || !template) return <SkeletonBuilder />;

  const activeSection = sections[currentStep];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 flex flex-col h-screen overflow-hidden">
      <div
        ref={headerRef}
        className="h-16 border-b px-4 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-50"
      >
        
     
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">{template.name}</h1>
            <p className="text-xs text-zinc-400 mt-0.5">SaaS Resume Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full lg:hidden"
            onClick={() => setShowMobilePreview((s) => !s)}
          >
            {showMobilePreview ? "Hide" : "Preview"}
          </Button>

          {/* <div className="flex items-center gap-2 text-xs text-zinc-500">
            {isAutoSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Cloud className="h-3 w-3" />
                <span className="hidden sm:inline">
                  Saved {format(lastSaved, "HH:mm")}
                </span>
              </>
            ) : (
              <CloudOff className="h-3 w-3" />
            )}
          </div> */}

        {page_mode === "edit" &&   <Button
                    type="submit"
                    onClick={() =>onSubmit(formData)}
                    disabled={isGenerating}
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 sm:px-5 font-medium"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>}

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleGenerateResume}
            disabled={isDownloading}
            className="rounded-full"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Generate Resume</span>
          </Button>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-transparent">
        <div className="px-4 sm:px-6">
          <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progressPercent}%` }}
              aria-hidden
            />
          </div>
        </div>

        <nav className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto no-scrollbar">
          {sections.map((sec, idx) => {
            const isActive = idx === currentStep && !reviewMode;
            return (
              <button
                type="button"
                key={sec.key}
                onClick={() => {
                  setCurrentStep(idx);
                  setReviewMode(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-transparent"
                }`}
              >
                <span className="opacity-60">0{idx + 1}</span>
                <span className="max-w-[140px] truncate">{sec.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setReviewMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
              reviewMode
                ? "bg-emerald-600 text-white shadow"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <span>Review</span>
          </button>
        </nav>
      </div>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <section
          className={`flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden ${
            showMobilePreview ? "hidden lg:flex" : "flex"
          }`}
        >
          <div
            id="form-scroll-container"
            className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"
          >
            <div className="w-full max-w-4xl mx-auto">
              <header className="mb-6">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {reviewMode ? "Review & Validate" : activeSection.label}
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  {reviewMode
                    ? "Validate each section — missing fields will be highlighted. Click a section to jump and fix."
                    : "Complete this section to update your resume in real-time."}
                </p>
              </header>

              <FormProvider {...methods}>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={reviewMode ? "review" : activeSection.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.12 }}
                    >
                      {reviewMode ? (
                        <div className="space-y-4">
                          {sections.map((sec, idx) => {
                            const mapEntry = sectionValidationMap[sec.key];
                            const count = mapEntry?.count ?? 0;
                            const valid = mapEntry?.valid ?? false;
                            const fields = mapEntry?.fields ?? [];

                            return (
                              <div
                                key={sec.key}
                                className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="flex-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCurrentStep(idx);
                                      setReviewMode(false);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="text-left w-full"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                          valid
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                      >
                                        {valid ? (
                                          <Check className="h-4 w-4" />
                                        ) : (
                                          <AlertCircle className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div className="text-left">
                                        <div className="font-semibold text-zinc-900 dark:text-white">
                                          {sec.label}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                          {valid
                                            ? "All fields valid"
                                            : `${count} missing / invalid field(s)`}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </div>

                                {!valid && fields.length > 0 && (
                                  <div className="mt-3 sm:mt-0 text-sm text-destructive">
                                    <div className="font-medium mb-1">
                                      Missing / invalid:
                                    </div>
                                    <ul className="list-disc ml-4">
                                      {fields.map((f, i) => (
                                        <li key={i} className="truncate max-w-[220px]">
                                          {f}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <SectionRenderer section={activeSection} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </form>
              </FormProvider>
            </div>
          </div>

          <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={currentStep === 0 && !reviewMode}
                  onClick={() =>
                    reviewMode
                      ? setReviewMode(false)
                      : setCurrentStep((s) => Math.max(0, s - 1))
                  }
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" /> Back
                </Button>
              </div>

              <div className="flex-1 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 items-center">
                    {sections.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === currentStep && !reviewMode
                            ? "w-8 bg-blue-500"
                            : "w-2 bg-zinc-300 dark:bg-zinc-700"
                        }`}
                      />
                    ))}
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        reviewMode ? "w-8 bg-emerald-500" : "w-2 bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="ml-3 text-xs text-zinc-500">
                    Progress: {progressPercent}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {reviewMode ? (
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isGenerating}
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 sm:px-5 font-medium"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-black rounded-xl px-4 sm:px-5 font-medium"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${
            showMobilePreview ? "flex" : "hidden"
          } lg:flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden p-4 lg:p-6`}
        >
          <ResumePreview template={template} data={formData} />
        </section>
      </main>

    </div>
  );
}
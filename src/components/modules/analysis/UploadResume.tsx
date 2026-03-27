"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Shield,
  Sparkles,
  Upload
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import httpClient from "@/lib/axios-client";
import { AnalysisType } from "@/interfaces/enums";
import { handleAnalysis } from "@/services/analysis.services";



const analysisOptions = [
  {
    type: AnalysisType.ATS_SCAN ,
    icon: Shield,
    label: "ATS Resume Scan",
    desc: "Deep-scan your resume for ATS compatibility, formatting issues, and keyword density",
    features: ["ATS score analysis", "Format validation", "Keyword density check"],
    disabled:false

  },
  {
    type: AnalysisType.JOB_MATCHER,
    icon: Briefcase,
    label: "Job Match Analysis",
    desc: "Compare your resume against a specific job posting for tailored feedback",
    features: ["Skill gap detection", "Keyword matching", "Requirement alignment"],
    disabled:true
  },
];

export default function UploadPage() {
  const router = useRouter();

  // Local State Management
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Form Data State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.ATS_SCAN);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keyRequirements, setKeyRequirements] = useState("");

  // Logic: File Handling
  const handleFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      toast.error("Only PDF and DOCX files are supported");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setResumeFile(file);
    setErrors((e) => ({ ...e, file: "" }));
  }, []);

  // Logic: Drag & Drop
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  // Logic: Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!resumeFile) errs.file = "Please upload a resume";
    
    if (analysisType === AnalysisType.JOB_MATCHER) {
      if (!jobTitle.trim()) errs.jobTitle = "Job title is required";
      if (!jobDescription.trim()) errs.jobDescription = "Job description is required";
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Logic: Form Submission
const handleSubmit = async () => {
    // 1. Run Validation
    if (!validate() || !resumeFile) return;

    // 2. Start Loading State
    setIsUploading(true);

    try {
      // 3. Prepare FormData
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("analysisType", analysisType);

      // If Job Match, append the nested data as a stringified JSON
      if (analysisType === AnalysisType.JOB_MATCHER) {
        formData.append(
          "jobData", 
          JSON.stringify({
            title: jobTitle,
            description: jobDescription,
            requirements: keyRequirements,
          })
        );
      }

      // 4. Send Request via httpClient
      // Note: Use a template literal to define the specific endpoint for the type
    

      // 5. Handle Success
      const result = await handleAnalysis(formData) // Assuming your axios client returns data directly
      console.log(result);
      toast.success("starting")
      // // Redirect to the processing or results page using the ID from backend
      router.push(`/analysis/${result?.data?.analysisId || result?.analysisId}?type=new`);
      
    } catch (error: any) {
      // 6. Handle Errors
      console.error("Analysis Error:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload resume. Please try again.";
    } finally {
      // 7. Stop Loading State
      setIsUploading(false);
    }
  };

  const isJobMatch = analysisType === AnalysisType.JOB_MATCHER ? true :false;

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative container mx-auto flex items-center gap-4 px-6 py-6">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-display text-xl font-bold text-primary">ResumeAI</h2>
      </nav>

      <div className="relative container mx-auto max-w-3xl px-6 py-8 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div className="mb-10">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              Step 1 of 2 — Configuration
            </span>
            <h1 className="font-display text-4xl font-bold md:text-5xl">
              Upload Your <span className="text-primary">Resume</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              We'll analyze it with AI and give you actionable insights in seconds.
            </p>
          </div>

          {/* Upload Area */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-14 transition-all duration-300 ${
                dragOver ? "border-primary bg-primary/5 scale-[1.01]"
                  : errors.file ? "border-destructive bg-destructive/5"
                  : resumeFile ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:bg-card/80"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input id="file-input" type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              
              {resumeFile ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3"><FileText className="h-8 w-8 text-primary" /></div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB • Change file</p>
                  </div>
                  <CheckCircle2 className="ml-2 h-5 w-5 text-primary" />
                </motion.div>
              ) : (
                <>
                  <div className="mb-4 rounded-2xl bg-muted/50 p-4 transition-colors group-hover:bg-primary/10">
                    <Upload className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="font-display text-lg font-semibold">Drag & drop your resume here</p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse • PDF, DOCX up to 10MB</p>
                </>
              )}
            </div>
          </motion.div>
          {errors.file && <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="h-3.5 w-3.5" /> {errors.file}</p>}

          {/* Analysis Options */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-10">
            <Label className="mb-4 block font-display text-lg font-semibold">Choose Analysis Type</Label>
            <div className="grid gap-4 md:grid-cols-2">
              {analysisOptions.map((opt) => {
                const isActive = analysisType === opt.type;
                return (
                  <motion.button disabled={opt.disabled} key={opt.type} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={() => setAnalysisType(opt.type)}
                    className={`relative flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-all duration-300 ${
                      isActive ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80"
                    }`}
                  >
                    {isActive && <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-primary" />}
                    <div className={`rounded-xl p-2.5 ${isActive ? "bg-primary/15" : "bg-muted/50"}`}>
                      <opt.icon className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-display font-semibold">{opt.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{opt.desc}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {opt.features.map((f) => (
                        <span key={f} className={`rounded-full px-2.5 py-0.5 text-xs ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{f}</span>
                      ))}
                    </div>

                    <span className="text-center text-red-800 font-semibold">{opt.type === "JOB_MATCHER" && "This Service is Tempory Disabled "}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Conditional Job Match Fields */}
          <AnimatePresence mode="wait">
            {isJobMatch && (
              <motion.div key="job-match-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div  className="mt-8 space-y-5 rounded-2xl border border-primary/10 bg-primary/[0.02] p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Job Match Details</span>
                  </div>
                  <div>
                    <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title <span className="text-destructive">*</span></Label>
                    <Input id="jobTitle" placeholder="e.g. Senior Frontend Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="mt-1.5 border-border/50 bg-background/50" />
                    {errors.jobTitle && <p className="mt-1 text-sm text-destructive">{errors.jobTitle}</p>}
                  </div>
                  <div>
                    <Label htmlFor="jobDesc" className="text-sm font-medium">Job Description <span className="text-destructive">*</span></Label>
                    <Textarea id="jobDesc" placeholder="Paste the full job description here..." rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="mt-1.5 border-border/50 bg-background/50" />
                    {errors.jobDescription && <p className="mt-1 text-sm text-destructive">{errors.jobDescription}</p>}
                  </div>
                  <div>
                    <Label htmlFor="reqs" className="text-sm font-medium">Key Requirements <span className="text-xs text-muted-foreground">(optional)</span></Label>
                    <Textarea id="reqs" placeholder="List specific skills or qualifications..." rows={3} value={keyRequirements} onChange={(e) => setKeyRequirements(e.target.value)} className="mt-1.5 border-border/50 bg-background/50" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10">
            <Button size="lg" className="w-full rounded-xl bg-primary text-primary-foreground text-base font-semibold h-14" onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? "Uploading..." : <>Analyze Resume <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Free analysis • No account required • Results in ~30 seconds</p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
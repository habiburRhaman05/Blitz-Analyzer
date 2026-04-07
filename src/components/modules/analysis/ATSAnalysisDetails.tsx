"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Layers, Lightbulb,
  Loader,
  ShieldCheck,
  Target,
  Zap
} from "lucide-react";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "./AnalysisNotFound";
import SaveAnalysisResult from "./SaveAnalysisResult";
import { useApiMutation } from "@/hooks/useApiMutation";
import { toast } from "sonner";

interface AnalysisPageProps {
  analysisData: any;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  cacheKey: string;
}

export default function AnalysisDetails({ analysisData, onRetry, cacheKey }: AnalysisPageProps) {
  const router = useRouter();

  // ১. ডাটা নরমালাইজেশন
  const analysisResult = useMemo(() => {
    
    console.log("analysisData",analysisData);
    if (!analysisData) return null;
    
    return analysisData.result ? analysisData.result : analysisData;
  }, [analysisData]);

  // ২. মেটাডাটা
  const analysisId = analysisData?.id || null;
  const initialReportUrl = analysisData?.reportUrl || "";

  const [activeTab, setActiveTab] = useState("overview");
  const [generatedReportUrl, setGeneratedReportUrl] = useState("");

  const handleBack = () => {
    router.back();
  };

  const reportMutation = useApiMutation({
    endpoint: `/analyzer/analysis/generate-report/${analysisId}`,
    actionName: "Generate Report",
    actionType: "SERVER_SIDE",
    method: "POST"
  });

  const generateAtsReport = async () => {
    const currentUrl = generatedReportUrl || initialReportUrl;

    if (currentUrl) {
      toast.success("Downloading report...");
      const a = document.createElement("a");
      a.href = currentUrl;
      a.target = "_blank";
      a.download = `ATS_Report_${analysisId || "result"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (!analysisId) {
      toast.error("Analysis ID not found.");
      return;
    }

    try {
      const response = await reportMutation.mutateAsync({});
      if (response.success) {
        setGeneratedReportUrl(response.data);
        const a = document.createElement("a");
        a.href = response.data;
        a.download = `ATS_Report_${analysisId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (onRetry) onRetry();
      }
    } catch (err) {
      console.error("Report generation error:", err);
    }
  };

  if (!analysisResult) return null;


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Button onClick={handleBack} variant="ghost" size="sm" className="h-8 rounded-full px-2 hover:bg-muted/80 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <span className="text-border">/</span>
              <span className="text-primary font-medium">ATS Scan Result</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Resume <span className="text-primary">Analysis</span>
            </h1>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            {analysisId && <SaveAnalysisResult id={analysisId} cacheKey={cacheKey} />}

            <Button 
              disabled={reportMutation.isPending}
              onClick={generateAtsReport}
              variant="outline" 
              className="rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex-1 md:flex-none"
            >
              {reportMutation.isPending ? (
                <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> {(initialReportUrl || generatedReportUrl) ? "Download Report" : "Generate Report"}</>
              )}
            </Button>
          </div>
        </header>

        {/* Top Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl border bg-card p-6 md:p-8 shadow-lg"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <ScoreRing score={analysisResult.overall_score || 0} />
              <div className="space-y-3 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-bold">Overall ATS Score</h3>
                  <Badge variant={analysisResult.overall_score > 70 ? 'success' : analysisResult.overall_score > 40 ? 'warning' : 'error'}>
                    Level: {analysisResult.overall_score > 70 ? 'Optimal' : 'Needs Work'}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-md">{analysisResult.summary}</p>
              </div>
            </div>
          </motion.div>

          {/* Scan Vitals */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border bg-card p-6 shadow-lg flex flex-col justify-between"
          >
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Scan Vitals
            </h4>
            <div className="space-y-4">
              {analysisResult.vitals?.map((vital: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase font-semibold">{vital.category}</span>
                    <span className="font-bold">{vital.score}/10</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(vital.score / 10) * 100}%` }}
                      className={cn("h-full transition-all duration-500", vital.score >= 7 ? 'bg-primary' : 'bg-amber-500')} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Content Tabs */}
        <div className="space-y-6">
          <div className="flex p-1 bg-muted/50 rounded-2xl w-fit border border-border/50">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'keywords', label: 'Keywords', icon: Target },
              { id: 'audit', label: 'Audit', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === tab.id ? "bg-background text-primary shadow-md" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'overview' && <OverviewTab data={analysisResult} />}
              {activeTab === 'keywords' && <KeywordsTab data={analysisResult} />}
              {activeTab === 'audit' && <AuditTab data={analysisResult} />}
            </div>

            {/* Sidebar Metrics */}
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sticky top-8 shadow-lg">
                <h4 className="font-semibold mb-6 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" /> Quick Metrics
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-sm text-muted-foreground">Readability</span>
                    <span className="font-bold">{analysisResult.technical_audit?.readability?.flesch_kincaid_score || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Skills Match</span>
                    <span className="font-bold text-primary">
                      {analysisResult.technical_audit?.skills_relevance?.expected_vs_found 
                        ? `${(analysisResult.technical_audit.skills_relevance.expected_vs_found * 100).toFixed(0)}%` 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      <svg className="h-32 w-32 -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="8"
          strokeDasharray={circumference} strokeLinecap="round" className="text-primary" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">{score}</span>
        <span className="text-[10px] uppercase text-muted-foreground font-bold">ATS Score</span>
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <h4 className="font-bold flex items-center gap-2 mb-2"><Zap className="h-4 w-4 text-primary" /> AI Summary</h4>
        <p className="text-muted-foreground leading-relaxed">{data.summary || "No data available."}</p>
      </div>
    </motion.div>
  );
}

function KeywordsTab({ data }: { data: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border rounded-3xl bg-card shadow-sm">
      <h4 className="font-bold mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Key Skills Identified</h4>
      <div className="flex flex-wrap gap-2">
        {data.keyword_cloud?.top_keywords?.length > 0 ? (
          data.keyword_cloud.top_keywords.map((kw: any, i: number) => (
            <span key={i} className="px-3 py-1 bg-muted/60 border rounded-lg text-sm font-medium">
              <b className="text-primary mr-1">x{kw.frequency}</b> {kw.keyword}
            </span>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No keywords found.</p>
        )}
      </div>
    </motion.div>
  );
}

function AuditTab({ data }: { data: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="p-6 border rounded-3xl bg-card shadow-sm">
        <h4 className="font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Compliance Check</h4>
        <div className="space-y-3">
           <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
              <span className="text-sm">Technical Formatting</span>
              <Badge variant={data.technical_audit?.format_compliance?.pdf_text_extractable ? 'success' : 'warning'}>
                {data.technical_audit?.format_compliance?.pdf_text_extractable ? 'Valid' : 'Issues'}
              </Badge>
           </div>
           <p className="text-xs text-muted-foreground italic px-1">
             {data.technical_audit?.format_compliance?.notes || "Structure is optimal for ATS parsers."}
           </p>
        </div>
      </div>
    </motion.div>
  );
}
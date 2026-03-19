"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Layers, Lightbulb,
  ShieldCheck,
  Target,
  Zap
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "./AnalysisNotFound";
import SaveAnalysisResult from "./SaveAnalysisResult";

interface AnalysisPageProps {
  data: any;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function AnalysisDetails({ data, isLoading, error, onRetry }: AnalysisPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
 const router = useRouter()
  const handleBack = ()=>{
  router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Button 
              onClick={handleBack} variant="ghost" size="sm" className="h-8 rounded-full px-2 hover:bg-muted/80 transition-colors">
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
            <SaveAnalysisResult id={data.id} />
            <Button variant="outline" className="rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex-1 md:flex-none">
              <Download className="mr-2 h-4 w-4" /> Generate Report
            </Button>
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl border bg-gradient-to-br from-card via-card/95 to-card p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <ScoreRing score={data.overall_score} />
              <div className="space-y-3 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-bold">Overall ATS Score</h3>
                  <Badge variant={data.overall_score > 80 ? 'success' : data.overall_score > 60 ? 'warning' : 'error'}>
                    Level: {data.overall_score > 80 ? 'High' : data.overall_score > 60 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-md">{data.summary}</p>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border bg-gradient-to-br from-card via-card/95 to-card p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Scan Vitals
              </h4>
              <div className="space-y-4">
                {data.vitals?.map((vital: any) => (
                  <div key={vital.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground uppercase font-semibold">{vital.category}</span>
                      <span className="font-bold">{vital.score}/10</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(vital.score / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          vital.score >= 8 ? 'bg-primary' : 
                          vital.score >= 6 ? 'bg-amber-500' : 'bg-rose-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex p-1 bg-muted/50 rounded-2xl w-fit border border-border/50">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'keywords', label: 'Keyword Cloud', icon: Target },
              { id: 'audit', label: 'Technical Audit', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  activeTab === tab.id 
                    ? "bg-background text-primary shadow-md" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'overview' && <OverviewTab data={data} />}
              {activeTab === 'keywords' && <KeywordsTab data={data} />}
              {activeTab === 'audit' && <AuditTab data={data} />}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-gradient-to-br from-card via-card/95 to-card p-6 sticky top-8 shadow-lg">
                <h4 className="font-semibold mb-6 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Quick Metrics
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-border/50 pb-4">
                    <span className="text-sm text-muted-foreground">Readability</span>
                    <div className="text-right">
                      <div className="text-xl font-bold">{data.technical_audit?.readability?.flesch_kincaid_score || 'N/A'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase">Flesch Score</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-b border-border/50 pb-4">
                    <span className="text-sm text-muted-foreground">Achievement Ratio</span>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {data.technical_audit?.action_verbs_usage?.achievement_ratio 
                          ? `${(data.technical_audit.action_verbs_usage.achievement_ratio * 100).toFixed(0)}%` 
                          : 'N/A'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase">Action Verbs</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-muted-foreground">Skills Match</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {data.technical_audit?.skills_relevance?.expected_vs_found 
                          ? `${(data.technical_audit.skills_relevance.expected_vs_found * 100).toFixed(0)}%` 
                          : 'N/A'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase">Relevance</div>
                    </div>
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

// --- SUB-COMPONENTS ---

function OverviewTab({ data }: { data: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 md:p-8 shadow-lg">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> AI Recommendation
        </h4>
        <p className="text-muted-foreground leading-relaxed">
          {data.technical_audit?.achievements_vs_responsibilities?.recommendation || data.summary}
          {data.technical_audit?.missing_keywords?.length > 0 && (
            <> Focus on adding <span className="text-foreground font-bold italic">
              {data.technical_audit.missing_keywords.slice(0, 3).join(', ')}
            </span> to hit the next tier.</>
          )}
        </p>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" /> 
          Critical Improvements
        </h4>
        {data.critical_improvements?.map((item: any) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-2xl border bg-gradient-to-br from-card to-card/95 hover:border-primary/30 transition-all duration-300 group shadow-md hover:shadow-xl"
          >
            <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
              <Badge variant={item.impact === 'high' ? 'error' : 'warning'}>
                Impact: {item.impact}
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Confidence: {item.confidence}
              </span>
            </div>
            <h5 className="font-bold text-lg mb-2">{item.title}</h5>
            <p className="text-sm text-muted-foreground mb-4">{item.recommendation}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1">Current</div>
                <div className="text-xs font-mono line-through opacity-60">{item.example_before}</div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Suggested</div>
                <div className="text-xs font-mono">{item.example_after}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function KeywordsTab({ data }: { data: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-8 bg-gradient-to-br from-card to-card/95 p-6 md:p-8 rounded-3xl border shadow-lg"
    >
      <section>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Top Keywords (Frequency)
        </h4>
        <div className="flex flex-wrap gap-3">
          {data.keyword_cloud?.top_keywords?.map((kw: any) => (
            <motion.div 
              key={kw.keyword}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border text-sm font-medium flex items-center gap-2 hover:border-primary/30 transition-colors"
            >
              <span className="text-primary font-bold">x{kw.frequency}</span> 
              {kw.keyword}
            </motion.div>
          ))}
        </div>
      </section>
      
      <section>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Job Match Detection
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.keyword_cloud?.job_keyword_matches?.map((kw: any) => (
            <motion.div 
              key={kw.keyword}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300",
                kw.found 
                  ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40" 
                  : "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{kw.keyword}</span>
                {kw.found ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                )}
              </div>
              {kw.evidence && kw.evidence[0] && (
                <p className="text-[10px] text-muted-foreground line-clamp-2">
                  Evidence: "{kw.evidence[0]}"
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function AuditTab({ data }: { data: any }) {
  const audit = data.technical_audit;
  if (!audit) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border bg-gradient-to-br from-card to-card/95 p-6 md:p-8 shadow-lg">
        <h4 className="font-bold mb-6">Format Compliance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-sm">Text Extractable</span>
              {audit.format_compliance?.pdf_text_extractable ? (
                <Badge variant="success">Yes</Badge>
              ) : (
                <Badge variant="error">No</Badge>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-sm">Font Compatibility</span>
              {audit.format_compliance?.font_issues?.length === 0 ? (
                <Badge variant="success">Clean</Badge>
              ) : (
                <Badge variant="warning">Issues</Badge>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-2xl flex flex-col justify-center">
            <div className="text-xs font-bold text-primary uppercase mb-1">Parser Note</div>
            <p className="text-sm text-muted-foreground italic">
              "{audit.format_compliance?.notes || 'No issues detected'}"
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-gradient-to-br from-card to-card/95 p-6 md:p-8 shadow-lg">
        <h4 className="font-bold mb-6">Action Verbs Evidence</h4>
        <div className="flex flex-wrap gap-2">
          {audit.action_verbs_usage?.examples?.map((verb: string) => (
            <span 
              key={verb} 
              className="px-3 py-1 bg-gradient-to-br from-muted to-muted/80 rounded-lg text-sm font-mono border border-border"
            >
              {verb}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  return (
    <div className="relative h-28 w-28 md:h-32 md:w-32 flex items-center justify-center">
      <svg className="h-28 w-28 md:h-32 md:w-32 -rotate-90">
        <circle 
          cx="64" 
          cy="64" 
          r="40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="8" 
          className="text-muted/30" 
        />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="64" 
          cy="64" 
          r="40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeDasharray={circumference} 
          strokeLinecap="round" 
          className="text-primary" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl md:text-3xl font-black">{Math.min(score, 100)}</span>
        <span className="text-[8px] md:text-[10px] uppercase text-muted-foreground font-bold">ATS Score</span>
      </div>
    </div>
  );
}
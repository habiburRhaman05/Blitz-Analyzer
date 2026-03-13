"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Loader2, ArrowLeft, Download, AlertTriangle,
  Sparkles, BarChart3, MessageSquare, TrendingUp, X, 
  Search, ShieldCheck, Zap, Target, ArrowUpRight
} from "lucide-react";

// Assuming these are local UI components or you're using standard Tailwind
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AnalysisPageProps {
  id: string;
}

export default function AnalysisDetails({ id }: AnalysisPageProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // 1. Dummy API Call Simulation
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const mockResult = {
        id: id,
        status: "success",
        analysis_type: "ATS_SCAN",
        overall_score: 84,
        summary: "Your resume is highly parseable, but lacks specific technical density required for high-volume automated filters.",
        vitals: [
          { label: "Formatting", score: 92, status: "success", insight: "Clean layout; standard fonts detected." },
          { label: "Readability", score: 88, status: "success", insight: "Balanced white space and bullet density." },
          { label: "Skill Density", score: 65, status: "warning", insight: "Missing critical cloud-native infrastructure terms." }
        ],
        technical_audit: {
          header_check: "PASS",
          section_structure: "PASS",
          font_compatibility: "PASS",
          tables_detected: "NONE"
        },
        keyword_cloud: {
          detected: ["React", "TypeScript", "Node.js", "Tailwind", "Next.js"],
          missing_high_priority: ["CI/CD Pipelines", "Unit Testing", "Microservices", "Docker"]
        },
        critical_improvements: [
          { area: "Keyword Gap", issue: "Missing 'Scalability' keywords.", fix: "Integrate these into your experience bullet points." },
          { area: "Action Verbs", issue: "Passive language detected.", fix: "Replace 'Worked on' with 'Architected'." }
        ]
      };
      
      setData(mockResult);
      setLoading(false);
    };

    fetchAnalysis();
  }, [id]);

  // 2. Loading Skeleton Component
  if (loading) return <AnalysisSkeleton />;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span>Back to Dashboard</span>
              <span className="text-border">/</span>
              <span className="text-primary font-medium">Analysis #{id.slice(0, 6)}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Analysis <span className="text-primary">Report</span></h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-border/60">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Sparkles className="mr-2 h-4 w-4" /> AI Auto-Fix
            </Button>
          </div>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <ScoreRing score={data.overall_score} />
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-bold">Overall Score</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">{data.summary}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <Badge variant="success">ATS Compatible</Badge>
                  <Badge variant="info">Standard Format</Badge>
                </div>
              </div>
            </div>
            {/* Background Decorative Element */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Technical Vitals */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl border bg-card p-6 shadow-sm"
          >
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Technical Vitals
            </h4>
            <div className="space-y-4">
              {data.vitals.map((vital: any) => (
                <div key={vital.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{vital.label}</span>
                    <span className="font-medium">{vital.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${vital.score}%` }}
                      className={`h-full rounded-full ${vital.status === 'success' ? 'bg-primary' : 'bg-amber-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex p-1 bg-muted/50 rounded-2xl w-fit border border-border/50">
            {['Overview', 'Keywords', 'Improvements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.toLowerCase() 
                  ? "bg-card text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'overview' && <OverviewTab data={data} />}
              {activeTab === 'keywords' && <KeywordsTab data={data} />}
              {activeTab === 'improvements' && <ImprovementsTab data={data} />}
            </div>

            {/* Side Audit Panel */}
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6">
                <h4 className="font-semibold mb-6">Structural Audit</h4>
                <div className="space-y-4">
                  {Object.entries(data.technical_audit).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <span className="text-sm text-muted-foreground capitalize">{key.replace('_', ' ')}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${value === 'PASS' || value === 'NONE' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-3xl border border-primary/10 bg-primary/[0.02] p-8">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Strategic Recommendation
        </h4>
        <p className="text-muted-foreground leading-relaxed">
          Your resume ranks in the top <span className="text-foreground font-bold italic">15% of applicants</span> for this role. 
          To hit the 95th percentile, focus on the <strong>Skill Density</strong> gap by adding mention of your 
          CI/CD experience in your current role description.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.critical_improvements.map((item: any, i: number) => (
          <div key={i} className="p-6 rounded-2xl border bg-card hover:border-primary/30 transition-colors">
            <Badge variant="warning" className="mb-3">{item.area}</Badge>
            <h5 className="font-bold mb-2">{item.issue}</h5>
            <p className="text-sm text-muted-foreground">{item.fix}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function KeywordsTab({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <section>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">High Match Skills</h4>
        <div className="flex flex-wrap gap-2">
          {data.keyword_cloud.detected.map((kw: string) => (
            <div key={kw} className="px-4 py-2 rounded-xl bg-green-500/5 border border-green-500/20 text-green-700 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" /> {kw}
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Missing Priority Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {data.keyword_cloud.missing_high_priority.map((kw: string) => (
            <div key={kw} className="px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/20 text-red-700 text-sm font-medium flex items-center gap-2">
              <ArrowUpRight className="h-3.5 w-3.5" /> {kw}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ImprovementsTab({ data }: { data: any }) {
  return (
    <div className="rounded-3xl border bg-card p-12 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold">Ready to automate your success?</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Our AI can instantly rewrite your bullet points and inject the missing keywords for you.
      </p>
      <Button size="lg" className="rounded-2xl px-8">Enhance My Resume Now</Button>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      <svg className="h-32 w-32 -rotate-90">
        <circle cx="64" cy="64" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="64" cy="64" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
          strokeDasharray={circumference} strokeLinecap="round" className="text-primary" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">{score}</span>
        <span className="text-[10px] uppercase text-muted-foreground font-bold">Score</span>
      </div>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-48 bg-muted rounded-[2rem]" />
          <div className="h-48 bg-muted rounded-[2rem]" />
        </div>
        <div className="h-12 w-96 bg-muted rounded-2xl" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 bg-muted rounded-[2rem]" />
          <div className="h-96 bg-muted rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant = "info", className = "" }: any) {
  const variants = {
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
}
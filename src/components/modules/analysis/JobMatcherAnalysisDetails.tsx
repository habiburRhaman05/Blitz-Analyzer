"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Target,
  ChevronRight,
  Info,
  Sparkles,
  Download,
  Share2
} from "lucide-react";

// Standard UI components - Replace with your own or shadcn/ui
import { Button } from "@/components/ui/button";

interface JobMatcherProps {
  id: string;
}

export default function JobMatcherDetails({ id }: JobMatcherProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const mockResult = {
        id: id,
        status: "success",
        analysis_type: "JOB_MATCHER",
        match_percentage: 76,
        match_verdict: "Strong Contender",
        verdict_description: "Your profile aligns with 80% of core requirements but lacks specific cloud experience required for this squad.",
        requirement_mapping: [
          {
            requirement: "5+ years Frontend Experience",
            status: "MATCHED",
            evidence: "4.5 years documented across 3 major SaaS roles including specialized work in Next.js."
          },
          {
            requirement: "Advanced Next.js / SSR",
            status: "PARTIAL",
            evidence: "Mentioned in current role, but missing specific metrics like LCP or CLS optimization."
          },
          {
            requirement: "AWS/Cloud Infrastructure",
            status: "MISSING",
            evidence: "No mention of AWS, GCP, or Azure in the provided text."
          }
        ],
        top_skill_gaps: [
          "AWS Amplify / Serverless deployment",
          "End-to-end testing with Cypress or Playwright",
          "State management optimization (Zustand/Redux)"
        ],
        strategic_advice: {
          resume_tweak: "Move your 'Projects' section above 'Education' to highlight the Next.js work which is central to this JD.",
          interview_focus: "Be prepared to explain how you would handle high-traffic SSR in Next.js, as the JD emphasizes scalability.",
          custom_pitch: "Highlight your AI integration skills—even though it's not a hard requirement, it differentiates you for this specific team."
        }
      };
      
      setData(mockResult);
      setLoading(false);
    };

    fetchMatchData();
  }, [id]);

  if (loading) return <JobMatcherSkeleton />;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-zinc-900 shadow-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Match Report</p>
              <h1 className="text-2xl font-bold tracking-tight">Alignment Analysis</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl bg-white dark:bg-zinc-900">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button className="rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Download className="mr-2 h-4 w-4" /> Save PDF
            </Button>
          </div>
        </header>

        {/* Hero Section: Verdict & Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
              <MatchGauge percentage={data.match_percentage} />
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-tighter">
                  <Sparkles className="h-3 w-3" /> AI Analysis Complete
                </div>
                <h2 className="text-4xl font-black">{data.match_verdict}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg max-w-xl">
                  {data.verdict_description}
                </p>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-primary text-primary-foreground rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl shadow-primary/10"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold leading-tight">Improve your match by 15%</h3>
              <p className="text-white/80 text-sm">Addressing the missing AWS certifications could push you into the "Exceptional Match" tier.</p>
            </div>
            <Button className="mt-6 bg-white text-primary hover:bg-white/90 rounded-2xl font-bold py-6">
              Optimize Now
            </Button>
          </motion.div>
        </div>

        {/* Strategic Advice Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdviceCard 
            icon={<Target className="text-blue-500" />} 
            title="Resume Tweak" 
            content={data.strategic_advice.resume_tweak} 
            delay={0.2}
          />
          <AdviceCard 
            icon={<MessageSquareIcon className="text-purple-500" />} 
            title="Interview Focus" 
            content={data.strategic_advice.interview_focus} 
            delay={0.3}
          />
          <AdviceCard 
            icon={<Lightbulb className="text-amber-500" />} 
            title="Custom Pitch" 
            content={data.strategic_advice.custom_pitch} 
            delay={0.4}
          />
        </div>

        {/* Requirement Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Requirement Mapping
            </h3>
            <div className="space-y-4">
              {data.requirement_mapping.map((item: any, i: number) => (
                <MappingRow key={i} item={item} index={i} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" /> Priority Skill Gaps
              </h3>
              <div className="space-y-3">
                {data.top_skill_gaps.map((skill: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UI COMPONENTS ---

function MatchGauge({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-40 w-40 flex items-center justify-center">
      <svg className="h-40 w-40 -rotate-90">
        <circle cx="80" cy="80" r="60" fill="none" stroke="currentColor" strokeWidth="12" className="text-zinc-100 dark:text-zinc-800" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "circOut" }}
          cx="80" cy="80" r="60" fill="none" stroke="currentColor" strokeWidth="12" 
          strokeDasharray={circumference} strokeLinecap="round" className="text-primary" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black">{percentage}%</span>
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter">Match Rate</span>
      </div>
    </div>
  );
}

function MappingRow({ item, index }: { item: any, index: number }) {
  const statusColors: any = {
    MATCHED: "bg-green-500/10 text-green-600 border-green-500/20",
    PARTIAL: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    MISSING: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h4 className="font-bold text-lg">{item.requirement}</h4>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[item.status]}`}>
          {item.status}
        </span>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
          <Info className="inline h-3.5 w-3.5 mr-2 -mt-0.5 opacity-50" />
          "{item.evidence}"
        </p>
      </div>
    </motion.div>
  );
}

function AdviceCard({ icon, title, content, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm"
    >
      <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4 border border-zinc-100 dark:border-zinc-700">
        {icon}
      </div>
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed">{content}</p>
    </motion.div>
  );
}

function JobMatcherSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8 animate-pulse">
      <div className="h-12 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 h-64 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem]" />
        <div className="col-span-4 h-64 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem]" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem]" />
        <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem]" />
        <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem]" />
      </div>
    </div>
  );
}

// Simple Helper Icon
function MessageSquareIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
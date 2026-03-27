"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, FileText, Search, ShieldCheck, 
  Zap, BarChart3, Binary, Terminal 
} from "lucide-react";
import { useEffect, useState } from "react";

const STAGES = [
  { id: 1, label: "Neural Setup", desc: "Initializing Blitz AI Core...", icon: Cpu },
  { id: 2, label: "Deep Scan", desc: "Parsing document semantics...", icon: FileText },
  { id: 3, label: "ATS Matching", desc: "Comparing with 50+ ATS algorithms...", icon: Search },
  { id: 4, label: "Optimization", desc: "Generating improvement vectors...", icon: Zap },
  { id: 5, label: "Finalizing", desc: "Securing analysis report...", icon: ShieldCheck },
];

const PremiumAnalysisLoader = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Booting analysis engine..."]);

  // Progression Logic
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1100);

    const logInterval = setInterval(() => {
      const newLogs = [
        `> TRACING_DATA_POINT_${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
        `> OPTIMIZING_KEYWORDS_v2.4`,
        `> SEMANTIC_MATCH_FOUND: 0.${Math.floor(Math.random() * 99)}`,
      ];
      setLogs((prev) => [newLogs[Math.floor(Math.random() * newLogs.length)], ...prev].slice(0, 3));
    }, 800);

    return () => {
      clearInterval(stageInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-6 py-16 mx-auto">
      
      {/* 1. Ambient Background Atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      {/* 2. The Main Visual: Laser Scanner */}
      <div className="relative mb-16">
        {/* Document Icon with Scanning Line */}
        <div className="relative p-10 bg-background/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FileText className="w-20 h-20 text-primary/40" />
          </motion.div>

          {/* The Laser Beam */}
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-20 shadow-[0_0_15px_rgba(var(--primary),0.8)]"
          />
          
          {/* Internal Pulse Shape */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        </div>

        {/* Orbiting Tech Bits */}
        {[0, 120, 240].map((rotation, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 180 + i * 40, height: 180 + i * 40 }}
          >
            <div className="w-2 h-2 rounded-full bg-primary/20 absolute top-0 left-1/2" />
          </motion.div>
        ))}
      </div>

      {/* 3. Logical Progress & Data Terminal */}
      <div className="w-full grid md:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Steps */}
        <div className="space-y-4">
          {STAGES.map((stage, index) => {
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;
            
            return (
              <motion.div
                key={stage.id}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.3,
                  x: isActive ? 10 : 0 
                }}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isActive ? "bg-primary/5 border border-primary/20" : ""
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"}`}>
                  <stage.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-tight leading-none mb-1">
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    {isActive ? stage.desc : isCompleted ? "Verification Complete" : "Waiting..."}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Trust-Building "Live" Terminal */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-white/10 font-mono text-[10px] h-[160px] flex flex-col justify-end overflow-hidden shadow-inner">
          <div className="flex items-center gap-2 mb-auto pb-2 border-b border-white/5 text-zinc-500 italic">
            <Terminal size={12} />
            <span>BLITZ_ANALYZER_CORE_v2.4</span>
          </div>
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.p
                key={log + i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-500/80 mb-1"
              >
                {log}
              </motion.p>
            ))}
          </AnimatePresence>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500">ENGINE_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 4. Footer Progress */}
      <div className="w-full mt-12 text-center">
        <div className="relative w-full h-1 bg-muted rounded-full overflow-hidden mb-4">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5.5, ease: "linear" }}
            className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]"
          />
        </div>
        <div className="flex justify-between items-center px-1">
           <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase italic">
            Secure Analysis in Progress
           </span>
           <span className="text-[10px] font-bold text-primary tabular-nums">
             {Math.min(Math.round((currentStage + 1) * 20), 100)}%
           </span>
        </div>
      </div>
    </div>
  );
};

export default PremiumAnalysisLoader;
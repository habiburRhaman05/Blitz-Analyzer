"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Compass, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#030303] overflow-hidden px-4">
    
      <div className="absolute top-1/4 left-1/4 -z-10 w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 w-[350px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        <div className="relative select-none">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[120px] md:text-[180px] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-400 dark:from-zinc-800 dark:to-zinc-950"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center mt-8 md:mt-12">
            <motion.p 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-lg md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white bg-white/50 dark:bg-zinc-900/50 px-4 py-1.5 rounded-full border border-slate-200/50 dark:border-zinc-800/50 backdrop-blur-md"
            >
              Page Not Found
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2 max-w-md mx-auto"
        >
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg">
            The link you followed might be broken, or the page may have been moved to a new destination.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left"
        >
          <Link href="/" className="group p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-900/80 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">Go Dashboard / Home</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Head back to the main platform.</p>
              </div>
            </div>
          </Link>

          <Link href="/explore" className="group p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-900/80 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">Explore Positions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Browse active career opportunities.</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost" 
            className="w-full sm:w-auto h-11 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 gap-2 hover:bg-slate-50 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>

          <Button 
            asChild
            className="w-full sm:w-auto h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
          >
            <Link href="/contact">
              <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
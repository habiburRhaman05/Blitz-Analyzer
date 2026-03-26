'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import DashboardView from './DashboardView'
import { BackgroundWrapper } from '@/components/global/BackgroudWrapper'

export function HeroSection() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (

      <section className="relative w-full overflow-hidden bg-background pt-16 md:pt-28 pb-20">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
        <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      {/* 1. Subtle Animated Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/10 dark:bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center space-y-10"
        >
          {/* 2. Top Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-sm font-medium backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Resume Analyzer</span>
          </motion.div>

          {/* 3. Main Headline with Gradient Text */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-5xl"
          >
            Win Your Dream Job With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-cyan-300">Blitz Analyzer</span>
          </motion.h1>

          {/* 4. Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-medium"
          >
            Stop guessing. Use field-tested templates and AI-driven ATS optimization to land interviews at top-tier tech companies. 
          </motion.p>

          {/* 5. Modern CTA Group */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          >
            <Button 
              size="lg"
              className="relative group bg-blue-600 hover:bg-blue-700 text-white px-10 h-14 rounded-full font-bold transition-all duration-300 overflow-hidden shadow-xl shadow-blue-500/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Creating Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Subtle Shimmer Effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              className="h-14 px-8 rounded-full font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-blue-700"
            >
              Live Demo
            </Button>
          </motion.div>

          {/* 6. Dashboard Preview with Floating Animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-12 perspective-1000"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="hover:scale-[1.01] transition-transform duration-700"
            >
              <DashboardView />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>

  )
}
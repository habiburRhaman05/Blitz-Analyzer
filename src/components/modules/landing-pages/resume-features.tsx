'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Zap 
} from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    id: 1,
    icon: <Edit3 className="w-5 h-5" />,
    title: 'Precision Online Editor',
    description: 'A seamless, real-time editing experience designed specifically for high-conversion resumes.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 2,
    icon: <Sparkles className="w-5 h-5" />,
    title: 'AI-Powered Phrases',
    description: 'Instant suggestions from our AI to help you describe your impact, not just your tasks.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 3,
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Smart Spell-Checker',
    description: 'Zero errors. Our engine catches industry-specific terminology and formatting slips.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 4,
    icon: <Download className="w-5 h-5" />,
    title: 'Multi-Format Export',
    description: 'Download in ATS-optimized PDF, Word, or Google Doc formats with a single click.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  }
]

export function ResumeFeaturesSection() {
  return (
    <section className="relative w-full bg-transparent  py-20 md:py-32 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content: Features */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Craft a <span className="text-blue-600">Perfect Resume</span> <br /> Without the Stress.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Blitz Analyzer doesn't just build resumes—it optimizes them for the modern hiring landscape using data-driven insights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group p-5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 italic lg:not-italic">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 group">
              Start Building <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Right Content: Modern Product Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* The Main "Canvas" */}
            <div className="relative z-10 p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
                  alt="Resume Editor Interface"
                  className="w-full h-auto opacity-90 dark:opacity-70"
                />
              </div>

              {/* Floating UI Element 1: ATS Score */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 flex items-center gap-4 z-20"
              >
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent flex items-center justify-center font-bold text-blue-600">
                  92%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Score</p>
                  <p className="text-sm font-bold dark:text-white">Excellent Match</p>
                </div>
              </motion.div>

              {/* Floating UI Element 2: AI Suggestion */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 p-4 bg-blue-600 rounded-2xl shadow-2xl text-white max-w-[200px] z-20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 fill-white" />
                  <span className="text-[10px] font-black uppercase">AI Advice</span>
                </div>
                <p className="text-xs font-medium leading-snug">
                  "Try using more action verbs like 'Architected' or 'Spearheaded'."
                </p>
              </motion.div>
            </div>

            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-blue-500/10 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-blue-500/5 rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
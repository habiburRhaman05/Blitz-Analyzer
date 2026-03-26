'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Layout, 
  PenTool, 
  CreditCard, 
  FileSearch, 
  Target, 
  Gift,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const coreFeatures = [
  {
    title: "AI Resume Analyzer",
    desc: "Our neural engine scans your resume against 50+ industry benchmarks in seconds.",
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    delay: 0.1
  },
  {
    title: "Pro Templates",
    desc: "Choose from a library of recruiter-tested, ATS-friendly templates that land interviews.",
    icon: <Layout className="w-6 h-6 text-purple-500" />,
    delay: 0.2
  },
  {
    title: "Custom Builder",
    desc: "Drag-and-drop interface to tailor every section of your professional story.",
    icon: <PenTool className="w-6 h-6 text-emerald-500" />,
    delay: 0.3
  }
]

const ProductHighlight = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Built for the <span className="text-blue-600">Modern Candidate.</span>
          </motion.h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            More than just a builder. A complete career toolkit designed to bypass the gatekeepers and get you hired.
          </p>
        </div>

        {/* Core Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {coreFeatures.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: f.delay, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-300 shadow-xl shadow-transparent hover:shadow-blue-500/5"
            >
              <div className="mb-6 p-3 w-fit rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Secondary Benefits Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Advanced Analytics Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex gap-4 mb-6">
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest text-blue-400">Advanced Analytics</div>
                </div>
                <h4 className="text-2xl font-bold mb-4 italic lg:not-italic">ATS Report & Job Matcher</h4>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Real-time keyword density analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> Match score for specific job descriptions
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-[10px] font-bold italic">
                      {i === 1 ? 'PDF' : i === 2 ? 'DOC' : 'ATS'}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-slate-400">Supported by 500+ global ATS systems</span>
              </div>
            </div>
            {/* Decoration */}
            <Target className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 group-hover:text-blue-500/10 transition-colors duration-700" />
          </motion.div>

          {/* Payments & Conversion Card */}
          <div className="flex flex-col gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex items-center gap-6 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:rotate-12 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Seamless Stripe Payments</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Secure, encrypted checkout for premium features.</p>
              </div>
            </motion.div>

            {/* Separate UI: The Free Credits Claim */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-blue-600 dark:bg-blue-600 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="relative z-10 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-100 font-bold mb-2">
                  <Gift className="w-5 h-5" />
                  <span>Welcome Offer</span>
                </div>
                <h4 className="text-2xl font-black text-white leading-tight">Claim Your 10 Free AI Credits</h4>
                <p className="text-blue-100/80 text-sm mt-1">Get started instantly with full AI analysis on us.</p>
              </div>
              <Button 
                className="relative z-10 bg-white hover:bg-slate-100 text-blue-600 font-bold px-8 h-12 rounded-full shadow-lg transition-transform active:scale-95"
              >
                Sign Up & Claim <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              {/* Animated glow bg */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProductHighlight
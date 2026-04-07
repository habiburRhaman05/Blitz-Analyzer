'use client'

import { motion } from 'framer-motion'
import { Upload, Sparkles, BarChart3, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  {
    number: '01',
    title: 'Upload Your Resume',
    description:
      'Drag and drop your resume in PDF or DOCX format. Our system accepts all standard document types.',
    icon: Upload,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'bg-blue-500/5',
  },
  {
    number: '02',
    title: 'AI Analyzes Content',
    description:
      'Our neural engine scans your resume against 50+ industry benchmarks and ATS patterns in seconds.',
    icon: Sparkles,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    glow: 'bg-purple-500/5',
  },
  {
    number: '03',
    title: 'Get ATS Score & Report',
    description:
      'Receive a detailed compatibility score with actionable insights on formatting, keywords, and structure.',
    icon: BarChart3,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500/5',
  },
  {
    number: '04',
    title: 'Improve & Download',
    description:
      'Apply AI-powered suggestions and download your optimized, interview-ready resume instantly.',
    icon: Download,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'bg-orange-500/5',
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative w-full bg-background py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simple Process
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            How It <span className="text-blue-600">Works</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl"
          >
            Go from upload to interview-ready in four simple steps. No guesswork, just results.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Connecting Line (visible on lg screens) */}
          <div className="hidden lg:block absolute top-[72px] left-[12%] right-[12%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-emerald-500/20 to-orange-500/20 origin-left"
            />
            {/* Dotted overlay */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,var(--tw-shadow-color,white)_8px,var(--tw-shadow-color,white)_16px)] dark:bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgb(15,23,42)_8px,rgb(15,23,42)_16px)]" />
          </div>

          {/* Connecting Line (visible on md screens, vertical between row pairs) */}
          <div className="hidden md:block lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-slate-200 dark:bg-white/10" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative group"
            >
              <div
                className={cn(
                  'relative h-full p-8 rounded-3xl border border-slate-100 dark:border-white/5',
                  'bg-slate-50/50 dark:bg-white/[0.02]',
                  'hover:bg-white dark:hover:bg-white/[0.04]',
                  'hover:shadow-xl hover:shadow-blue-500/5',
                  'transition-all duration-300'
                )}
              >
                {/* Background glow on hover */}
                <div
                  className={cn(
                    'absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[60px]',
                    step.glow
                  )}
                />

                {/* Step Number */}
                <div className="relative z-10 mb-6 flex items-center gap-4">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center',
                      'shadow-sm border group-hover:scale-110 transition-transform duration-300',
                      step.bg,
                      step.border
                    )}
                  >
                    <step.icon className={cn('w-6 h-6', step.color)} />
                  </div>
                  <span className="text-5xl font-black text-slate-100 dark:text-white/5 select-none group-hover:text-slate-200 dark:group-hover:text-white/10 transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector on lg (appears after each card except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-[72px] z-20 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 items-center justify-center shadow-sm">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className="text-slate-400 dark:text-slate-500"
                    >
                      <path
                        d="M1 5h7M6 2l3 3-3 3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

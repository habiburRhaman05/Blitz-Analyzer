'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { FileText, Target, Globe, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatItem {
  label: string
  value: number
  suffix: string
  prefix?: string
  icon: React.ElementType
  color: string
  bg: string
  description: string
}

const stats: StatItem[] = [
  {
    label: 'Resumes Analyzed',
    value: 50000,
    suffix: '+',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    description: 'Professionals trust Blitz Analyzer',
  },
  {
    label: 'ATS Pass Rate',
    value: 95,
    suffix: '%',
    icon: Target,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    description: 'Industry-leading success rate',
  },
  {
    label: 'Countries Served',
    value: 120,
    suffix: '+',
    icon: Globe,
    color: 'text-purple-500',
    bg: 'bg-purple-500',
    description: 'Global reach and impact',
  },
  {
    label: 'User Rating',
    value: 4.9,
    suffix: '/5',
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    description: 'Based on thousands of reviews',
  },
]

function AnimatedCounter({
  value,
  suffix,
  prefix,
  isDecimal = false,
}: {
  value: number
  suffix: string
  prefix?: string
  isDecimal?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    isDecimal ? latest.toFixed(1) : Math.round(latest).toLocaleString()
  )
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
      })
    }
  }, [isInView, motionValue, value])

  const [display, setDisplay] = useState(isDecimal ? '0.0' : '0')

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v))
    return unsubscribe
  }, [rounded])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function StatsCounterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-20 md:py-28"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 dark:from-black dark:via-slate-950 dark:to-indigo-950" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="stats-grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" />
        </svg>
      </div>

      {/* Animated Glow Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-purple-500/5 blur-[100px] rounded-full" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3">
            Trusted Worldwide
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Numbers That Speak for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Themselves
            </span>
          </h3>
          <p className="mt-4 text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have already transformed their
            career trajectory with Blitz Analyzer.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <div
                className={cn(
                  'relative group rounded-2xl md:rounded-3xl p-6 md:p-8',
                  'bg-white/[0.03] backdrop-blur-sm',
                  'border border-white/[0.06]',
                  'hover:bg-white/[0.06] hover:border-white/[0.12]',
                  'transition-all duration-500'
                )}
              >
                {/* Hover Glow */}
                <div
                  className={cn(
                    'absolute -inset-px rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10',
                    stat.bg,
                    'bg-opacity-10'
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    'w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-5',
                    'bg-white/[0.05] group-hover:bg-white/[0.08] transition-all duration-500',
                    'group-hover:scale-110 group-hover:rotate-3'
                  )}
                >
                  <stat.icon
                    className={cn('w-6 h-6 md:w-7 md:h-7', stat.color)}
                  />
                </div>

                {/* Value */}
                <div className="mb-2">
                  <p
                    className={cn(
                      'text-3xl md:text-4xl font-black tracking-tight text-white'
                    )}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      isDecimal={stat.label === 'User Rating'}
                    />
                  </p>
                </div>

                {/* Label */}
                <p className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-1">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  {stat.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className={cn(
                    'absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500',
                    stat.bg
                  )}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

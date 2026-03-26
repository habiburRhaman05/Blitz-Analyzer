'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, Mail, Briefcase, Star, Globe, TrendingUp } from 'lucide-react'

export function CareersSection() {
  return (
    <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden">
      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-900/30"
              >
                <TrendingUp className="w-3 h-3" />
                Careers at Blitz
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1]">
                Grow with a <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Global Team.</span>
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                We are on a mission to redefine career development. Join our remote-first team and help us build tools that empower millions of job seekers.
              </p>
            </div>

            {/* Premium Newsletter/Alert Form */}
            <div className="space-y-4 max-w-md">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Get notified about new positions
              </p>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="h-14 pl-5 pr-32 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                />
                <Button className="absolute right-1.5 top-1.5 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                  Join Waitlist
                </Button>
              </div>
            </div>

            {/* Quick Benefits Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Remote Work</p>
              </div>
              <div className="border-l border-slate-200 dark:border-white/10 pl-8">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">4.9/5</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Team Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Thematic Image */}
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] border-8 border-white dark:border-white/5 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Our Creative Space"
                className="w-full h-full object-cover brightness-95 dark:brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
            </div>

            {/* Floating Job Board UI (Glassmorphism) */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-6 md:-right-12 w-full max-w-[340px] p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Live Positions</span>
                </div>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>

              <div className="space-y-5">
                {[
                  { title: "Senior UI Designer", brand: "Remote", color: "bg-blue-500" },
                  { title: "Growth Manager", brand: "Berlin / Hybrid", color: "bg-purple-500" },
                  { title: "Node.js Engineer", brand: "Remote", color: "bg-orange-500" }
                ].map((job, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${job.color} flex items-center justify-center text-white shadow-lg shadow-current/10`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">{job.brand}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                Browse All 24 Openings
              </Button>
            </motion.div>

            {/* Small Floating "Global" Tag */}
            <div className="absolute top-12 -left-8 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-[10px] font-black uppercase leading-none text-slate-500">
                Hiring in <br /><span className="text-slate-900 dark:text-white text-xs">12+ Countries</span>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
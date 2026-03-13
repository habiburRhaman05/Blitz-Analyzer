'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SignInForm } from "@/components/modules/auth/SigninForm"
import { ShieldCheck, Zap, Globe, Lock } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

export default function SignInPage() {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'Data Privacy',
      description: 'All resume and ATS data is encrypted and secured for enterprise-grade safety.',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Analyze resumes, generate AI suggestions, and get insights in real-time.',
    },
    {
      icon: Globe,
      title: 'Cross-Platform Access',
      description: 'Access your profiles, resumes, and reports from any device, anywhere.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden transition-colors duration-300">

        
              <SignInForm />
         
      
  
    </div>
  )
}
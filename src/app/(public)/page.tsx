'use client'

import { HeroSection } from '@/components/modules/landing-pages/hero'
import { TestimonialsSection } from '@/components/modules/landing-pages/testimonials'
import { ResumeFeaturesSection } from '@/components/modules/landing-pages/resume-features'
import { TeamSection } from '@/components/modules/landing-pages/team'
import { CareersSection } from '@/components/modules/landing-pages/careers'
import { ContactSection } from '@/components/modules/landing-pages/contact'
import { FAQSection } from '@/components/modules/landing-pages/faq'
import { Footer } from '@/components/modules/landing-pages/footer'
import { Header } from '@/components/modules/landing-pages/Header'

export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-background text-gray-900 dark:text-white">
    
      <HeroSection />
      <TestimonialsSection />
 
    </main>
  )
}

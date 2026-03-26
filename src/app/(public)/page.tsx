'use client'

import { HeroSection } from '@/components/modules/landing-pages/hero'
import { TestimonialsSection } from '@/components/modules/landing-pages/testimonials'
import { ResumeFeaturesSection } from '@/components/modules/landing-pages/resume-features'
import { CareersSection } from '@/components/modules/landing-pages/careers'
import ProductHighlight from '@/components/modules/landing-pages/ProductHighlight'


export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-background text-gray-900 dark:text-white">
     
      <HeroSection />
      <TestimonialsSection />
      <ProductHighlight/>
      <ResumeFeaturesSection />

      <CareersSection />
    </main>
  )
}

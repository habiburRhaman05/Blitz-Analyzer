'use client'

import PublicHeader from '@/components/global/PublicHeader'
import { CareersSection } from '@/components/modules/landing-pages/careers'
import { FAQSection } from '@/components/modules/landing-pages/faq'
import { Footer } from '@/components/modules/landing-pages/footer'
import { HeroSection } from '@/components/modules/landing-pages/hero'
import ProductHighlight from '@/components/modules/landing-pages/ProductHighlight'
import { ResumeFeaturesSection } from '@/components/modules/landing-pages/resume-features'
import ScrollToTop from '@/components/modules/landing-pages/ScrollToTop'
import { TestimonialsSection } from '@/components/modules/landing-pages/testimonials'


export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-background text-gray-900 dark:text-white">
      <HeroSection />
      <TestimonialsSection />
      <ProductHighlight/>
      <ResumeFeaturesSection />
      <CareersSection />
      <FAQSection/>
      <ScrollToTop/>
    </main>
  )
}

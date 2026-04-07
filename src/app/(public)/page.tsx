'use client'

import { CareersSection } from '@/components/modules/landing-pages/careers'
import { FAQSection } from '@/components/modules/landing-pages/faq'
import { HeroSection } from '@/components/modules/landing-pages/hero'
import { HowItWorksSection } from '@/components/modules/landing-pages/HowItWorks'
import KPISReports from '@/components/modules/landing-pages/KpiReport'
import ProductHighlight from '@/components/modules/landing-pages/ProductHighlight'
import { ResumeFeaturesSection } from '@/components/modules/landing-pages/resume-features'
import { StatsCounterSection } from '@/components/modules/landing-pages/StatsCounter'
import { BlogPreviewSection } from '@/components/modules/landing-pages/BlogPreview'
import ScrollToTop from '@/components/modules/landing-pages/ScrollToTop'
import { TestimonialsSection } from '@/components/modules/landing-pages/testimonials'
import { TeamSection } from '@/components/modules/landing-pages/team'


export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-background text-gray-900 dark:text-white">
      <HeroSection />
      <KPISReports />
      <HowItWorksSection />
      <ResumeFeaturesSection />
      <ProductHighlight />
      <StatsCounterSection />
      <TestimonialsSection />
      <TeamSection />
      <BlogPreviewSection />
      <CareersSection />
      <FAQSection />
      <ScrollToTop />
    </main>
  )
}

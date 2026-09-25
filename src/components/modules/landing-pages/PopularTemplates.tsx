'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Crown, Flame, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPopularTemplatesPublic } from '@/services/admin.services'

interface PopularTemplate {
  id: string;
  name: string;
  previewUrl: string;
  isPremium: boolean;
  price: number;
  sections: unknown[];
  usageCount: number;
}

const CardSkeleton = () => (
  <div className="rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-muted" />
    <div className="p-5 space-y-2">
      <div className="h-4 w-2/3 bg-muted rounded" />
      <div className="h-3 w-full bg-muted rounded" />
    </div>
  </div>
)

export function PopularTemplatesSection() {
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['popular-templates'],
    queryFn: () => getPopularTemplatesPublic(6),
  })

  const templates: PopularTemplate[] = data?.data || []

  if (!isLoading && templates.length === 0) return null

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Most Popular</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Templates Job Seekers{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">
              Actually Use
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            Ranked by real resumes built, not guesswork. These are the layouts
            the community reaches for most.
          </motion.p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -6 }}
                  onClick={() => router.push(`/templates/${template.id}`)}
                  className="group relative cursor-pointer rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden transition-all duration-300 shadow-xl shadow-transparent hover:shadow-orange-500/5 hover:border-slate-200 dark:hover:border-white/10"
                >
                  {/* Rank badge */}
                  <div className="absolute top-4 left-4 z-10 h-8 w-8 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 flex items-center justify-center text-xs font-black shadow-lg">
                    #{index + 1}
                  </div>

                  {template.isPremium && (
                    <Badge className="absolute top-4 right-4 z-10 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-xl">
                      <Crown className="h-3 w-3 mr-1.5" /> Premium
                    </Badge>
                  )}

                  <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                      <Button className="w-full rounded-full font-bold">
                        Use Template
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {template.name}
                    </h3>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-widest">
                        <FileText className="w-3 h-3" />
                        {Array.isArray(template.sections) ? template.sections.length : 0} Sections
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {template.price === 0 ? 'Free' : `$${template.price}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center pt-14"
        >
          <Button
            asChild
            variant="outline"
            className="border-2 border-slate-900/20 dark:border-white/20 text-slate-900 dark:text-white px-8 py-2 rounded-full font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            <Link href="/templates">
              Browse All Templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

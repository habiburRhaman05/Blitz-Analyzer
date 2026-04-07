'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Mock Data – 9 blog posts
// ---------------------------------------------------------------------------
const blogPosts = [
  {
    id: 1,
    title: '10 ATS-Friendly Resume Tips That Actually Work in 2025',
    excerpt:
      'Most resumes get rejected before a human ever reads them. Learn the proven formatting and keyword strategies to beat applicant tracking systems.',
    image:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop',
    category: 'Resume Tips',
    readTime: '6 min read',
    date: 'Jan 15, 2025',
    author: {
      name: 'Sarah Mitchell',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  },
  {
    id: 2,
    title: 'How to Quantify Your Achievements on a Resume',
    excerpt:
      "Hiring managers spend 7 seconds on your resume. Numbers grab attention instantly — here's how to turn vague bullet points into compelling metrics.",
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',
    category: 'Career Advice',
    readTime: '5 min read',
    date: 'Jan 8, 2025',
    author: {
      name: 'James Carter',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  },
  {
    id: 3,
    title: 'The Complete Guide to Writing a Tech Resume in 2025',
    excerpt:
      'From software engineers to product managers — a step-by-step framework for crafting a resume that stands out in the competitive tech industry.',
    image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=500&fit=crop',
    category: 'Industry Guide',
    readTime: '8 min read',
    date: 'Dec 28, 2024',
    author: {
      name: 'Emily Nguyen',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  },
  {
    id: 4,
    title: 'Understanding ATS Scoring: What Really Matters',
    excerpt:
      'Dive deep into how applicant tracking systems score your resume, which factors carry the most weight, and how to optimise every section.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    category: 'ATS Guide',
    readTime: '7 min read',
    date: 'Dec 20, 2024',
    author: {
      name: 'Daniel Park',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  },
  {
    id: 5,
    title: 'Top 5 Resume Mistakes Engineers Make (And How to Fix Them)',
    excerpt:
      'Technical skills alone won't land the interview. Avoid these common resume pitfalls that even experienced engineers fall victim to.',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',
    category: 'Resume Tips',
    readTime: '4 min read',
    date: 'Dec 14, 2024',
    author: {
      name: 'Olivia Chen',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
  },
  {
    id: 6,
    title: 'Navigating a Career Change: Resume Strategies That Work',
    excerpt:
      'Switching industries? Learn how to reframe your experience, highlight transferable skills, and craft a narrative that resonates with new employers.',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop',
    category: 'Career Advice',
    readTime: '6 min read',
    date: 'Dec 5, 2024',
    author: {
      name: 'Marcus Lee',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
  },
  {
    id: 7,
    title: 'How to Beat ATS Filters With Smart Keyword Placement',
    excerpt:
      'Keyword stuffing is dead. Discover the modern, intelligent approach to placing the right keywords in the right sections of your resume.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    category: 'ATS Guide',
    readTime: '5 min read',
    date: 'Nov 28, 2024',
    author: {
      name: 'Sarah Mitchell',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  },
  {
    id: 8,
    title: 'Healthcare Resume Guide: Stand Out in a Competitive Market',
    excerpt:
      'The healthcare industry has unique resume requirements. Learn how to present certifications, clinical experience, and achievements effectively.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop',
    category: 'Industry Guide',
    readTime: '7 min read',
    date: 'Nov 20, 2024',
    author: {
      name: 'Emily Nguyen',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  },
  {
    id: 9,
    title: 'The Art of Writing a Compelling Resume Summary',
    excerpt:
      'Your summary is the first thing recruiters read. Master the formula for writing a punchy, results-driven opening that hooks the reader immediately.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
    category: 'Resume Tips',
    readTime: '4 min read',
    date: 'Nov 12, 2024',
    author: {
      name: 'James Carter',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  },
]

// ---------------------------------------------------------------------------
// Category colour map
// ---------------------------------------------------------------------------
const categories = [
  'All',
  'Resume Tips',
  'Career Advice',
  'Industry Guide',
  'ATS Guide',
] as const

const categoryColors: Record<string, string> = {
  'Resume Tips':
    'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  'Career Advice':
    'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  'Industry Guide':
    'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  'ATS Guide':
    'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
}

const categoryFilterColors: Record<string, string> = {
  All: 'bg-primary text-white border-primary',
  'Resume Tips':
    'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500',
  'Career Advice':
    'bg-purple-600 text-white border-purple-600 dark:bg-purple-500 dark:border-purple-500',
  'Industry Guide':
    'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500',
  'ATS Guide':
    'bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500',
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, activeCategory])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  )
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  // Reset to page 1 when filters change
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* ----------------------------------------------------------------- */}
      {/* Hero Section                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 overflow-hidden">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          >
            <span>📝</span>
            <span>Blog & Resources</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Blog &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-cyan-300">
              Resources
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            Expert advice on resume writing, ATS optimization, and career
            strategy to help you land your dream job faster.
          </motion.p>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Search & Category Filters                                         */}
      {/* ----------------------------------------------------------------- */}
      <section className="container max-w-6xl mx-auto px-6 mb-12">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-md mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-12 rounded-xl pl-11 border-border bg-muted/30 focus-visible:ring-primary"
          />
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-bold border transition-all duration-200',
                activeCategory === cat
                  ? categoryFilterColors[cat]
                  : 'bg-muted/50 border-border text-slate-600 dark:text-slate-400 hover:border-primary/50'
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Blog Cards Grid                                                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="container max-w-6xl mx-auto px-6">
        <AnimatePresence mode="popLayout">
          {paginatedPosts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedPosts.map((post, index) => (
                <motion.article
                  layout
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden transition-all duration-300 shadow-xl shadow-transparent hover:shadow-blue-500/5 hover:border-slate-200 dark:hover:border-white/10"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm',
                          categoryColors[post.category] ??
                            'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                        )}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-5">
                      {post.excerpt}
                    </p>

                    {/* Author + Read More */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {post.author.name}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Read more
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                No articles found matching your search.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search query or category filter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --------------------------------------------------------------- */}
        {/* Pagination                                                      */}
        {/* --------------------------------------------------------------- */}
        {filteredPosts.length > POSTS_PER_PAGE && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-14 flex justify-center items-center gap-4"
          >
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-xl gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-xl gap-1.5"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  )
}

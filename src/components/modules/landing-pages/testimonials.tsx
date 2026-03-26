'use client'

import { Star, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'

const testimonials = [
  {
    id: 1,
    name: 'Leslie Alexander',
    role: 'Graphic Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content:
      'There was firm as well as an excellent experience for us, so we definitely plan to use them again.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Darlene Robertson',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content:
      'Diam facilis of dunc consectetur. Diam facilis of dunc posuere pulvinar is.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Eleanor Pena',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content:
      'We were impressed with how well Momentum Design collaborated with us.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Devon Lane',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    content: 'They were very professional with easy communication.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Floyd Miles',
    role: 'Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content:
      'They took my website without any direction and built it to exact specifications',
    rating: 5,
  },
  {
    id: 6,
    name: 'Cameron Williamson',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: 'The team was very responsible and easy to work with.',
    rating: 4,
  },
]

export function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  // Autoplay plugin
  const autoplay = Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    stopOnFocusIn: true,
    playOnInit: true,
  })

  useEffect(() => {
    if (!api) return

    // Update progress bar on autoplay
    const interval = setInterval(() => {
      if (!isPlaying) return
      const current = api.selectedScrollSnap()
      const total = api.scrollSnapList().length
      // Simple progress: simulate based on time
      // For real progress, we'd need to track time remaining; this is a placeholder.
    }, 100)

    return () => clearInterval(interval)
  }, [api, isPlaying])

  const toggleAutoplay = () => {
    if (autoplay) {
      if (isPlaying) {
        autoplay.stop()
      } else {
        autoplay.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-4">
            Loved by the community.
          </h2>

          {/* Rating with animated stars */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-scaleIn"
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              4.8 out of 5
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              based on 10,007 reviews
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            plugins={[autoplay]}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full group">
                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800/50">
                      {/* Gradient hover effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>

                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 ring-2 ring-white dark:ring-slate-800"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom navigation buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-md transition-all duration-300 hover:scale-110" />
              <CarouselNext className="static translate-y-0 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-md transition-all duration-300 hover:scale-110" />
            </div>

            {/* Autoplay toggle button */}
            <button
              onClick={toggleAutoplay}
              className="absolute -top-12 right-0 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Play
                </>
              )}
            </button>
          </Carousel>
        </div>

        {/* See All Reviews Button */}
        <div className="flex justify-center pt-12 animate-fadeIn">
          <Button
            variant="outline"
            className="border-2 border-gray-900/20 dark:border-white/20 text-gray-900 dark:text-white px-8 py-2 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            See all reviews
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Custom CSS for animations and progress (SASS style) */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  )
}
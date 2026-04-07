'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const predefinedResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: ['improve', 'resume', 'better', 'enhance', 'tips'],
    response:
      'Great question! Here are some tips to improve your resume:\n\n1. **Quantify achievements** — use numbers and metrics.\n2. **Tailor keywords** to the job description.\n3. **Use action verbs** like "led", "built", "optimized".\n4. **Keep it concise** — ideally 1-2 pages.\n5. Run it through our **ATS Analyzer** for a detailed score!',
  },
  {
    keywords: ['ats', 'applicant tracking', 'tracking system'],
    response:
      'ATS stands for **Applicant Tracking System**. It\'s software that companies use to filter resumes before a human ever sees them. Our analyzer checks your resume against ATS algorithms and gives you an optimization score with actionable feedback.',
  },
  {
    keywords: ['score', 'ats score', 'rating', 'how scored'],
    response:
      'Your ATS score is calculated based on keyword relevance, formatting compatibility, section structure, and content quality. Aim for a score above **80%** to maximize your chances of getting past automated filters.',
  },
  {
    keywords: ['format', 'template', 'layout', 'design'],
    response:
      'We offer multiple professionally designed templates optimized for ATS compatibility. Visit the **Resume Builder** section to choose a template, customize colors and fonts, and export a polished PDF ready for applications.',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'free', 'plan', 'subscription'],
    response:
      'We offer a **free tier** with basic resume analysis and limited credits. Our Pro and Enterprise plans unlock unlimited analyses, AI rewriting, advanced templates, and priority support. Check the **Pricing** page for details!',
  },
  {
    keywords: ['keyword', 'keywords', 'job description', 'match'],
    response:
      'Keywords are crucial for ATS optimization! Our **Job Matcher** tool compares your resume against a specific job description and highlights missing keywords, skills, and phrases you should include to improve your match rate.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'sup'],
    response:
      'Hey there! 👋 I\'m the Blitz AI Assistant. I can help you with resume tips, ATS optimization, templates, pricing, and more. What would you like to know?',
  },
  {
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    response:
      'You\'re welcome! 😊 If you have any more questions about resumes, ATS optimization, or our platform, feel free to ask anytime.',
  },
]

const genericResponse =
  "That's a great question! While I may not have the exact answer, I recommend exploring our **Resume Analyzer** tool for detailed insights or checking the **FAQ** section. You can also reach out to our support team through the **Contact** page for personalized help!"

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi there! 👋 I'm the **Blitz AI Assistant**. I can help you with resume tips, ATS optimization, templates, and more. How can I help you today?",
}

function getResponse(input: string): string {
  const normalized = input.toLowerCase().trim()

  for (const entry of predefinedResponses) {
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      return entry.response
    }
  }

  return genericResponse
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-primary/60"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const delay = 1000 + Math.random() * 1000 // 1-2 seconds

    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: getResponse(trimmed),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, delay)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-[60]"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] max-w-sm"
          >
            <div className="flex flex-col max-h-[500px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-none">
                      Blitz AI Assistant
                    </h3>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      Always here to help
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[300px] max-h-[360px] scroll-smooth">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md border border-border/50'
                      )}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl rounded-bl-md border border-border/50">
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-border px-3 py-3 bg-background">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    disabled={isTyping}
                    className="flex-1 h-10 rounded-xl border-border bg-muted/50 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                    className="h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Powered by Blitz AI · Instant answers
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

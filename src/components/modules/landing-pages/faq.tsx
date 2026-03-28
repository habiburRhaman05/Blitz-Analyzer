"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const faqItems = [
  { id: 1, category: "General", question: "How can I use the AI Analyzer for free?", answer: "Every new user gets 5 free credits to test our ATS analysis. No credit card is required to start." },
  { id: 2, category: "General", question: "How secure is my resume data?", answer: "We use AES-256 encryption. Your resumes are never sold to third parties and are only used for your specific analysis." },
  { id: 3, category: "Download", question: "In what formats can I download the report?", answer: "Reports are available as PDF, high-quality PNG for LinkedIn, and raw JSON for developers." },
  { id: 4, category: "Payment", question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and even crypto for our Enterprise lifetime plans." },
  { id: 5, category: "License", question: "Can I use the templates for client work?", answer: "Yes, our 'Pro' and 'Agency' licenses allow you to generate resumes for your own clients or recruitment agency." },
  { id: 6, category: "Refund", question: "What is your refund policy?", answer: "If you're not satisfied, we offer a 7-day money-back guarantee for unused credits." },
];

const categories = ["General", "Download", "Payment", "License", "Refund"];

export function FAQSection() {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [selectedCategory, setSelectedCategory] = useState("General");

  const filteredFaqs = faqItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="relative w-full bg-background py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Support Center
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Have questions? <br /> <span className="text-muted-foreground">We have answers.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR: Categories */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2 mb-4">Categories</p>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setExpandedId(null);
                    }}
                    className={cn(
                      "relative flex-1 lg:flex-none text-left px-5 py-3.5 rounded-2xl font-semibold transition-all duration-200 group",
                      isActive 
                        ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/5 border border-blue-500/20" 
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    )}
                  >
                    {category}
                    {isActive && (
                      <motion.div 
                        layoutId="active-cat"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-600 rounded-full hidden lg:block"
                      />
                    )}
                  </button>
                );
              })}
            </div>

           
          </div>

          {/* CONTENT: FAQ Accordion */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {filteredFaqs.map((item) => {
                  const isOpen = expandedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "group rounded-2xl border transition-all duration-300",
                        isOpen 
                          ? "bg-white dark:bg-slate-900 border-blue-500/30 shadow-lg shadow-blue-500/5" 
                          : "bg-slate-50/50 dark:bg-slate-900/30 border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                      )}
                    >
                      <button
                        onClick={() => setExpandedId(isOpen ? null : item.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                      >
                        <span className={cn(
                          "font-bold transition-colors",
                          isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-200 group-hover:text-blue-500"
                        )}>
                          {item.question}
                        </span>
                        <div className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-full transition-all",
                          isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        )}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2">
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
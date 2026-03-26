"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Filter, Plus, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_REVIEWS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: `User ${i + 1}`,
  rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
  comment: "This AI analyzer completely changed my job hunt workflow. High production quality!",
  date: "March 2026",
  category: i % 2 === 0 ? "Feature" : "Support",
}));

export default function ReviewsPage() {
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredReviews = MOCK_REVIEWS.filter(r => filter === "All" || r.rating === Number(filter));
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">Wall of Love</h1>
            <p className="text-muted-foreground">See what world-class engineers are saying about Blitz.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-12 px-6 gap-2 bg-primary shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Review
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {["All", "5", "4", "3"].map((rating) => (
            <button
              key={rating}
              onClick={() => {setFilter(rating); setCurrentPage(1);}}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold border transition-all shrink-0",
                filter === rating ? "bg-primary text-white border-primary" : "bg-muted/50 border-border hover:border-primary/50"
              )}
            >
              {rating === "All" ? "All Reviews" : `${rating} Stars`}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {paginatedReviews.map((review) => (
              <motion.div
                layout
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted")} />
                  ))}
                </div>
                <p className="text-sm italic mb-6 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{review.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold">Page {currentPage} of {totalPages}</span>
          <Button 
            variant="outline" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border p-8 rounded-[32px] shadow-2xl"
            >
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold">Share your experience</h2>
                    <p className="text-muted-foreground text-sm">Help others build better career paths.</p>
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Your Name" className="h-12 rounded-xl" required />
                    <select className="w-full h-12 rounded-xl bg-background border border-border px-4 text-sm font-medium">
                      <option>5 Stars - Excellent</option>
                      <option>4 Stars - Great</option>
                      <option>3 Stars - Good</option>
                    </select>
                    <textarea 
                      placeholder="Tell us what you liked..." 
                      className="w-full min-h-[120px] rounded-xl bg-background border border-border p-4 text-sm"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold">Post Review</Button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold">Review Published!</h2>
                  <p className="text-muted-foreground">Thank you for your valuable feedback.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Filter, Crown, FileText, 
  ArrowRight, Wand2, Loader2, ArrowLeft 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { useApiQuery } from "@/hooks/useApiQuery";

// --- Types based on your API Response ---
interface TemplateData {
  id: string;
  name: string;
  slug: string;
  previewUrl: string;
  isPremium: boolean;
  price: number;
  htmlLayout: string;
  sections: string[];
  descriptions: {
    core_details: string;
    targetUser: string;
  };
}

const categories = ["all", "professional", "creative", "simple", "modern"] as const;

const TemplateSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-6 min-h-[350px] flex flex-col animate-pulse">
    <div className="flex-1 space-y-4">
      <div className="w-full h-40 bg-muted rounded-lg" />
      <div className="h-6 w-3/4 bg-muted rounded" />
      <div className="h-4 w-full bg-muted rounded" />
    </div>
  </div>
);

export default function CreateResumeWrapper() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("all");
  const [showPremium, setShowPremium] = useState<"all" | "free" | "premium">("all");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // --- API Fetching ---
  const { data, isFetching } = useApiQuery(
    ["templates-list"],
    "/template",
    "axios",
    { staleTime: 1000 * 60 * 5 }
  );

  const templates: TemplateData[] = data?.data || [];

  // --- Filtering Logic ---
  const filtered = templates.filter((t) => {
    // Note: Since 'category' isn't explicitly in your JSON root but in descriptions, 
    // we match against the 'slug' or 'name' for this example.
    const matchesCategory = category === "all" || t.slug.includes(category) || t.name.toLowerCase().includes(category);
    const matchesPremium = 
      showPremium === "all" || 
      (showPremium === "free" && !t.isPremium) || 
      (showPremium === "premium" && t.isPremium);
    
    return matchesCategory && matchesPremium;
  });

  const handleSelectTemplate = (id: string) => {
    router.push(`/dashboard/resumes/${id}?mode=template`);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    const id = `ai-${Date.now()}`;
    setAiLoading(false);
    setAiModalOpen(false);
    router.push(`/dashboard/resumes/${id}?mode=ai&prompt=${encodeURIComponent(aiPrompt)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold italic tracking-tight">Blitz AI</span>
            </div>
          </div>
          <Button
            onClick={() => setAiModalOpen(true)}
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 rounded-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold md:text-5xl mb-4">
            Choose Your <span className="text-primary italic">Template</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select a high-performance layout optimized for ATS and human recruiters.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground mr-2" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 ${category === cat ? "bg-primary shadow-md" : ""}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex items-center bg-muted/50 p-1 rounded-full border border-border">
            {(["all", "free", "premium"] as const).map((type) => (
              <Button
                key={type}
                variant={showPremium === type ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowPremium(type)}
                className="rounded-full px-4"
              >
                {type === "premium" && <Crown className="h-3 w-3 mr-1 text-amber-500" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* AI Generation Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setAiModalOpen(true)}
            className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 flex flex-col items-center justify-center text-center min-h-[350px] hover:border-primary hover:bg-primary/10 transition-all shadow-sm"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/30 group-hover:rotate-6 transition-transform">
              <Wand2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Smart Build</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload a job description and let Blitz AI tailor your resume instantly.
            </p>
          </motion.div>

          {/* Actual Data */}
          {isFetching ? (
            Array.from({ length: 4 }).map((_, i) => <TemplateSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectTemplate(template.id)}
                  className="group relative cursor-pointer rounded-2xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col"
                >
                  {/* Image/Preview Area */}
                  <div className="relative h-52 bg-muted overflow-hidden">
                    <img 
                      src={template.previewUrl} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {template.isPremium && (
                      <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-none shadow-lg">
                        <Crown className="h-3 w-3 mr-1" /> Premium
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                       <p className="text-white text-xs font-medium line-clamp-2">
                        {template.descriptions.core_details}
                       </p>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{template.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Target: {template.descriptions.targetUser}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {template.sections.length} Sections
                      </div>
                      <span className="text-xs text-primary font-bold flex items-center gap-1">
                        Select <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* AI Modal */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              <Wand2 className="h-6 w-6 text-primary" />
              AI Prompt
            </DialogTitle>
            <DialogDescription>
              Describe your career or paste a job link. We&apos;ll handle the rest.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="e.g., I am a Fullstack Developer specializing in Next.js and AI integration. Help me build a resume for a Senior Role at a fintech startup."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[160px] rounded-2xl bg-muted/30 border-border/60 focus:ring-primary/20 resize-none p-4"
            />
            <Button
              className="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20"
              onClick={handleAiGenerate}
              disabled={!aiPrompt.trim() || aiLoading}
            >
              {aiLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate My Resume
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
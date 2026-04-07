'use client';

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Crown, FileText,
  Filter,
  LayoutGrid,
  Plus,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useQuery } from "@tanstack/react-query";
import { getAllTemplateDetailsPublic, getAllTemplatePublic } from "@/services/admin.services";
import Link from "next/link";

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

const ITEMS_PER_PAGE = 8;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "sections">("name");
  const [currentPage, setCurrentPage] = useState(1);


 

  const { data,isFetching } = useQuery(
    {
      queryKey:["templates-list"],
      queryFn:()=>getAllTemplatePublic()
    }
  )


  const templates: TemplateData[] | any = data?.data || [];

  // --- Filtering, Sorting & Pagination Logic ---
  const filtered = useMemo(() => {
    let items = templates.filter((t:TemplateData) => {
      const matchesCategory = category === "all" || t.slug.includes(category) || t.name.toLowerCase().includes(category);
      const matchesPremium = 
        showPremium === "all" || 
        (showPremium === "free" && !t.isPremium) || 
        (showPremium === "premium" && t.isPremium);
      const matchesSearch = searchQuery === "" || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.descriptions.core_details.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPremium && matchesSearch;
    });

    items.sort((a: TemplateData, b: TemplateData) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "sections") return b.sections.length - a.sections.length;
      return 0;
    });

    return items;
  }, [templates, category, showPremium, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedTemplates = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSelectTemplate = (id: string) => {
    router.push(`/dashboard/templates/${id}?mode=template`);
  };



  return (
    <div className="min-h-screen bg-background">


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

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates by name or description..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
            className="h-12 pl-11 rounded-xl border-border bg-muted/30 focus-visible:ring-primary"
          />
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground mr-2" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => { setCategory(cat); handleFilterChange(); }}
                className={`rounded-full px-5 ${category === cat ? "bg-primary shadow-md" : ""}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort: {sortBy === "name" ? "Name" : sortBy === "price-low" ? "Price ↑" : sortBy === "price-high" ? "Price ↓" : "Sections"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("sections")}>Most Sections</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center bg-muted/50 p-1 rounded-full border border-border">
              {(["all", "free", "premium"] as const).map((type) => (
                <Button
                  key={type}
                  variant={showPremium === type ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => { setShowPremium(type); handleFilterChange(); }}
                  className="rounded-full px-4"
                >
                  {type === "premium" && <Crown className="h-3 w-3 mr-1 text-amber-500" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* custom card */}
          <Link href={"/dashboard/resumes/builder/657655"}>
           <motion.div
            whileHover={{ y: -5 }}
            className="group relative cursor-pointer rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex flex-col items-center justify-center text-center transition-all hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm"
          >
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
              <Plus className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Blank Slate</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Start from scratch and build your resume your way.
            </p>
          </motion.div>
          </Link>
         
         
        </div>
        {/* --- Section: Market Templates --- */}
        <div className="space-y-8 mt-8">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Marketplace Templates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isFetching ? (
              Array.from({ length: 4 }).map((_, i) => <TemplateSkeleton key={i} />)
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedTemplates.map((template:TemplateData) => (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleSelectTemplate(template.id)}
                    className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                      <img 
                        src={template.previewUrl} 
                        alt={template.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                      />
                      {template.isPremium && (
                        <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-xl">
                          <Crown className="h-3 w-3 mr-1.5" /> Premium
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                         <Button className="w-full rounded-full font-bold">


                          Use Template
                         
                         </Button>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">{template.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {template.descriptions.core_details}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          <FileText className="h-3 w-3" />
                          {template.sections.length} Sections
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

        {/* Pagination */}
        {!isFetching && filtered.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-xl gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm font-bold text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-xl gap-1.5"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
    </div>
  );
}
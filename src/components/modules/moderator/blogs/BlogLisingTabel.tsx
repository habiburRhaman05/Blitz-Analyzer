
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import {
  FileText,
  Edit,
  Trash2,
  Plus,
  Eye,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Command,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { AnimatedCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Logic & Services
import { useApiQuery } from "@/hooks/useApiQuery";
import { deleteBlog } from "@/services/blog.services";
import { useQueryClient } from "@tanstack/react-query";

// --- INTERFACES & ENUMS ---
export enum BlogStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}

interface IBlog {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  category?: string;
  status: BlogStatus;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};

type SearchSource = "local" | "groq" | "fallback";

type RankedBlog = IBlog & {
  matchPercent: number;
  matchFields: string[];
  source: SearchSource;
};

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  return normalizeText(text).split(" ").filter(Boolean);
}

function getMatchFields(query: string, blog: IBlog) {
  const q = normalizeText(query);
  if (!q) return ["page"];

  const fields: string[] = [];
  const title = normalizeText(blog.title);
  const slug = normalizeText(blog.slug);
  const category = normalizeText(blog.category || "");
  const status = normalizeText(blog.status);
  const createdAt = normalizeText(blog.createdAt);

  if (title.includes(q)) fields.push("title");
  if (slug.includes(q)) fields.push("slug");
  if (category.includes(q)) fields.push("category");
  if (status.includes(q)) fields.push("status");
  if (createdAt.includes(q)) fields.push("date");

  const qTokens = tokenize(q);
  if (qTokens.some((token) => title.includes(token))) fields.push("title");
  if (qTokens.some((token) => slug.includes(token))) fields.push("slug");
  if (qTokens.some((token) => category.includes(token))) fields.push("category");

  return Array.from(new Set(fields.length ? fields : ["semantic"]));
}

function scoreToPercent(fuseScore: number | null | undefined) {
  const score = typeof fuseScore === "number" ? fuseScore : 1;
  return Math.max(1, Math.min(100, Math.round((1 - score) * 100)));
}

// --- SUB-COMPONENTS: SEARCH POPUP ---
const SearchOverlay = ({
  isOpen,
  onClose,
  items,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: IBlog[];
  onSelect: (slug: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [resultState, setResultState] = useState<"idle" | "suggestions" | "empty">("suggestions");
  const [rankedSuggestions, setRankedSuggestions] = useState<RankedBlog[]>([]);
  const [rankingSource, setRankingSource] = useState<SearchSource>("local");

  const requestIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: [
        { name: "title", weight: 0.45 },
        { name: "slug", weight: 0.1 },
        { name: "category", weight: 0.15 },
        { name: "status", weight: 0.1 },
        { name: "createdAt", weight: 0.05 },
      ],
      threshold: 0.35,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  const defaultSuggestions = useMemo(() => {
    return items.slice(0, 4).map((item) => ({
      ...item,
      matchPercent: 100,
      matchFields: ["page"],
      source: "local" as const,
    }));
  }, [items]);

  const localSuggestions = useMemo(() => {
    const q = query.trim();

    if (!q) return defaultSuggestions;

    const fuseMatches = fuse.search(q).slice(0, 10);

    return fuseMatches.map((res) => {
      const item = res.item;
      return {
        ...item,
        matchPercent: scoreToPercent(res.score),
        matchFields: getMatchFields(q, item),
        source: "local" as const,
      };
    });
  }, [query, fuse, defaultSuggestions]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setRankedSuggestions(defaultSuggestions);
      setResultState("suggestions");
      setIsSearching(false);
      setRankingSource("local");
      return;
    }

    if (localSuggestions.length === 0) {
      setRankedSuggestions([]);
      setResultState("empty");
      setIsSearching(false);
      setRankingSource("local");
      return;
    }

    setRankedSuggestions(localSuggestions);
    setResultState("suggestions");
    setIsSearching(true);

    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/blog-search-rerank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            candidates: localSuggestions.slice(0, 10).map(({ matchPercent, matchFields, source, ...item }) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              category: item.category,
              status: item.status,
              createdAt: item.createdAt,
            })),
          }),
        });

        const data = await res.json();
        if (requestId !== requestIdRef.current) return;

        const rankedIds: string[] = Array.isArray(data?.rankedIds) ? data.rankedIds : [];
        if (!rankedIds.length) {
          setRankedSuggestions(localSuggestions);
          setRankingSource("fallback");
          setIsSearching(false);
          return;
        }

        const map = new Map(localSuggestions.map((item) => [item.id, item]));
        const reordered = rankedIds
          .map((id) => map.get(id))
          .filter(Boolean) as RankedBlog[];

        setRankedSuggestions(reordered.length ? reordered : localSuggestions);
        setRankingSource(data?.mode === "groq" ? "groq" : "fallback");
      } catch {
        if (requestId !== requestIdRef.current) return;
        setRankedSuggestions(localSuggestions);
        setRankingSource("fallback");
      } finally {
        if (requestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => window.clearTimeout(timer);
  }, [query, localSuggestions, defaultSuggestions]);

  const handlePick = (item: RankedBlog) => {
    onSelect(item.slug);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/5 bg-muted/30">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
                placeholder="Search blogs or type a command..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] opacity-50 px-1">
                  ESC
                </Badge>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 min-h-[300px] flex flex-col">
              {isSearching ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Fuse.js matching first, Groq reranking next...
                  </p>
                </div>
              ) : resultState === "suggestions" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                      Suggestions
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Powered by Fuse.js + {rankingSource === "groq" ? "Groq AI" : "local ranking"}
                    </p>
                  </div>

                  <div className="grid gap-1">
                    {rankedSuggestions.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handlePick(item)}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-primary/5 transition-colors text-left group"
                      >
                        <Command className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium truncate">{item.title}</span>
                            <span className="text-xs font-semibold text-primary shrink-0">
                              {item.matchPercent}%
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{item.category || "General"}</span>
                            <span>•</span>
                            <span>{item.status}</span>
                            <span>•</span>
                            <span>#{idx + 1}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold">No results for "{query}"</h3>
                  <Button
                    variant="link"
                    onClick={() => {
                      setQuery("");
                      setResultState("suggestions");
                    }}
                    className="mt-4 text-primary"
                  >
                    Back to suggestions
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- BLOG MANAGER SECTION ---

const BlogManagerSection = ({
  blogs,
  isLoading,
  onDelete,
  onView,
  onEdit,
  filters,
  setFilters,
  meta,
  deletingId,
}: any) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const isGlobalLoading = !!deletingId;

  return (
    <AnimatedCard delay={0.1} className="mb-8 border-none bg-card/50 backdrop-blur-md overflow-visible">
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={blogs || []}
        onSelect={(slug: string) => {
          setIsSearchOpen(false);
          onView(slug);
        }}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-1">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">Blog Studio</h3>
            <p className="text-xs text-muted-foreground">Manage and monitor your digital footprint</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 bg-background/40 rounded-xl border border-white/5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="h-10 w-10 rounded-lg hover:bg-primary/10 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v, page: 1 })}>
              <SelectTrigger className="w-[140px] border-none bg-transparent focus:ring-0">
                <Filter className="h-4 w-4 mr-2 opacity-50" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => router.push("/moderator/dashboard/manage-blogs/create")}
            className="gap-2 px-6 shadow-xl shadow-primary/20 rounded-xl hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl border border-white/5 bg-background/20 overflow-hidden">
            {isGlobalLoading && (
              <div className="absolute inset-0 z-20 bg-background/5 backdrop-blur-[1px] cursor-not-allowed" />
            )}

            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="w-[45%]">Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <AnimatePresence mode="popLayout">
                  {blogs?.map((blog: IBlog) => {
                    const isItemDeleting = deletingId === blog.id;

                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={blog.id}
                        className="group border-white/5 hover:bg-primary/5 transition-colors"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span
                              className="font-bold cursor-pointer hover:text-primary"
                              onClick={() => !isGlobalLoading && onView(blog.slug)}
                            >
                              {blog.title}
                            </span>
                            <span className="text-[10px] uppercase text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="bg-background/50">
                            {blog.category || "General"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className={`${statusColors[blog.status] || statusColors.DRAFT} border text-[10px]`}>
                            {blog.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right px-6">
                          <div className="flex justify-end gap-1">
                            {isItemDeleting ? (
                              <div className="h-8 w-8 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                              </div>
                            ) : (
                              <>
                                <Button
                                  onClick={() => onView(blog.slug)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => onEdit(blog.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-500"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => onDelete(blog.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-destructive/10 text-destructive/80 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {meta?.total > 10 && (
            <div className="flex items-center justify-between px-2 pt-2">
              <p className="text-xs text-muted-foreground">
                Showing <span className="text-foreground font-medium">{blogs.length}</span> of{" "}
                <span className="text-foreground font-medium">{meta.total}</span> entries
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === 1 || isGlobalLoading}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  className="h-8 w-8 p-0 rounded-lg border-white/5 bg-white/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 px-3 h-8 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                  Page {filters.page}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={blogs.length < 10 || isGlobalLoading}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="h-8 w-8 p-0 rounded-lg border-white/5 bg-white/5"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatedCard>
  );
};

// --- MAIN PAGE ---

const BlogListingTabel = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const searchTerm = searchParams.get("q") || "";

  const queryUrl = `/blog?page=${page}&limit=10${status !== "all" ? `&status=${status}` : ""}${
    searchTerm ? `&searchTerm=${searchTerm}` : ""
  }`;

  const { data, isLoading } = useApiQuery(["fetch-blogs", page, status, searchTerm], queryUrl, "axios");

  const blogs = data?.data?.data || [];
  const meta = data?.data?.meta || { total: 0 };

  const updateUrl = (filters: any) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.status) params.set("status", filters.status);
    if (filters.page) params.set("page", filters.page.toString());
    else params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    toast.promise(deleteBlog(id), {
      loading: "Deleting...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["fetch-blogs"] });
        setDeletingId(null);
        return "Deleted successfully";
      },
      error: () => {
        setDeletingId(null);
        return "Error deleting blog";
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 relative">
      <BlogManagerSection
        blogs={blogs}
        isLoading={isLoading}
        onDelete={handleDelete}
        onView={(slug: string) => router.push(`/blog/${slug}`)}
        onEdit={(id: string) => router.push(`/moderator/dashboard/manage-blogs/edit/${id}`)}
        filters={{ status, page }}
        setFilters={updateUrl}
        meta={meta}
        deletingId={deletingId}
      />
    </div>
  );
};

export default BlogListingTabel;
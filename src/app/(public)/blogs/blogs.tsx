
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText,
  Inbox,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { useApiQuery } from "@/hooks/useApiQuery";

// --- TYPES ---------------------------------------------------------------

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

type SearchSource = "local" | "groq" | "fallback";

type RankedBlog = IBlog & {
  matchPercent: number;
  matchFields: string[];
  source: SearchSource;
};

type BlogFilters = {
  status: string;
  page: number;
  q: string;
};

type BlogMeta = {
  total: number;
};

const LIMIT = 12;

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DRAFT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};

// --- HELPERS -------------------------------------------------------------

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

function formatDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function buildPaginationRange(currentPage: number, totalPages: number) {
  const pages: Array<number | "..."> = [];
  const delta = 1;

  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);

  if (rangeStart > 2) pages.push("...");

  for (let page = rangeStart; page <= rangeEnd; page += 1) {
    pages.push(page);
  }

  if (rangeEnd < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

function safeGetStatus(value: string) {
  if (value === BlogStatus.PUBLISHED) return BlogStatus.PUBLISHED;
  if (value === BlogStatus.DRAFT) return BlogStatus.DRAFT;
  if (value === BlogStatus.ARCHIVED) return BlogStatus.ARCHIVED;
  return "all";
}

// --- SEARCH MODAL --------------------------------------------------------

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  items: IBlog[];
  initialQuery?: string;
  onApplyQuery: (query: string) => void;
};

const SearchOverlay = ({ isOpen, onClose, items, initialQuery = "", onApplyQuery }: SearchOverlayProps) => {
  const [query, setQuery] = useState(initialQuery);
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
    return items.slice(0, 6).map((item) => ({
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
    if (isOpen) {
      setQuery(initialQuery);
      setResultState("suggestions");
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        const trimmed = query.trim();
        if (trimmed) onApplyQuery(trimmed);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, onApplyQuery, query]);

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
    onApplyQuery(item.title);
    onClose();
  };

  const handleApplyRawQuery = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onApplyQuery(trimmed);
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
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border/60 bg-muted/30 px-4 py-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                autoFocus
                className="flex-1 border-none bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-lg"
                placeholder="Search blogs by title, slug, or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-1 text-[10px] uppercase tracking-wider opacity-70">
                  Enter
                </Badge>
                <Badge variant="outline" className="px-2 py-1 text-[10px] uppercase tracking-wider opacity-70">
                  ESC
                </Badge>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex min-h-[320px] flex-col p-4">
              {isSearching ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Fuse.js matching first, then optional AI reranking.
                  </p>
                </div>
              ) : resultState === "suggestions" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/70">
                      Suggestions
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {rankingSource === "groq" ? "AI reranked" : "Local ranking"}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {rankedSuggestions.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handlePick(item)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-primary/5"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-sm font-semibold">{item.title}</span>
                            <span className="shrink-0 text-xs font-semibold text-primary">
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

                  <div className="pt-2">
                    <Button onClick={handleApplyRawQuery} className="w-full">
                      Apply current query
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
                    <Inbox className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold">No results for &quot;{query}&quot;</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try a shorter keyword, a category, or a blog title.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setQuery("")}
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

// --- UI PARTS ------------------------------------------------------------

function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <BlogCardSkeleton key={idx} />
      ))}
    </div>
  );
}

function BlogCard({
  blog,
}: {
  blog: IBlog;
}) {
  const statusClass = statusColors[blog.status] || statusColors.DRAFT;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
    >
      <Link href={`/blog/${blog.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {blog.thumbnail ? (
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${blog.thumbnail})` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background/80">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4">
            <Badge className={`border text-[10px] uppercase tracking-[0.2em] ${statusClass}`}>
              {blog.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Badge variant="outline" className="rounded-full bg-background/60">
              {blog.category || "General"}
            </Badge>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(blog.createdAt)}
            </span>
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight group-hover:text-primary">
            {blog.title}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              Read the full post
            </span>

            <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-semibold transition-colors group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
              Open article
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPaginationRange(page, totalPages);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page === 1}
          onClick={() => onPageChange(page - 1)}
          className="h-9 rounded-xl"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Prev
        </Button>

        {pages.map((entry, idx) =>
          entry === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={entry}
              variant={entry === page ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onPageChange(entry)}
              className="h-9 min-w-9 rounded-xl px-3"
            >
              {entry}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-9 rounded-xl"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ActiveFilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      onClick={onClear}
      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
      type="button"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}

// --- MAIN PAGE -----------------------------------------------------------

export default function PublicBlogListingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchOpen, setSearchOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const searchTerm = searchParams.get("q") || "";

  const queryUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(LIMIT));

    if (status !== "all") {
      params.set("status", status);
    }

    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm.trim());
    }

    return `/blog?${params.toString()}`;
  }, [page, status, searchTerm]);

  const { data, isLoading } = useApiQuery(
    ["fetch-public-blogs", page, status, searchTerm],
    queryUrl,
    "axios"
  );

  const blogs: IBlog[] = data?.data?.data || [];
  const meta: BlogMeta = data?.data?.meta || { total: 0 };

  const totalPages = Math.max(1, Math.ceil((meta?.total || 0) / LIMIT));

  const updateUrl = (nextFilters: Partial<BlogFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextStatus = nextFilters.status ?? status;
    const nextPage = nextFilters.page ?? 1;
    const nextQuery = nextFilters.q ?? searchTerm;

    params.set("page", String(nextPage));

    if (nextStatus && nextStatus !== "all") {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    if (nextQuery && nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    updateUrl({
      status: value,
      page: 1,
      q: searchTerm,
    });
  };

  const handleSearchApply = (query: string) => {
    updateUrl({
      q: query,
      page: 1,
      status,
    });
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    updateUrl({
      page: nextPage,
      status,
      q: searchTerm,
    });
  };

  // Kept only because the original code already had delete flow in the same file.
  // It stays harmless here and can be wired to admin mode later without rework.
  const handleDeleteLikeApi = async (_id: string) => {
    setDeletingId(_id);
    try {
      toast.info("Delete action is not exposed on the public page.");
    } finally {
      setDeletingId(null);
    }
  };

  const hasActiveFilters = status !== "all" || Boolean(searchTerm);

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={blogs || []}
        initialQuery={searchTerm}
        onApplyQuery={handleSearchApply}
      />

      <section className="mb-8 overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-background via-background to-primary/5 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <FileText className="h-3.5 w-3.5" />
              Public blog library
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              Enjoy Our Blogs
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Discover fresh ideas, product stories, and practical insights in a clean public reading experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => setSearchOpen(true)}
              className="h-11 rounded-xl px-5 shadow-lg shadow-primary/15"
            >
              <Search className="mr-2 h-4 w-4" />
              Search blogs
            </Button>

            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="h-11 rounded-xl px-5"
            >
              Reset filters
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={safeGetStatus(status)} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-11 w-[170px] rounded-xl">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value={BlogStatus.PUBLISHED}>Published</SelectItem>
                  <SelectItem value={BlogStatus.DRAFT}>Drafts</SelectItem>
                  <SelectItem value={BlogStatus.ARCHIVED}>Archived</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="h-11 rounded-xl sm:hidden"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {meta?.total || 0} total result{meta?.total === 1 ? "" : "s"}
            </span>
            {searchTerm ? (
              <ActiveFilterChip label={`Search: ${searchTerm}`} onClear={() => updateUrl({ q: "", page: 1, status })} />
            ) : null}
            {status !== "all" ? (
              <ActiveFilterChip label={`Status: ${status}`} onClear={() => updateUrl({ status: "all", page: 1, q: searchTerm })} />
            ) : null}
          </div>
        </div>
      </section>

      {isLoading ? (
        <BlogGridSkeleton />
      ) : blogs.length ? (
        <div className="space-y-6">
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={Boolean(deletingId)}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
            <Inbox className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-xl font-bold">No blogs found</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Try a different keyword or remove the active filter.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button onClick={() => setSearchOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              Search again
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </div>
      )}

      {/* This call is intentionally left in place so the file stays easy to adapt
          if you later merge public and admin pages into one shared component set. */}
      <div className="hidden">
        <button onClick={() => handleDeleteLikeApi("public-placeholder")}>hidden</button>
      </div>
    </div>
  );
}

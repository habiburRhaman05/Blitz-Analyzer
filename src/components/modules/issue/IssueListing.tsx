"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    ChevronLeft, ChevronRight,
    Clock,
    LayoutGrid,
    Loader2,
    MapPin,
    MessageCircle,
    MessageSquare,
    Search,
    Tag,
    User,
    X,
    Zap
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { IssueCreateModal } from "./CreateIssueModal";

// --- Types based on Prisma ---
type IssueType = "ISSUE" | "IMPROVEMENT" | "FEEDBACK";
type IssueStatus = "PENDING" | "SUCCESS";

interface Issue {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  location: string;
  userMessage: string;
  adminFeedback?: string;
  imageUrl?: string;
  createdAt: string;
}

// --- Mock API with Pagination and Filters ---
const fetchIssues = async (params: {
  type?: string;
  status?: string;
  page: number;
  search?: string;
}): Promise<{ data: Issue[]; totalPages: number }> => {
  await new Promise((r) => setTimeout(r, 800));
  // Mock data with search filtering (client-side mock)
  const allIssues: Issue[] = [
    {
      id: "1",
      title: "Latency in Checkout",
      description: "Payment processing takes 30s+ causing user drop-off.",
      type: "ISSUE",
      status: "PENDING",
      location: "Web/Payments",
      userMessage: "This is frustrating, I almost closed the tab.",
      createdAt: "2026-04-08T10:00:00Z",
    },
    {
      id: "2",
      title: "Add Apple Pay",
      description: "Requesting native integration for faster checkout.",
      type: "IMPROVEMENT",
      status: "SUCCESS",
      location: "iOS App",
      userMessage: "Please add this for faster checkout.",
      adminFeedback: "Integrated in v2.4.0",
      createdAt: "2026-04-07T12:00:00Z",
    },
    {
      id: "3",
      title: "UI is very clean",
      description: "Design feedback on the new dashboard.",
      type: "FEEDBACK",
      status: "PENDING",
      location: "Landing Page",
      userMessage: "Best UI I've seen this year.",
      createdAt: "2026-04-06T15:00:00Z",
    },
    {
      id: "4",
      title: "Broken Image Link",
      description: "The hero image is 404 on the homepage.",
      type: "ISSUE",
      status: "PENDING",
      location: "Home",
      userMessage: "Hero banner is empty.",
      createdAt: "2026-04-05T09:00:00Z",
    },
    {
      id: "5",
      title: "Dark mode toggle",
      description: "Add a dark mode switch in settings.",
      type: "IMPROVEMENT",
      status: "SUCCESS",
      location: "Settings",
      userMessage: "Would love a dark theme.",
      adminFeedback: "Shipped in v2.5.0",
      createdAt: "2026-04-04T08:00:00Z",
    },
    {
      id: "6",
      title: "Error on form submit",
      description: "Console shows 500 when submitting profile form.",
      type: "ISSUE",
      status: "PENDING",
      location: "Profile",
      userMessage: "I can't update my profile.",
      createdAt: "2026-04-03T14:00:00Z",
    },
  ];

  let filtered = allIssues;

  if (params.type && params.type !== "ALL") {
    filtered = filtered.filter((i) => i.type === params.type);
  }
  if (params.status && params.status !== "ALL") {
    filtered = filtered.filter((i) => i.status === params.status);
  }
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(searchLower) ||
        i.description.toLowerCase().includes(searchLower) ||
        i.location.toLowerCase().includes(searchLower)
    );
  }

  const pageSize = 8;
  const start = (params.page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return { data: paginated, totalPages };
};

export default function IndustryIssueTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // URL State Management
  const currentType = searchParams.get("type") || "ALL";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (key !== "page") params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    updateFilters("q", "");
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["issues", currentType, currentStatus, currentPage, currentSearch],
    queryFn: () =>
      fetchIssues({
        type: currentType,
        status: currentStatus,
        page: currentPage,
        search: currentSearch,
      }),
  });

  const openDetailsModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setDetailsModalOpen(true);
  };

  if (isLoading && !data) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header Area */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutGrid className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Issue Intelligence
              </h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Engineering Ops
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IssueCreateModal onSuccess={() => queryClient.invalidateQueries({ queryKey: ["issues"] })} />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Filter Toolbar */}
        <section className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search issues..."
                className="pl-9 pr-8 bg-slate-50 dark:bg-slate-800 border-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </form>

            <div className="h-8 w-px bg-border hidden lg:block" />

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                Category
              </span>
              <Select value={currentType} onValueChange={(v) => updateFilters("type", v)}>
                <SelectTrigger className="w-[160px] bg-slate-50 dark:bg-slate-800 border-none">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="ISSUE">Issues</SelectItem>
                  <SelectItem value="IMPROVEMENT">Improvements</SelectItem>
                  <SelectItem value="FEEDBACK">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                Status
              </span>
              <Select value={currentStatus} onValueChange={(v) => updateFilters("status", v)}>
                <SelectTrigger className="w-[160px] bg-slate-50 dark:bg-slate-800 border-none">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SUCCESS">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{data?.totalPages || 0}</span> pages
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => updateFilters("page", (currentPage - 1).toString())}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-16 text-center">
                {currentPage} / {data?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= (data?.totalPages || 1)}
                onClick={() => updateFilters("page", (currentPage + 1).toString())}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Grid View with Loading State */}
        {isFetching && !isLoading ? (
          <div className="relative">
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <IssueGrid issues={data?.data || []} onViewDetails={openDetailsModal} />
          </div>
        ) : (
          <IssueGrid issues={data?.data || []} onViewDetails={openDetailsModal} />
        )}

        {data?.data.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No issues found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      </main>

      {/* Details Modal */}
      <IssueDetailsModal
        issue={selectedIssue}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
}

// --- Grid Component ---
function IssueGrid({ issues, onViewDetails }: { issues: Issue[]; onViewDetails: (issue: Issue) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} onViewDetails={() => onViewDetails(issue)} />
      ))}
    </div>
  );
}

// --- Enhanced Card with Premium Interactions ---
function IssueCard({ issue, onViewDetails }: { issue: Issue; onViewDetails: () => void }) {
  const typeConfig = {
    ISSUE: { color: "from-red-500 to-rose-500", label: "Issue", icon: AlertCircle, bgLight: "bg-red-50 dark:bg-red-950/20" },
    IMPROVEMENT: { color: "from-blue-500 to-indigo-500", label: "Request", icon: Zap, bgLight: "bg-blue-50 dark:bg-blue-950/20" },
    FEEDBACK: { color: "from-emerald-500 to-teal-500", label: "Feedback", icon: MessageSquare, bgLight: "bg-emerald-50 dark:bg-emerald-950/20" },
  };

  const statusConfig = {
    PENDING: { variant: "secondary" as const, label: "Under Review", icon: Clock },
    SUCCESS: { variant: "default" as const, label: "Resolved", icon: CheckCircle2 },
  };

  const Config = typeConfig[issue.type];
  const StatusIcon = statusConfig[issue.status].icon;

  return (
    <Card
      className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-full hover:-translate-y-1 cursor-pointer"
      onClick={onViewDetails}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${Config.color}`} />
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <Badge variant={statusConfig[issue.status].variant} className="rounded-md text-[10px] gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusConfig[issue.status].label}
          </Badge>
          <Config.icon className="w-4 h-4 text-muted-foreground/50" />
        </div>
        <CardTitle className="text-lg font-bold leading-snug line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
          {issue.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {issue.description}
        </p>
        <div className={`flex items-center gap-2 text-[11px] font-semibold text-muted-foreground/70 p-2 rounded-lg ${Config.bgLight}`}>
          <MapPin className="w-3 h-3" />
          {issue.location}
        </div>
        {issue.imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden h-24 bg-slate-100 dark:bg-slate-800">
            <img src={issue.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-800/20 p-4">
        <Button
          variant="ghost"
          className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all duration-300"
        >
          <span className="text-xs font-bold uppercase tracking-wider">View Details</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Premium Details Modal ---
function IssueDetailsModal({
  issue,
  open,
  onOpenChange,
}: {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!issue) return null;

  const typeConfig = {
    ISSUE: { color: "bg-red-500", label: "Issue", icon: AlertCircle },
    IMPROVEMENT: { color: "bg-blue-500", label: "Improvement", icon: Zap },
    FEEDBACK: { color: "bg-emerald-500", label: "Feedback", icon: MessageSquare },
  };

  const Config = typeConfig[issue.type];
  const formattedDate = new Date(issue.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-3xl border-none">
        <div className={`p-8 text-white bg-gradient-to-br ${Config.color}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Config.icon className="h-6 w-6" />
                <DialogTitle className="text-2xl font-bold">{issue.title}</DialogTitle>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <Badge
                  variant={issue.status === "SUCCESS" ? "default" : "secondary"}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  {issue.status === "SUCCESS" ? "Resolved" : "Under Review"}
                </Badge>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-base leading-relaxed">{issue.description}</p>
          </div>

          {/* Location & Metadata */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Location
              </h3>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{issue.location}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Category
              </h3>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-medium">{Config.label}</span>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">User Report</h4>
                  <span className="text-xs text-muted-foreground">Internal Message</span>
                </div>
                <p className="text-sm leading-relaxed italic">"{issue.userMessage}"</p>
              </div>
            </div>
          </div>

          {/* Admin Feedback (if exists) */}
          {issue.adminFeedback && (
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarFallback className="bg-primary text-white">
                    <MessageCircle className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Admin Response</h4>
                    <Badge variant="outline" className="text-[10px]">
                      Official
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed">{issue.adminFeedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Image Attachment */}
          {issue.imageUrl && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Attachment
              </h3>
              <div className="rounded-xl overflow-hidden border">
                <img src={issue.imageUrl} alt="Issue attachment" className="w-full h-auto" />
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Page Skeleton Loader ---
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 h-20 px-6 flex items-center">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </header>
      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Filter skeleton */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border">
          <div className="flex flex-wrap gap-4">
            <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-10 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>
        {/* Card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-[320px] overflow-hidden">
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800" />
              <CardHeader className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

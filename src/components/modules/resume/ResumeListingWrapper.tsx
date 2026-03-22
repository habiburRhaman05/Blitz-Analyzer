"use client";

import {
  ArrowUpDown,
  ChevronDown,
  FileText,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllResumeById } from "@/services/resume.services";
import { useQuery } from "@tanstack/react-query";
import ResumeListItem from "./ResumeListItem";


// Types

interface ResumeItem {
  id: string;
  userId: string;
  name: string;
  isEdit: boolean;
  resumeUrl: string;
  templateId: string;
  resumeData: Record<string, any>;
  createdAt: string;
  resumeHtml: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ResumeItem[];
  meta: { timestamp: string };
}


// Skeleton row

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border/40">
      <div className="col-span-5 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="col-span-2">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="col-span-3 flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}



// Main Component

interface ResumeListingWrapperProps {
  cacheKey: string;
}

export default function ResumeListingWrapper({ cacheKey }: ResumeListingWrapperProps) {
  const router = useRouter();

  // Fetch resumes
const { data, isLoading, isError, error, refetch } = useQuery<ApiResponse>({
  queryKey:[cacheKey],
  queryFn:getAllResumeById
});
  console.log(data);
  

  // Mutation for updating name


  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const resumes = useMemo(() => data?.data || [], [data]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let items = [...resumes];

    // Filter by name or templateId
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.templateId?.toLowerCase().includes(q)
      );
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return sortOrder === "desc"
          ? nameB.localeCompare(nameA)
          : nameA.localeCompare(nameB);
      } else if (sortBy === "status") {
        if (sortOrder === "desc") {
          return a.isEdit === b.isEdit ? 0 : a.isEdit ? -1 : 1;
        } else {
          return a.isEdit === b.isEdit ? 0 : a.isEdit ? 1 : -1;
        }
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
    });

    return items;
  }, [resumes, searchQuery, sortBy, sortOrder]);


  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30 text-xs uppercase font-bold tracking-widest text-muted-foreground">
            <div className="col-span-5">Resume</div>
            <div className="col-span-2">Last Updated</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }




  // Error state
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        {JSON.stringify(error)}
        <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-bold text-lg">Failed to load resumes</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {(error as Error)?.message || "Please try again later."}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Your Resumes</h1>
        <p className="mt-1 text-muted-foreground">
          Create, edit, and manage your professional resumes
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or template..."
            className="pl-10 rounded-xl bg-card border-border/60 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort by: {sortBy === "date" ? "Date" : sortBy === "name" ? "Name" : "Status"}{" "}
                {sortOrder === "desc" ? "↓" : "↑"}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={(v) => setSortBy(v as "name" | "date" | "status")}
              >
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
              >
                {sortOrder === "desc" ? "Ascending" : "Descending"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant="secondary" className="px-4 py-2 rounded-full border-border/50">
            Total: {filteredAndSorted.length}
          </Badge>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30 text-xs uppercase font-bold tracking-widest text-muted-foreground">
          <div className="col-span-5">Resume</div>
          <div className="col-span-4">Last Updated</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* Rows */}
        {filteredAndSorted.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-1">No resumes found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search or filter"
                : "Create your first resume to get started"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/resume/new")}
                className="rounded-full"
              >
                Create Resume
              </Button>
            )}
          </div>
        ) : (
          filteredAndSorted.map((resume) =>{
            return <ResumeListItem 
            key={resume.id}
            resume={resume}
            cacheKey={cacheKey}
            />
          })
        )}


      {/* Footer Stats */}
      {filteredAndSorted.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                  Total Resumes
                </p>
                <p className="text-xl font-bold">{filteredAndSorted.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <span className="text-lg font-bold">
                  {filteredAndSorted.filter((r) => r.isEdit).length}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                  In Progress
                </p>
                <p className="text-xl font-bold">
                  {filteredAndSorted.filter((r) => r.isEdit).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <span className="text-lg font-bold">
                  {filteredAndSorted.filter((r) => !r.isEdit).length}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                  Completed
                </p>
                <p className="text-xl font-bold">
                  {filteredAndSorted.filter((r) => !r.isEdit).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
    </div>

    </div>
  );
}
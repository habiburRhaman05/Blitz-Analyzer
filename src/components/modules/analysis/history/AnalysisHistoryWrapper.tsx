'use client';

import {
  ArrowUpDown,
  ChevronDown,
  FileText,
  Search,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { useApiQuery } from '@/hooks/useApiQuery';
import AnalysisHistoryItems from './HistoryItems';

// ----------------------------------------------------------------------
// Types (based on API response)
// ----------------------------------------------------------------------
interface AnalysisHistoryItem {
  id: string;
  userId: string;
  analysisType: string;
  resumeText: string;
  resumeUrl: string | null;
  jobData: Record<string, any>; // can contain title, etc.
  result: {
    overall_score: number;
    summary: string;
    // ... other fields not needed for list
  };
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: AnalysisHistoryItem[];
  meta: { timestamp: string };
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border/40">
      <div className="col-span-6 md:col-span-5 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="hidden md:block col-span-2">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="hidden md:block col-span-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-1.5 w-16 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="col-span-6 md:col-span-3 flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

export default function AnalysisHistoryWrapper() {
  const { user } = useUser();
  const router = useRouter();
  const cacheKey = `analysis-history-${user?.id}`;

  const { data, isFetching, isError } = useApiQuery<ApiResponse>(
    [cacheKey],
    '/analyzer/get-analysis-history',
    'axios',{
      refetchOnWindowFocus:false,
      staleTime:2*60*1000
    }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract history array
  const history = useMemo(() => data?.data || [], [data]);

  // Filter and sort history
  const filteredAndSorted = useMemo(() => {
    let items = [...history as any];

    // Filter by search query (case-insensitive, check resumeText and job title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        const inResume = item.resumeText?.toLowerCase().includes(q);
        const inJobTitle = item.jobData?.title?.toLowerCase().includes(q);
        return inResume || inJobTitle;
      });
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        // score
        const scoreA = a.result?.overall_score || 0;
        const scoreB = b.result?.overall_score || 0;
        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      }
    });

    return items;
  }, [history, searchQuery, sortBy, sortOrder]);


  // Loading skeleton
  if (isFetching) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 col-span-3" />
            ))}
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
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="font-bold text-lg">Failed to load analysis history</h3>
        <p className="text-sm text-muted-foreground mb-4">Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Analysis History</h1>
        <p className="mt-1 text-muted-foreground">View and manage your resume analysis reports</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by content or job title..."
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
                Sort by: {sortBy === 'date' ? 'Date' : 'Score'} {sortOrder === 'desc' ? '↓' : '↑'}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'score')}>
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="score">ATS Score</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                {sortOrder === 'desc' ? 'Ascending' : 'Descending'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant="secondary" className="px-4 py-2 rounded-full border-border/50">
            Total: {filteredAndSorted.length}
          </Badge>
        </div>
      </div>

      {/* List Container */}
      <div className="rounded-2xl border border-border/60 bg-card/20 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b bg-muted/30 text-xs uppercase font-bold tracking-widest text-muted-foreground">
          <div className="col-span-6 md:col-span-5">Analysis</div>
          <div className="hidden md:block col-span-2">Date</div>
          <div className="hidden md:block col-span-2">ATS Score</div>
          <div className="col-span-6 md:col-span-3 text-right">Actions</div>
        </div>

        {/* Rows */}
        <AnalysisHistoryItems 
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
        searchQuery={searchQuery}
        sortBy={sortBy}
        filteredAndSorted={filteredAndSorted}
        cachekey={cacheKey}
        />
      
      </div>

      {/* Footer Stats */}
      {filteredAndSorted.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Total Analyses</p>
                <p className="text-xl font-bold">{filteredAndSorted.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Average Score</p>
                <p className="text-xl font-bold">
                  {Math.round(
                    filteredAndSorted.reduce((acc, item) => acc + (item.result?.overall_score || 0), 0) /
                      filteredAndSorted.length
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        
        </div>
      )}
    </div>
  );
}
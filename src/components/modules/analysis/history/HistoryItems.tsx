import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AnalysisHistoryItem } from '@/interfaces/analysis';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  Cpu,
  Download,
  FileText,
  MoreVertical,
  Search,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '../AnalysisNotFound';
import { deleteAnalysis } from '@/services/analysis.services';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const AnalysisHistoryItems = ({setSortOrder,setSortBy,sortBy,filteredAndSorted,searchQuery,cachekey}) => {
  const router = useRouter();
  const [isDeleting,setIsDeleting] = useState(false)
    // Toggle sort order or change sort field
  const handleSort = (field: 'date' | 'score') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get a display name for the analysis
  const getDisplayName = (item: AnalysisHistoryItem) => {
    if (item.jobData?.title) {
      return item.jobData.title;
    }
    // Fallback: use first few words of resumeText
    const words = item.resumeText?.split(' ').slice(0, 5).join(' ') || 'Untitled';
    return words.length > 30 ? words.substring(0, 30) + '…' : words;
  };

  // Get analysis type badge color
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ATS_SCAN':
        return { label: 'ATS Scan', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      case 'GENERAL':
        return { label: 'General', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
      default:
        return { label: type, className: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    }
  };

  const queryClient = useQueryClient()

  const handleDelete = async (analysesId:string)=>{

       try {
        setIsDeleting(true);
        const result = await deleteAnalysis(analysesId);
        if(result?.success){
           queryClient.invalidateQueries({queryKey:[cachekey]})
          toast.success(result.message)
          setIsDeleting(false)
        }
       } catch (error) {
        setIsDeleting(false);
       }
  }

  return (
     <div className="divide-y divide-border/40">
          <AnimatePresence initial={false}>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((item, index) => {
                const typeBadge = getTypeBadge(item.analysisType);
                const displayName = getDisplayName(item);
                const score = item.result?.overall_score ?? 0;
                const scoreColor = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-muted/40 transition-colors group"
                  >
                    {/* Name & Type */}
                    <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{displayName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge  className={cn('text-[10px] px-2 py-0 h-5', typeBadge.className)}>
                            {typeBadge.label}
                          </Badge>
                          {score >= 70 && (
                            <span className="flex items-center text-[10px] text-emerald-500 font-bold">
                              <ShieldCheck className="h-3 w-3 mr-1" /> OPTIMIZED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="hidden md:block col-span-2 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="hidden md:block col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            className={cn(
                              'h-full',
                              score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                            )}
                          />
                        </div>
                        <span className={cn('text-xs font-bold', scoreColor)}>{score}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-6 md:col-span-3 flex justify-end items-center gap-1">
                       
                      {item.resumeUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          asChild
                        >
                          <a href={item.resumeUrl} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem className="gap-2" onClick={() => router.push(`/analysis/${item.id}`)}>
                            <Cpu className="h-4 w-4 text-blue-500" /> View Details
                          </DropdownMenuItem>
                          <Button onClick={()=>handleDelete(item.id)} disabled={isDeleting} className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" />  {isDeleting ? "Deleting" : "Delete"}
                          </Button>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-lg">No analyses found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search.' : 'Upload a resume to get started.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  )
}

export default AnalysisHistoryItems
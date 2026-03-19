"use client";

import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  FileText,
  Loader,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useApiQuery } from "@/hooks/useApiQuery";
import { getAllResumeById, updateResumeName, deleteResume } from "@/services/resume.services";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// Skeleton row
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// Name Edit Dialog Component
// ----------------------------------------------------------------------
interface EditNameDialogProps {
  resume: ResumeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, newName: string) => void;
  isUpdating: boolean;
}

function EditNameDialog({ resume, open, onOpenChange, onSave, isUpdating }: EditNameDialogProps) {
  const [name, setName] = useState(resume?.name || "");

  // Update local state when resume changes
  React.useEffect(() => {
    if (resume) {
      setName(resume.name || "");
    }
  }, [resume]);

  const handleSave = () => {
    if (resume && name.trim()) {
      onSave(resume.id, name.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit resume name</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resume name"
            className="rounded-xl"
            autoFocus
            disabled={isUpdating}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="rounded-full"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="rounded-full" 
            disabled={!name.trim() || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
interface ResumeListingWrapperProps {
  cacheKey: string;
}

export default function ResumeListingWrapper({ cacheKey }: ResumeListingWrapperProps) {
  const router = useRouter();

  const queryClient  = useQueryClient()
  // Fetch resumes
const { data, isLoading, isError, error, refetch } = useQuery<ApiResponse>({
  queryKey:[cacheKey],
  queryFn:getAllResumeById
});
  console.log(data);
  

  // Track which item is being deleted/updated
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Mutation for updating name
  const { mutateAsync: updateName, isPending: isUpdating } = useMutation({
    mutationFn: ({ resumeId, name }: { resumeId: string; name: string }) => 
      updateResumeName({resumeId:resumeId,body:{name:name}}),
    onSuccess: (data) => {

       refetch()
      toast.success(data.message);
      setUpdatingId(null);
    
      
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update name");
      setUpdatingId(null);
    },
  });

  // Mutation for deleting
  const { mutateAsync: deleteResumeHandler, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: (data) => {
       refetch()
      toast.success(data.message);
      setDeletingId(null);
   

    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete resume");
      setDeletingId(null);
    },
  });

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingResume, setEditingResume] = useState<ResumeItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  // Handlers
  const handleEditFull = (templateId: string,resumeId:string) => {
    router.push(`/dashboard/templates/${templateId}/builder/${resumeId}`);
  };

  const handlePreview = (id: string) => {
    router.push(`/resume/preview/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
   const result =  await deleteResumeHandler(id);

   if(result.successs){
    queryClient.invalidateQueries({ queryKey: [cacheKey] });
      
      // Also refetch to ensure fresh data
     
      
      toast.success(result.message);
      setDeletingId(null);
   }
  };

  const handleOpenNameEdit = (resume: ResumeItem) => {
    setEditingResume(resume);
    setIsEditDialogOpen(true);
  };

  const handleSaveName = async (id: string, newName: string) => {
    setUpdatingId(id);
   const result =  await updateName({ resumeId: id, name: newName });
   
    if(result.successs){
 queryClient.invalidateQueries({ queryKey: [cacheKey] });
      
      toast.success(result.message);
      setDeletingId(null);
       setIsEditDialogOpen(false);
   }
  };

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
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-2">Status</div>
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
          filteredAndSorted.map((resume) => {
            const isThisItemUpdating = updatingId === resume.id;
            const isThisItemDeleting = deletingId === resume.id;
            const isLoading = isThisItemUpdating || isThisItemDeleting;

            return (
              <div
                key={resume.id}
                className={`grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors ${
                  isLoading ? "opacity-60 pointer-events-none" : "cursor-pointer"
                }`}
                onClick={() => !isLoading && handleEditFull(resume.id,resume.template.id)}
              >
                {/* Name + Template */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground truncate">
                      {resume.name || "Untitled Resume"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Template {resume.templateId.slice(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true })}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge
                    variant={resume.isEdit ? "default" : "secondary"}
                    className={
                      resume.isEdit
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                        : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-3 w-3 mr-1 animate-spin" />
                        {isThisItemUpdating ? "Updating..." : "Deleting..."}
                      </>
                    ) : (
                      resume.isEdit ? "Editing" : "Saved"
                    )}
                  </Badge>
                </div>

                {/* Actions (click handlers stop propagation) */}
                <div
                  className="col-span-3 flex justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => handleEditFull(resume.templateId,resume.id)}
                    title="Edit full resume"
                    disabled={isLoading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => handlePreview(resume.id)}
                    title="Preview resume"
                    disabled={isLoading}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        disabled={isLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem 
                        onClick={() => handleOpenNameEdit(resume)}
                        disabled={isLoading}
                      >
                        {isThisItemUpdating ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit name
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(resume.id)}
                        disabled={isLoading}
                      >
                        {isThisItemDeleting ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        )}
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

      {/* Name Edit Dialog */}
      <EditNameDialog
        resume={editingResume}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveName}
        isUpdating={isUpdating}
      />
    </div>
  );
}
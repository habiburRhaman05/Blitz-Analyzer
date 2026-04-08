"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Image as ImageIcon,
    Loader2,
    Plus,
    Send
} from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function IssueCreateModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await new Promise((r) => setTimeout(r, 1500));
      return data;
    },
    onSuccess: () => {
      setOpen(false);
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate(Object.fromEntries(formData));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
          <Plus className="w-4 h-4" /> New Submission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-3xl border-none">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-8 text-white">
          <DialogTitle className="text-2xl font-bold">Submit a Report</DialogTitle>
          <DialogDescription className="text-primary-foreground/80">
            Provide detailed information for our engineering team.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="type" defaultValue="ISSUE">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISSUE">Issue / Bug</SelectItem>
                  <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
                  <SelectItem value="FEEDBACK">Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input name="location" placeholder="e.g. Navigation Bar" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Headline</Label>
            <Input name="title" placeholder="Summary of the report" required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" placeholder="Detailed explanation..." className="min-h-[80px]" required />
          </div>

          <div className="space-y-2">
            <Label>Honest Message (Internal)</Label>
            <Textarea
              name="userMessage"
              placeholder="Tell us exactly what happened..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-2xl bg-slate-50 dark:bg-slate-900 border-dashed">
            <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border shadow-sm">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-grow">
              <p className="text-xs font-bold">Attach Image (Optional)</p>
              <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
            <Button type="button" variant="outline" size="sm">
              Upload
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-grow" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-grow" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
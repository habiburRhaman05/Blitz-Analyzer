"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DynamicSection } from "@/interfaces/builder";
import {
  generateQuickFillData,
  type QuickFillAnswers,
} from "@/lib/quickFillResume";

// Asks a few questions, then fills the builder form with realistic sample data
// shaped to the template's own sections/fields. Deterministic + instant; a
// drop-in place to later call a Groq endpoint that returns the same shape.
export function QuickFillDialog({
  sections,
  onFilled,
  triggerClassName,
}: {
  sections: DynamicSection[];
  onFilled: (data: Record<string, any>) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [profession, setProfession] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<QuickFillAnswers["experienceLevel"]>("mid");
  const [industry, setIndustry] = useState("");
  const [fullName, setFullName] = useState("");

  const handleGenerate = () => {
    setBusy(true);
    try {
      const data = generateQuickFillData(sections, {
        profession: profession.trim() || "Software Engineer",
        experienceLevel,
        industry: industry.trim() || undefined,
        fullName: fullName.trim() || undefined,
      });
      onFilled(data);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        <Sparkles className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline text-xs font-semibold">Quick Fill (AI)</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Quick Fill
            </DialogTitle>
            <DialogDescription>
              Answer a couple of questions and we&apos;ll pre-fill this template
              with realistic sample content and placeholder images so you can see
              it laid out and edit from there.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="qf-profession">Profession / target role</Label>
              <Input
                id="qf-profession"
                placeholder="e.g. Product Designer"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Experience level</Label>
              <Select
                value={experienceLevel}
                onValueChange={(v) =>
                  setExperienceLevel(v as QuickFillAnswers["experienceLevel"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 yrs)</SelectItem>
                  <SelectItem value="mid">Mid (3-6 yrs)</SelectItem>
                  <SelectItem value="senior">Senior (7+ yrs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="qf-industry">Industry (optional)</Label>
                <Input
                  id="qf-industry"
                  placeholder="Fintech"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qf-name">Full name (optional)</Label>
                <Input
                  id="qf-name"
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleGenerate} disabled={busy}>
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

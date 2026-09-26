"use client";

import React, { useState } from "react";
import { Download, Link2, Copy, Check, Loader2, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GeneratedPdf } from "@/lib/generateResumePdf";

export function ResumeExportDialog({
  open,
  onOpenChange,
  pdf,
  filename,
  onShare,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pdf: GeneratedPdf | null;
  filename: string;
  // Uploads the blob and returns a public URL. Only called on explicit click,
  // so nothing is stored in the cloud unless the user asks for a link.
  onShare: (blob: Blob) => Promise<string | null>;
}) {
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset share state whenever a new PDF is shown.
  React.useEffect(() => {
    if (open) {
      setShareUrl(null);
      setCopied(false);
      setSharing(false);
    }
  }, [open, pdf]);

  const handleDownload = () => {
    if (!pdf) return;
    const url = URL.createObjectURL(pdf.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!pdf) return;
    setSharing(true);
    try {
      const url = await onShare(pdf.blob);
      if (url) setShareUrl(url);
      else toast.error("Could not create a shareable link");
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const multiPage = (pdf?.pages ?? 1) > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Your resume is ready
          </DialogTitle>
          <DialogDescription>
            Generated in your browser. Download it, or create a shareable link
            (only then is it stored online).
          </DialogDescription>
        </DialogHeader>

        {multiPage && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              This resume spans <strong>{pdf?.pages} pages</strong>. Recruiters
              usually prefer one page — consider trimming content.
            </span>
          </div>
        )}

        <div className="space-y-3 pt-1">
          <Button onClick={handleDownload} className="w-full" disabled={!pdf}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>

          {shareUrl ? (
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs outline-none truncate"
              />
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full"
              disabled={!pdf || sharing}
            >
              {sharing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              Get shareable link
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

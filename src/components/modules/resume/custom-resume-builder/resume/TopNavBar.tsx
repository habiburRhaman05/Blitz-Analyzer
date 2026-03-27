import { useState } from 'react';
import { 
  Check, Loader2, WifiOff, ChevronDown, 
  Download, MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SaveStatus } from '@/interfaces/custom-resume-builder';
import { downloadCustomResumeHandler } from '@/services/resume.services';
import { toast } from 'sonner'; // Recommendation: Use sonner for status messages

interface TopNavBarProps {
  saveStatus: SaveStatus;
  documentTitle: string;
}

export function TopNavBar({ saveStatus, documentTitle }: TopNavBarProps) {
  // Loading state management
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Resume body content (Ideally, get this from your editor state)
  const body = {
    "htmlContent": document.getElementById('resume-canvas')?.outerHTML || ""
  };

const handleDownload = async () => {
  try {
    setIsExporting(true);
    
    // ১. ব্যাকেন্ড থেকে রেসপন্স আনুন (URL টা নিন)
    const response = await downloadCustomResumeHandler("8954245", body);

    if (response?.success && response?.data?.secure_url) {
      console.log(response.data.secure_url);
      
      // ২. সরাসরি ক্লাউডিনারি URL থেকে ফাইলটা Fetch করুন
      const fileResponse = await fetch(response.data.secure_url);
      
      // ৩. এটাকে অবশ্যই BLOB হিসেবে নিতে হবে
      const blob = await fileResponse.blob();

      // ৪. ব্লব টাইপ ফিক্স করে দিন (যাতে ব্রাউজার কনফিউজ না হয়)
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });

      // ৫. একটি ভার্চুয়াল URL তৈরি করুন
      const downloadUrl = window.URL.createObjectURL(pdfBlob);

      // ৬. ডাউনলোড ট্রিগার করুন
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${documentTitle || 'Resume'}.pdf`;
      document.body.appendChild(link);
      link.click();

      // ৭. ক্লিনআপ (মেমরি বাঁচানোর জন্য)
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setIsSuccess(true);
      toast.success("Download Successful!");
      setTimeout(() => setIsSuccess(false), 3000);
    }
  } catch (error) {
    console.error("Download fail:", error);
    toast.error("Download logic error!");
  } finally {
    setIsExporting(false);
  }
};

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-5 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{documentTitle}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Save Status Indicators */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2 pl-3 border-l border-border">
          {saveStatus === 'saved' && (
            <>
              <Check className="h-3.5 w-3.5" style={{ color: 'hsl(142, 76%, 36%)' }} />
              <span>Saved</span>
            </>
          )}
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Saving…</span>
            </>
          )}
          {saveStatus === 'offline' && (
            <>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="text-destructive">Offline</span>
            </>
          )}
          {saveStatus === 'idle' && <span>Ready</span>}
        </div>
      </div>

      <div className="flex-1" />

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          disabled={isExporting} 
          onClick={handleDownload}
          className={`h-8 text-xs gap-1.5 transition-all ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : isSuccess ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {isExporting ? "Exporting..." : isSuccess ? "Ready!" : "Download PDF"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename Document</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
import { useState } from 'react';
import { 
  Check, Loader2, WifiOff, ChevronDown, 
  Download, MoreHorizontal, AlertCircle, Coins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SaveStatus } from '@/interfaces/custom-resume-builder';
import { downloadCustomResumeHandler } from '@/services/resume.services';
import { toast } from 'sonner';

interface TopNavBarProps {
  saveStatus: SaveStatus;
  documentTitle: string;
}

export function TopNavBar({ saveStatus, documentTitle }: TopNavBarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


const triggerFileDownload = async (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = `${documentTitle || 'Resume'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const canvas = document.getElementById('resume-canvas');
      if (canvas) {
        const inputs = canvas.querySelectorAll('input, textarea');
        inputs.forEach((input: any) => {
          input.setAttribute('value', input.value);
        });
      }

      const body = {
        htmlContent: canvas?.outerHTML || ""
      };

      const response = await downloadCustomResumeHandler("8954245", body);

      if (response?.success && response?.data) {
        // Cloudinary URL theke download
        console.log(response);
        
        await triggerFileDownload(response.data);

        setIsSuccess(true);
        toast.success("Resume exported successfully!");
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      alert()
      console.error("Export failed:", error);
      console.log(error);
      
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-5 shrink-0">
      {/* Left: Document Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 px-2 py-1 rounded-md transition-colors">
          <span className="text-sm font-semibold text-foreground">{documentTitle}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground ml-2 pl-3 border-l border-border uppercase tracking-wider">
          {saveStatus === 'saved' && (
            <><Check className="h-3 w-3 text-emerald-500" /> <span>Saved</span></>
          )}
          {saveStatus === 'saving' && (
            <><Loader2 className="h-3 w-3 animate-spin text-primary" /> <span>Saving...</span></>
          )}
          {saveStatus === 'offline' && (
            <><WifiOff className="h-3 w-3 text-destructive" /> <span className="text-destructive">Offline</span></>
          )}
          {saveStatus === 'idle' && <span>Ready</span>}
        </div>
      </div>

      <div className="flex-1" />

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              disabled={isExporting} 
              className={`h-8 text-xs gap-2 px-4 shadow-sm transition-all duration-300 ${
                isSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isSuccess ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {isExporting ? "Processing..." : isSuccess ? "Done!" : "Download PDF"}
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent className="max-w-[400px]">
            <AlertDialogHeader>
              <div className="mx-auto bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <Coins className="h-6 w-6 text-amber-600" />
              </div>
              <AlertDialogTitle className="text-center">Export Premium Resume</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                This action will consume <span className="font-bold text-foreground">10 Credits</span> from your balance. Are you sure you want to proceed with the high-quality PDF export?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-2">
              <AlertDialogCancel className="mt-0 h-9">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDownload}
                className="bg-primary h-9"
              >
                Confirm & Download
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-transparent hover:border-border transition-all">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-xs py-2 cursor-pointer">Rename Document</DropdownMenuItem>
            <DropdownMenuItem className="text-xs py-2 cursor-pointer">Duplicate Template</DropdownMenuItem>
            <DropdownMenuItem className="text-xs py-2 text-destructive cursor-pointer">Delete Forever</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
import { Check, Loader2, WifiOff, ChevronDown, Sparkles, FileDown, Download, Upload, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SaveStatus } from '@/interfaces/custom-resume-builder';
import { useResumeEditor } from '@/hooks/useResumeEditor';

interface TopNavBarProps {
  saveStatus: SaveStatus;
  documentTitle: string;
}

export function TopNavBar({ saveStatus, documentTitle }: TopNavBarProps) {
    const {handlePdfDownload} = useResumeEditor()
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-5 shrink-0">
      {/* Left: Logo + doc title */}
      <div className="flex items-center gap-3">
      
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{documentTitle}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Save indicator */}
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

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          AI Assist
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <FileDown className="h-3.5 w-3.5" />
              Export
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handlePdfDownload()}>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Export as DOCX</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export as JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Upload & Get URL
        </Button>

        <Button size="sm" className="h-8 text-xs gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

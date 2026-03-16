'use client';

import { useMemo, useState } from "react";
import Handlebars from "handlebars";
import { Maximize2, X, Download, Monitor, ZoomIn, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export const ResumePreview = ({ htmlLayout, resumeData }: { htmlLayout: string; resumeData: any }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const previewHtml = useMemo(() => {
    try {
      if (!htmlLayout) return "";
      const template = Handlebars.compile(htmlLayout);
      return template(resumeData);
    } catch (error) {
      return `<div style="color: red; padding: 20px;">Template Rendering Error</div>`;
    }
  }, [htmlLayout, resumeData]);

  const PreviewFrame = ({ isModal = false }) => (
    <iframe
      title="Resume Preview"
      srcDoc={previewHtml}
      className={`w-full bg-white border-none shadow-sm ${isModal ? 'h-[1120px]' : 'h-full'}`}
      style={{ minHeight: isModal ? '1120px' : 'calc(100vh - 160px)' }}
    />
  );

  return (
    <>
      {/* --- DESKTOP VIEW (Always Visible) --- */}
      <aside className="hidden lg:flex flex-col sticky top-20 self-start w-full h-[calc(100vh-100px)] bg-zinc-100 dark:bg-zinc-900 rounded-xl border overflow-hidden group">
        <div className="bg-white dark:bg-zinc-800 border-b px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Monitor className="h-3 w-3" /> Live Preview (A4)
          </span>
          <button 
            onClick={() => setIsFullScreen(true)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5 text-zinc-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-zinc-200/50 dark:bg-zinc-950 p-4 custom-scrollbar">
          <div className="w-full shadow-2xl origin-top transition-transform duration-300">
            <PreviewFrame />
          </div>
        </div>
      </aside>

      {/* --- MOBILE TOGGLE BUTTON --- */}
      <div className="fixed bottom-24 right-6 lg:hidden z-40">
        <Button 
          onClick={() => setIsFullScreen(true)}
          size="icon" 
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform"
        >
          <Eye className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* --- FULLSCREEN MODAL --- */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center"
          >
            <div className="w-full p-4 flex justify-between items-center bg-zinc-900 border-b border-white/10">
              <div className="text-white">
                <h3 className="font-bold">Full Preview</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">A4 Professional Standard</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
                  <Download className="h-4 w-4 mr-2" /> Export PDF
                </Button>
                <button onClick={() => setIsFullScreen(false)} className="p-2 text-white hover:bg-white/10 rounded-full">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="w-full flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-zinc-800">
              <div className="w-full max-w-4xl bg-white shadow-2xl h-fit">
                <PreviewFrame isModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
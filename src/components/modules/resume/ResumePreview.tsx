"use client";

import React, { useEffect, useRef, useState } from "react";
import Handlebars from "handlebars";
import { Maximize2, Minimize2, X } from "lucide-react";

export const ResumePreview = ({
  template,
  data,
}: {
  template: any;
  data: any;
}) => {
  const [compiledHtml, setCompiledHtml] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!template?.htmlLayout) return;

    try {
      const compile = Handlebars.compile(template.htmlLayout);
      const html = compile(data);
      setCompiledHtml(html);
    } catch (err) {
      console.error("Handlebars compilation error:", err);
      setCompiledHtml("<p class='text-red-500'>Error rendering preview</p>");
    }
  }, [template, data]);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;

    const handleLoad = () => {
      if (iframe.contentDocument?.body) {
        iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [compiledHtml]);

  const PreviewContent = () => (
    <>
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">Live Preview</span>
        <button
          onClick={() => setIsFullscreen(true)}
          className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          title="Enter fullscreen"
        >
          <Maximize2 className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          ref={iframeRef}
          srcDoc={compiledHtml}
          title="Resume Preview"
          className="w-full h-screen bg-white"
          sandbox="allow-scripts"
        />
      </div>
    </>
  );

  return (
    <>
      {/* Normal View */}
      <div className="h-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        <PreviewContent />
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-950 flex flex-col">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Resume Preview (Fullscreen)
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Exit fullscreen"
            >
              <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <iframe
              srcDoc={compiledHtml}
              title="Resume Preview Fullscreen"
              className="w-full min-h-full bg-white"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </>
  );
};
"use client";

import React, { useEffect, useRef, useState } from "react";
import Handlebars from "handlebars";

export const ResumePreview = ({
  template,
  data,
}: {
  template: any;
  data: any;
}) => {
  const [compiledHtml, setCompiledHtml] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
console.log(data);

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

  return (
    <div className="h-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">Live Preview</span>
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
    </div>
  );
};
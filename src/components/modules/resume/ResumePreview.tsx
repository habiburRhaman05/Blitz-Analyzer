"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Handlebars from "handlebars";
import { Maximize2, Minimize2, X } from "lucide-react";

// Isolated Handlebars instance so registering helpers here can't leak into
// any other Handlebars usage. Covers the helpers resume templates commonly
// reference, plus a catch-all so an unknown helper renders empty instead of
// hard-crashing the whole preview to a red error.
const createResumeHbs = () => {
  const hbs = Handlebars.create();

  hbs.registerHelper("formatDate", (value: any, fmt?: any) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const pattern = typeof fmt === "string" ? fmt : "MMM yyyy";
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return pattern
      .replace("yyyy", String(d.getFullYear()))
      .replace("MMM", months[d.getMonth()] ?? "")
      .replace("MM", String(d.getMonth() + 1).padStart(2, "0"))
      .replace("dd", String(d.getDate()).padStart(2, "0"));
  });
  hbs.registerHelper("join", (arr: any, sep?: any) =>
    Array.isArray(arr) ? arr.join(typeof sep === "string" ? sep : ", ") : ""
  );
  hbs.registerHelper("uppercase", (v: any) => String(v ?? "").toUpperCase());
  hbs.registerHelper("lowercase", (v: any) => String(v ?? "").toLowerCase());
  hbs.registerHelper("eq", (a: any, b: any) => a === b);
  hbs.registerHelper("ifEquals", function (this: any, a: any, b: any, opts: any) {
    return a === b ? opts.fn(this) : opts.inverse(this);
  });
  hbs.registerHelper("default", (v: any, fallback: any) => (v == null || v === "" ? fallback : v));

  // Unknown inline `{{foo x}}` and block `{{#foo}}...{{/foo}}` helpers no
  // longer throw - they just render nothing / their block body.
  hbs.registerHelper("helperMissing", () => "");
  hbs.registerHelper("blockHelperMissing", function (this: any, ctx: any, opts: any) {
    return ctx ? opts.fn(this) : opts.inverse(this);
  });

  return hbs;
};

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

  const hbs = useMemo(() => createResumeHbs(), []);

  useEffect(() => {
    if (!template?.htmlLayout) return;

    try {
      const compile = hbs.compile(template.htmlLayout);
      const html = compile(data ?? {});
      setCompiledHtml(html);
    } catch (err: any) {
      // Surface the real reason (e.g. which helper/token failed) so it can
      // actually be diagnosed, instead of a generic "Error rendering preview".
      console.error("Handlebars render error:", err);
      const msg = String(err?.message ?? err ?? "Unknown error")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      setCompiledHtml(
        `<div style="padding:16px;font-family:sans-serif;color:#b91c1c">
           <strong>Error rendering preview</strong>
           <pre style="white-space:pre-wrap;font-size:12px;color:#7f1d1d;margin-top:8px">${msg}</pre>
         </div>`
      );
    }
  }, [template, data, hbs]);

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
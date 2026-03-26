import React, { useState, useEffect, useMemo, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import Handlebars from 'handlebars';
import { Section, ResumeSchema } from '@/interfaces/templateEditor';
import { Button } from '@/components/ui/button';
import { Code2, Palette, Eye, Save, Copy, Check, Info, Layout, Search, ChevronRight, ChevronDown, Monitor, Smartphone, Laptop, Plus, Maximize } from 'lucide-react';

import { cn } from '@/lib/utils';

// Register Handlebars helpers
Handlebars.registerHelper('formatDate', (dateStr: string, format: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    if (format === 'MM/YYYY') {
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    return date.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
});

Handlebars.registerHelper('uppercase', (str: string) => {
  return typeof str === 'string' ? str.toUpperCase() : str;
});

interface TemplateHtmlEditorProps {
  schema: ResumeSchema;
  mockData: any;
  html: string;
  css: string;
  mode: string;
  onChange: (html: string, css: string) => void;
  onSave?: (template: { html: string; css: string }) => void;
  theme?: 'light' | 'dark';
}


const TemplateHtmlEditor: React.FC<TemplateHtmlEditorProps> = ({ schema, mockData, html, css, onChange, onSave, theme = 'light' ,mode="edit"}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [compiledHtml, setCompiledHtml] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
const previewContainerRef = useRef(null);

const toggleFullscreen = () => {
  if (!previewContainerRef.current) return;
  
  if (!document.fullscreenElement) {
    previewContainerRef.current.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add basic completion for Handlebars variables
    monaco.languages.registerCompletionItemProvider('handlebars', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = variables.flatMap(group => 
          group.fields.map(field => ({
            label: field.tag,
            kind: monaco.languages.CompletionItemKind.Variable,
            documentation: `${group.section} - ${field.name}`,
            insertText: field.tag,
            range: range,
          }))
        );

        return { suggestions };
      },
    });
  };

  const insertVariable = (tag: string) => {
    if (editorRef.current && activeTab === 'html') {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const range = new monacoRef.current.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      );
      const id = { major: 1, minor: 1 };
      const text = `{{${tag}}}`;
      const op = { identifier: id, range: range, text: text, forceMoveMarkers: true };
      editor.executeEdits("my-source", [op]);
      editor.focus();
    } else {
      // Fallback to copy if editor not ready or in CSS tab
      navigator.clipboard.writeText(`{{${tag}}}`);
      setCopiedKey(`{{${tag}}}`);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Compile template whenever HTML, CSS, or mockData changes
  useEffect(() => {
    try {
      const template = Handlebars.compile(html);
      const rendered = template(mockData);
      const fullDoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${rendered}
          </body>
        </html>
      `;
      setCompiledHtml(fullDoc);
    } catch (err: any) {
      setCompiledHtml(`
        <div style="padding: 20px; color: #ef4444; font-family: sans-serif; background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px;">
          <h3 style="margin-top: 0;">Template Error</h3>
          <p>${err.message}</p>
        </div>
      `);
    }
  }, [html, css, mockData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const variables = useMemo(() => {
    const vars: { section: string; key: string; fields: { name: string; tag: string }[] }[] = [];
    schema.forEach(section => {
      vars.push({
        section: section.label,
        key: section.key,
        fields: section.fields.map(f => ({
          name: f.label,
          tag: section.type === 'array' ? f.name : `${section.key}.${f.name}`
        }))
      });
    });
    return vars;
  }, [schema]);

  const filteredVariables = variables.filter(v => 
    v.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.fields.some(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-[calc(100vh-120px)] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Sidebar: Variables */}
      <div className="flex w-72 flex-col border-r border-border bg-muted/50">
        <div className="p-4 border-b border-border bg-card">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Layout className="h-4 w-4 text-primary" />
            Available Variables
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground">Click to copy Handlebars tags</p>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search variables..."
              className="w-full rounded-lg border border-border bg-muted py-1.5 pl-8 pr-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-4">
            {filteredVariables.map((group) => (
              <div key={group.key} className="space-y-1">
                <div className="flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {group.section}
                </div>
                <div className="space-y-0.5">
                  {group.fields.map((field) => {
                    const tag = `{{${field.tag}}}`;
                    return (
                      <button
                        key={field.tag}
                        onClick={() => insertVariable(field.tag)}
                        className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-card hover:shadow-sm"
                      >
                        <span className="truncate text-foreground/80 group-hover:text-primary">{field.name}</span>
                        <div className="flex items-center gap-1.5">
                          <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                            {field.tag}
                          </code>
                          {copiedKey === `{{${field.tag}}}` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <div className="h-3 w-3 opacity-0 group-hover:opacity-100 text-muted-foreground/40">
                              <Plus className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border bg-card">
          <div className="rounded-lg bg-primary/10 p-3 text-[11px] text-primary">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Info className="h-3.5 w-3.5" />
              Pro Tip
            </div>
            Use <code className="font-mono text-primary font-bold">{"{{#each sectionKey}}"}</code> for array sections like Experience or Education.
          </div>
        </div>
      </div>

      {/* Main Content: Editor & Preview */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Editor Header */}
        <div className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab('html')}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition-all",
                activeTab === 'html' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition-all",
                activeTab === 'css' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Palette className="h-3.5 w-3.5" />
              CSS
            </button>
          </div>
        </div>

        {/* Editor & Preview Split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div className="w-1/2 border-r border-border bg-card">
            <Editor
              height="100%"
              language={activeTab === 'html' ? 'handlebars' : 'css'}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              value={activeTab === 'html' ? html : css}
              onChange={(val) => {
                if (activeTab === 'html') onChange(val || '', css);
                else onChange(html, val || '');
              }}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </div>

          {/* Preview */}
          <div ref={previewContainerRef} className="flex w-1/2 flex-col bg-muted">
  <div className="flex h-10 items-center justify-between border-b border-border bg-card px-4">
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
      <Eye className="h-3.5 w-3.5" />
      Live Preview
    </div>
    
    <div className="flex items-center gap-1">
      {/* Device Toggle Group */}
      <div className="flex items-center gap-1 rounded-md bg-muted p-0.5">
        <button
          onClick={() => setPreviewMode('desktop')}
          className={cn(
            "rounded p-1 transition-all",
            previewMode === 'desktop' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          title="Desktop View"
        >
          <Monitor className="h-3 w-3" />
        </button>
        <button
          onClick={() => setPreviewMode('tablet')}
          className={cn(
            "rounded p-1 transition-all",
            previewMode === 'tablet' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          title="Tablet View"
        >
          <Laptop className="h-3 w-3" />
        </button>
        <button
          onClick={() => setPreviewMode('mobile')}
          className={cn(
            "rounded p-1 transition-all",
            previewMode === 'mobile' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          title="Mobile View"
        >
          <Smartphone className="h-3 w-3" />
        </button>
      </div>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="ml-1 rounded p-1 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
        title="Full Screen"
      >
        <Maximize className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>

  <div className="flex-1 overflow-hidden p-6 flex justify-center bg-muted">
    <iframe
      title="Template Preview"
      className="h-full w-full border-none shadow-lg bg-white"
      srcDoc={compiledHtml}
    />
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default TemplateHtmlEditor;

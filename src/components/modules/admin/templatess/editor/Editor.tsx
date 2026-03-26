"use client"
import React from 'react';

import { Button } from '@/components/ui/button';
import { Sparkles, Code, Eye, Layout, Save, Download, FileJson, Palette, Code2, Moon, Sun, Settings, Rocket, MonitorOff, Loader2, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateMockData, Section } from '@/interfaces/templateEditor';
import TemplateHtmlEditor, from './TemplateHtmlEditor';
import { TemplateMetadata, TemplateMetadataEditor } from './TemplateMetadataEditor';
import { SchemaEditor } from './SchemaEditor';
import { useTheme } from 'next-themes';
import { useApiMutation } from '@/hooks/useApiMutation';

// Initial data provided by user
const INITIAL_SCHEMA: Section[] = []

export default function Editor() {
  const [schema, setSchema] = React.useState<Section[]>(INITIAL_SCHEMA);
  const [view, setView] = React.useState<'editor' | 'template' | 'settings'>('editor');
  const [mockData, setMockData] = React.useState<any>(generateMockData(INITIAL_SCHEMA));
  const [template, setTemplate] = React.useState<{ html: string; css: string }>({ 
    html: ``, 
    css: `` 
  });
 const {theme,setTheme} = useTheme()
  const [metadata, setMetadata] = React.useState<TemplateMetadata>({
    // name: 'Modern Professional',
    // slug: 'modern-professional',
    // description: 'A clean, modern template for professionals.',
    // previewUrl: 'https://picsum.photos/seed/resume/800/1000',
    // price: 0,
    // isPremium: false
      name: '',
    slug: '',
    descriptions: '',
    previewUrl: '',
    price: 0,
    isPremium: false
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);

  // Check for desktop device
  React.useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);


  const createTemplateMutation = useApiMutation({
    endpoint:"/template/create",
    actionName:"create-template",
    actionType:"SERVER_SIDE",
    method:"POST"
  })

  const createTemplate = async() => {
    // Combine CSS into HTML as requested
    const finalHtmlLayout = `<style>\n${template.css}\n</style>\n${template.html}`;

    const fullTemplateData = {
      name: metadata.name,
      slug: metadata.slug,
      descriptions:
      metadata.descriptions,
      previewUrl: metadata.previewUrl,
      price: metadata.price,
      isPremium: metadata.isPremium,
      htmlLayout: finalHtmlLayout,
      sections: schema,
    };
    const result = await createTemplateMutation.mutateAsync(fullTemplateData);
    console.log(result);

    if(result.success){
      setSchema([]);
      setMockData(null)
      setMetadata({
            name: '',
    slug: '',
    descriptions: '',
    previewUrl: '',
    price: 0,
    isPremium: false
      })
    }
  };


  const handleSchemaChange = (newSchema: Section[]) => {
    setSchema(newSchema);
    setMockData(generateMockData(newSchema));
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schema, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "resume_template_schema.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isDesktop) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <MonitorOff className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-black uppercase tracking-tight text-foreground">Desktop Required</h1>
        <p className="max-w-md text-muted-foreground">
          The Template Builder is a professional tool designed for large screens. 
          Please switch to a desktop or laptop device to continue designing.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-bold uppercase tracking-widest text-muted-foreground">Fetching Template Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
          
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter text-foreground">Create Your Creative Template</h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SaaS Template Builder</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setView('editor')}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'editor' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Layout className="h-3.5 w-3.5" /> Editor
              </button>
              <button
                onClick={() => setView('template')}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'template' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Palette className="h-3.5 w-3.5" /> Design
              </button>
              <button
                onClick={() => setView('settings')}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all",
                  view === 'settings' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Settings className="h-3.5 w-3.5" /> Settings
              </button>
            </div>

            
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] p-6">
        <AnimatePresence mode="wait">
          {view === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl"
            >
             
              <SchemaEditor schema={schema} onSchemaChange={handleSchemaChange} />
            </motion.div>
          ) : view === 'template' ? (
            <motion.div
              key="template"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Visual Engine</h2>
                <p className="text-sm font-medium text-muted-foreground">Design your template using HTML/Handlebars and CSS.</p>
              </div>
              <TemplateHtmlEditor 
                schema={schema} 
                mockData={mockData} 
                html={template.html}
                css={template.css}
                onChange={(html, css) => setTemplate({ html, css })}
                theme={theme}
                onSave={(t) => {
                  setTemplate(t);
                  alert('Template saved successfully!');
                }} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Template Settings</h2>
                <p className="text-sm font-medium text-muted-foreground">Configure metadata and pricing for your SaaS template.</p>
              </div>
              <TemplateMetadataEditor 
                metadata={metadata}
                onChange={setMetadata}
              />
              <div className="mt-10 flex justify-end gap-4 border-t border-border pt-8">
                <Button variant="outline" onClick={() => setView('template')}>Cancel</Button>
                <Button disabled={createTemplateMutation.isPending} onClick={createTemplate} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                 {createTemplateMutation.isPending ? <> <Loader className="h-4 w-4 animate-spin" /> Creating Template</> : <> <Rocket className="h-4 w-4" /> Create Template</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

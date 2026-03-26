import React from 'react';

import { Info, Tag, Link, DollarSign, ShieldCheck, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';


export interface TemplateMetadata {
  name: string;
  slug: string;
  descriptions: any;
  previewUrl: string;
  price: number;
  isPremium: boolean;
}

interface TemplateMetadataEditorProps {
  metadata: TemplateMetadata;
  onChange: (metadata: TemplateMetadata) => void;
}

export const TemplateMetadataEditor: React.FC<TemplateMetadataEditorProps> = ({ metadata, onChange }) => {
  const handleChange = (field: keyof TemplateMetadata, value: any) => {
    onChange({ ...metadata, [field]: value });
  };

  

// Generate a summary for the Textarea
const generatedDescription = (metadata:any) =>{
  return `${metadata.descriptions?.whyBest} Key benefits: ${metadata.descriptions?.benefits.join(', ')}. Ideal for: ${metadata.descriptions?.targetUser.join(', ')}.`
};

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <h3 className="font-bold uppercase tracking-tight">Basic Information</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Template Name</label>
            <Input 
              value={metadata.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Modern Professional"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Slug (Unique URL)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                value={metadata.slug}
                onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="modern-professional"
                className="pl-9 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Access */}
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="font-bold uppercase tracking-tight">Pricing & Access</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Credit Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="number"
                value={metadata.price}
                onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className={cn("h-5 w-5", metadata.isPremium ? "text-amber-500" : "text-muted-foreground")} />
              <div>
                <p className="text-sm font-bold">Premium Template</p>
                <p className="text-[10px] text-muted-foreground">Requires subscription or higher credits.</p>
              </div>
            </div>
            <button 
              onClick={() => handleChange('isPremium', !metadata.isPremium)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none",
                metadata.isPremium ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200",
                metadata.isPremium ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>

        {/* Media & Description */}
        <div className="col-span-full space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="font-bold uppercase tracking-tight">Media & Description</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preview Image URL</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                value={metadata.previewUrl}
                onChange={(e) => handleChange('previewUrl', e.target.value)}
                placeholder="https://example.com/preview.png"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Template Description</label>
            <Textarea 
              value={metadata.descriptions?.whyBest ? generatedDescription(metadata) : metadata.descriptions}
              onChange={(e) => handleChange('descriptions', e.target.value)}
              placeholder="Describe the style and best use cases for this template..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

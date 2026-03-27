import type { Editor } from '@tiptap/react';
import type { ResumeData, StyleSettings } from '@/interfaces/custom-resume-builder';
import { SectionEditor } from './SectionEditor';
import { Mail, Phone, Globe } from 'lucide-react';
import { useResumeEditor } from '@/hooks/useResumeEditor';

interface ResumeCanvasProps {
  data: ResumeData;
  styles: StyleSettings;
  zoom: number;
  selectedSectionId: string | null;
  onEditorFocus: (editor: Editor | null) => void;
  onSelectSection: (id: string | null) => void;
  onUpdateName: (name: string) => void;
  onUpdateTitle: (title: string) => void;
  onUpdateContact: (key: string, value: string) => void;
  onUpdateSectionContent: (id: string, html: string) => void;
  onUpdateSectionTitle: (id: string, title: string) => void;
}

const contactIcons: Record<string, React.ElementType> = {
  email: Mail,
  phone: Phone,
  location: Globe,
};

export function ResumeCanvas({
  data, styles, zoom, selectedSectionId,
  onEditorFocus, onSelectSection, onUpdateName, onUpdateTitle,
  onUpdateContact, onUpdateSectionContent, onUpdateSectionTitle,
}: ResumeCanvasProps) {
  const sections = [...data.sections].sort((a, b) => a.position - b.position);



  return (
    <div className="flex-1 overflow-auto bg-canvas-bg flex justify-center py-8 px-4 " id='resume-canvas'>
      <div
        className="resume-print-area bg-canvas-paper shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] rounded origin-top"
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: `scale(${zoom / 100})`,
          fontFamily: styles.fontFamily,
        }}
      >
        {/* Header */}
        <div className="px-14 pt-12 pb-8">
          <input
            type="text"
            value={data.name}
            onChange={(e) => onUpdateName(e.target.value)}
            className="text-[28px] font-bold bg-transparent border-none outline-none w-full tracking-tight"
            style={{ color: styles.headingColor, fontFamily: styles.fontFamily }}
            aria-label="Your name"
          />
          <input
            type="text"
            value={data.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-[14px] bg-transparent border-none outline-none w-full mt-1"
            style={{ color: styles.color, fontFamily: styles.fontFamily, opacity: 0.6 }}
            aria-label="Your title"
          />
          <div className="flex items-center gap-5 mt-4 flex-wrap">
            {Object.entries(data.contacts).map(([key, value]) => {
              const Icon = contactIcons[key];
              return (
                <div key={key} className="flex items-center gap-1.5">
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: styles.accentColor }} />}
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onUpdateContact(key, e.target.value)}
                    className="bg-transparent border-none outline-none text-[12px]"
                    style={{ fontFamily: styles.fontFamily, color: styles.color, opacity: 0.7 }}
                    aria-label={`Contact ${key}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-6 h-px bg-border" />
        </div>

        {/* Sections */}
        <div className="px-14 pb-12 space-y-5">
          {sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              styles={styles}
              isSelected={selectedSectionId === section.id}
              onSelect={() => onSelectSection(section.id)}
              onEditorFocus={onEditorFocus}
              onUpdateContent={onUpdateSectionContent}
              onUpdateTitle={onUpdateSectionTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

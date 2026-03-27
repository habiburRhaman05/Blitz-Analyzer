import { useState, useCallback, useMemo } from 'react';
import type { Editor } from '@tiptap/react';
import { useResumeEditor } from '@/hooks/useResumeEditor';
import { TopNavBar } from '@/components/modules/resume/custom-resume-builder/resume/TopNavBar';
import { LeftSectionsSidebar } from '@/components/modules/resume/custom-resume-builder/resume/LeftSectionsSidebar';
import { ResumeCanvas } from '@/components/modules/resume/custom-resume-builder/resume/ResumeCanvas';
import { RightStylePanel } from '@/components/modules/resume/custom-resume-builder/resume/RightStylePanel';
import { EditorToolbar } from '@/components/modules/resume/custom-resume-builder/resume/EditorToolbar';
import { EditorSkeleton } from '@/components/modules/resume/custom-resume-builder/resume/EditorSkeleton';
import { MobileBlocker } from '@/components/modules/resume/custom-resume-builder/resume/MobileBlocker';
import { CodeEditorPanel } from './CodeEditorPanel';


const Index = () => {
  const editor = useResumeEditor();
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [codeMode, setCodeMode] = useState(false);
  const [customCss, setCustomCss] = useState('');

  const handleEditorFocus = useCallback((e: Editor | null) => {
    setActiveEditor(e);
  }, []);

  // Inject custom CSS as a <style> tag via a memo'd element
  const customStyleEl = useMemo(() => {
    if (!customCss.trim()) return null;
    return <style dangerouslySetInnerHTML={{ __html: customCss }} />;
  }, [customCss]);

  if (editor.loading || !editor.data) {
    return <EditorSkeleton />;
  }

  return (
    <>
      {/* <MobileBlocker /> */}
      {customStyleEl}
      <div className="hidden lg:flex flex-col h-screen w-full overflow-hidden bg-background">
        <TopNavBar
          saveStatus={editor.saveStatus}
          documentTitle={`${editor.data.name} Resume`}
        />
        <EditorToolbar
          editor={activeEditor}
          zoom={editor.zoom}
          setZoom={editor.setZoom}
          styles={editor.styles}
          setStyles={editor.setStyles}
          codeMode={codeMode}
          onToggleCodeMode={() => setCodeMode((prev) => !prev)}
        />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {!codeMode && (
            <LeftSectionsSidebar
              sections={editor.data.sections}
              selectedSectionId={editor.selectedSectionId}
              onSelect={editor.setSelectedSection}
              onAdd={editor.addSection}
              onRemove={editor.removeSection}
              onReorder={editor.reorderSections}
            />
          )}
          {codeMode && (
            <CodeEditorPanel
              data={editor.data}
              styles={editor.styles}
              customCss={customCss}
              onUpdateSectionContent={editor.updateSectionContent}
              onUpdateName={editor.updateName}
              onUpdateTitle={editor.updateTitle}
              onCustomCssChange={setCustomCss}
            />
          )}
          <ResumeCanvas
            data={editor.data}
            styles={editor.styles}
            zoom={editor.zoom}
            selectedSectionId={editor.selectedSectionId}
            onEditorFocus={handleEditorFocus}
            onSelectSection={editor.setSelectedSection}
            onUpdateName={editor.updateName}
            onUpdateTitle={editor.updateTitle}
            onUpdateContact={editor.updateContact}
            onUpdateSectionContent={editor.updateSectionContent}
            onUpdateSectionTitle={editor.updateSectionTitle}
          />
          <RightStylePanel
            styles={editor.styles}
            setStyles={editor.setStyles}
            resetStyles={editor.resetStyles}
            selectedSectionId={editor.selectedSectionId}
          />
        </div>
      </div>
    </>
  );
};

export default Index;

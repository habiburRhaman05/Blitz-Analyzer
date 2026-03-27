import { useState, useCallback, useEffect, useRef } from 'react';
import type { ResumeData, StyleSettings, SectionType, Section, SaveStatus } from '@/interfaces/custom-resume-builder';
import { fetchResume, saveResume } from '@/lib/mockApi';

const sectionDefaults: Record<SectionType, { title: string; content: string }> = {
  summary: { title: 'Professional Summary', content: '<p>Write your professional summary here...</p>' },
  experience: { title: 'Work Experience', content: '<p><strong>Job Title</strong> — Company</p><ul><li>Accomplishment</li></ul>' },
  education: { title: 'Education', content: '<p><strong>Degree</strong> — Institution</p><p>Year</p>' },
  skills: { title: 'Skills', content: '<p>List your skills here...</p>' },
  projects: { title: 'Projects', content: '<p><strong>Project Name</strong></p><p>Description of your project.</p>' },
  certifications: { title: 'Certifications', content: '<p><strong>Certification Name</strong> — Issuer, Year</p>' },
  languages: { title: 'Languages', content: '<p>English (Native), Spanish (Conversational)</p>' },
  contacts: { title: 'Contacts', content: '<p>Add contact details here...</p>' },
  website: { title: 'Website & Links', content: '<p>https://yourwebsite.com</p>' },
  hobbies: { title: 'Hobbies', content: '<p>Reading, Travel, Photography</p>' },
  organization: { title: 'Organization Experience', content: '<p><strong>Role</strong> — Organization</p>' },
};

const defaultStyles: StyleSettings = {
  fontFamily: 'Geist',
  fontSize: 14,
  lineHeight: 1.5,
  color: '#1B1B1B',
  letterSpacing: -1.5,
  headingColor: '#1B1B1B',
  accentColor: '#3b82f6',
};

export function useResumeEditor() {
  const [data, setData] = useState<ResumeData | null>({
    "id": "resume-habib-001",
    "name": "Habib",
    "title": "Full-Stack Software Engineer & System Architect",
    "contacts": {
        "email": "habib@example.com",
        "phone": "+880-XXXXXXXXXX",
        "location": "Bangladesh",
        "linkedin": "linkedin.com/in/habibur-rahman-235462269",
        "github": "github.com/habiburRhaman05"
    },
    "sections": [
        {
            "id": "sec-summary",
            "type": "summary",
            "title": "Professional Summary",
            "position": 0,
            "content": "<p>Performance-driven <strong>Full-Stack Software Engineer</strong> and <strong>System Architect</strong> with expertise in the <strong>MERN stack, Next.js, and TypeScript</strong>. Specialized in building production-first SaaS applications with a focus on database integrity and scalable architecture. Proven track record in developing AI-integrated workflows and complex industrial calculation tools. Dedicated to clean code practices and modular system design.</p>"
        },
        {
            "id": "sec-experience",
            "type": "experience",
            "title": "Work Experience",
            "position": 1,
            "content": "<p><strong>Lead Full-Stack Developer @ SkillBridge</strong></p><p>JAN 2024 – PRESENT</p><ul><li>Architected a tutor booking ecosystem with role-based access control (RBAC) for students, tutors, and admins.</li><li>Optimized frontend performance using Next.js and React Query, reducing page load times by 40%.</li><li>Implemented secure payment gateways and real-time scheduling features.</li></ul><p><strong>Software Engineer @ PH-HealthCare (SaaS Project)</strong></p><p>JUL 2023 – DEC 2023</p><ul><li>Developed a production-grade hospital management system using PostgreSQL and Prisma for strict data integrity.</li><li>Integrated Zod for robust schema validation, ensuring 100% type safety across the API layer.</li><li>Built complex appointment logic and medical record management modules.</li></ul>"
        },
        {
            "id": "sec-projects",
            "type": "projects",
            "title": "Key Projects",
            "position": 2,
            "content": "<p><strong>Blitz Analyzer (AI Resume Tool)</strong>: Built an ATS-optimization engine using Groq and PDF parsing logic to provide real-time resume scoring.</p><p><strong>Garments Salary Calculator</strong>: Engineered a specialized industrial tool to handle piece-rate production and compliance calculations for large-scale manufacturing.</p>"
        },
        {
            "id": "sec-skills",
            "type": "skills",
            "title": "Skills & Expertise",
            "position": 3,
            "content": "<p><strong>Primary Stack</strong>: MongoDB, Express.js, React, Node.js (MERN), Next.js, TypeScript, GraphQL.</p><p><strong>Backend & Databases</strong>: Golang (Secondary), PostgreSQL, Prisma, RESTful API Design.</p><p><strong>UI/UX & Frontend</strong>: Tailwind CSS, shadcn/ui, Framer Motion, Redux Toolkit.</p><p><strong>Tools & Workflow</strong>: Git, Docker, Zod, React Query, AI Automation.</p>"
        },
        {
            "id": "sec-education",
            "type": "education",
            "title": "Education",
            "position": 4,
            "content": "<p><strong>B.Sc. in Computer Science & Engineering</strong></p><p>Relevant Coursework: System Architecture, Database Management Systems, Advanced Algorithms.</p>"
        }
    ]
});
  const [styles, setStylesState] = useState<StyleSettings>(defaultStyles);
  const [selectedSectionId, setSelectedSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const dataRef = useRef(data);
  const stylesRef = useRef(styles);

  dataRef.current = data;
  stylesRef.current = styles;

  console.log("resume",data);
  

  // Load
  useEffect(() => {
    fetchResume().then(({ data: d, styles: s }) => {
      console.log("styles",s);
      
      setData({
    "id": "resume-habib-001",
    "name": "Habib",
    "title": "Full-Stack Software Engineer & System Architect",
    "contacts": {
        "email": "habib@example.com",
        "phone": "+880-XXXXXXXXXX",
        "location": "Bangladesh",
        "linkedin": "linkedin.com/in/habibur-rahman-235462269",
        "github": "github.com/habiburRhaman05"
    },
    "sections": [
        {
            "id": "sec-summary",
            "type": "summary",
            "title": "Professional Summary",
            "position": 0,
            "content": "<p>Performance-driven <strong>Full-Stack Software Engineer</strong> and <strong>System Architect</strong> with expertise in the <strong>MERN stack, Next.js, and TypeScript</strong>. Specialized in building production-first SaaS applications with a focus on database integrity and scalable architecture. Proven track record in developing AI-integrated workflows and complex industrial calculation tools. Dedicated to clean code practices and modular system design.</p>"
        },
        {
            "id": "sec-experience",
            "type": "experience",
            "title": "Work Experience",
            "position": 1,
            "content": "<p><strong>Lead Full-Stack Developer @ SkillBridge</strong></p><p>JAN 2024 – PRESENT</p><ul><li>Architected a tutor booking ecosystem with role-based access control (RBAC) for students, tutors, and admins.</li><li>Optimized frontend performance using Next.js and React Query, reducing page load times by 40%.</li><li>Implemented secure payment gateways and real-time scheduling features.</li></ul><p><strong>Software Engineer @ PH-HealthCare (SaaS Project)</strong></p><p>JUL 2023 – DEC 2023</p><ul><li>Developed a production-grade hospital management system using PostgreSQL and Prisma for strict data integrity.</li><li>Integrated Zod for robust schema validation, ensuring 100% type safety across the API layer.</li><li>Built complex appointment logic and medical record management modules.</li></ul>"
        },
        {
            "id": "sec-projects",
            "type": "projects",
            "title": "Key Projects",
            "position": 2,
            "content": "<p><strong>Blitz Analyzer (AI Resume Tool)</strong>: Built an ATS-optimization engine using Groq and PDF parsing logic to provide real-time resume scoring.</p><p><strong>Garments Salary Calculator</strong>: Engineered a specialized industrial tool to handle piece-rate production and compliance calculations for large-scale manufacturing.</p>"
        },
        {
            "id": "sec-skills",
            "type": "skills",
            "title": "Skills & Expertise",
            "position": 3,
            "content": "<p><strong>Primary Stack</strong>: MongoDB, Express.js, React, Node.js (MERN), Next.js, TypeScript, GraphQL.</p><p><strong>Backend & Databases</strong>: Golang (Secondary), PostgreSQL, Prisma, RESTful API Design.</p><p><strong>UI/UX & Frontend</strong>: Tailwind CSS, shadcn/ui, Framer Motion, Redux Toolkit.</p><p><strong>Tools & Workflow</strong>: Git, Docker, Zod, React Query, AI Automation.</p>"
        },
        {
            "id": "sec-education",
            "type": "education",
            "title": "Education",
            "position": 4,
            "content": "<p><strong>B.Sc. in Computer Science & Engineering</strong></p><p>Relevant Coursework: System Architecture, Database Management Systems, Advanced Algorithms.</p>"
        }
    ]
});
      setStylesState(s);
      setLoading(false);
      setSaveStatus('saved');
    });
  }, []);

  // Autosave
  const triggerSave = useCallback(() => {
    if (!dataRef.current) return;
    setSaveStatus('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await saveResume(dataRef.current!, stylesRef.current);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('offline');
      }
    }, 1200);
  }, []);

  const updateData = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      return next;
    });
    triggerSave();
  }, [triggerSave]);

  const updateName = useCallback((name: string) => updateData((d) => ({ ...d, name })), [updateData]);
  const updateTitle = useCallback((title: string) => updateData((d) => ({ ...d, title })), [updateData]);
  const updateContact = useCallback((key: string, value: string) => updateData((d) => ({ ...d, contacts: { ...d.contacts, [key]: value } })), [updateData]);

  const updateSectionContent = useCallback((id: string, html: string) => {
    updateData((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, content: html } : s)),
    }));
  }, [updateData]);

  const updateSectionTitle = useCallback((id: string, title: string) => {
    updateData((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, title } : s)),
    }));
  }, [updateData]);

  const addSection = useCallback((type: SectionType) => {
    const def = sectionDefaults[type] || { title: type, content: '<p></p>' };
    updateData((d) => ({
      ...d,
      sections: [...d.sections, { id: `sec-${Date.now()}`, type, title: def.title, position: d.sections.length, content: def.content }],
    }));
  }, [updateData]);

  const removeSection = useCallback((id: string) => {
    updateData((d) => ({
      ...d,
      sections: d.sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, position: i })),
    }));
    setSelectedSection((prev) => (prev === id ? null : prev));
  }, [updateData]);

  const reorderSections = useCallback((ids: string[]) => {
    updateData((d) => ({
      ...d,
      sections: ids.map((id, i) => {
        const sec = d.sections.find((x) => x.id === id)!;
        return { ...sec, position: i };
      }),
    }));
  }, [updateData]);

  const setStyles = useCallback((partial: Partial<StyleSettings>) => {
    setStylesState((prev) => ({ ...prev, ...partial }));
    triggerSave();
  }, [triggerSave]);

  const resetStyles = useCallback(() => {
    setStylesState(defaultStyles);
    triggerSave();
  }, [triggerSave]);


  const handlePdfDownload = ()=>{
    const canvasHtml = document.getElementById("resume-canvas");
    console.log(canvasHtml);
    
  }

  return {
    data,
    styles,
    selectedSectionId,
    saveStatus,
    zoom,
    loading,
    setSelectedSection,
    setSaveStatus,
    setZoom,
    updateName,
    updateTitle,
    updateContact,
    updateSectionContent,
    updateSectionTitle,
    addSection,
    removeSection,
    reorderSections,
    setStyles,
    resetStyles,
    handlePdfDownload
  };
}

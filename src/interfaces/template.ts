// ATS-friendly resume template configuration
// Designed for semantic HTML, single-column layout, and minimal styling dependence.

export interface ResumeTemplate {
  id?: string;                // unique identifier (for database)
  name: string;               // display name of the template
  slug: string;               // URL-friendly name
  isPremium: boolean;
  price?: number;             // if premium
  previewUrl: string;         // image preview
  descriptions?: {
    whyBest?: string;
    benefits?: string[];
    targetUser?: string[];
  };
  sections: Section[];        // ordered list of sections
  htmlLayout: string;         // Handlebars template for final resume
  resumeData?: any;           // optional default data for the form
}

interface Section {
  key: string;                // unique within template (e.g., "experience")
  label: string;              // user-facing label
  type: 'object' | 'array';   // single object or repeatable list
  required?: boolean;          // if array, at least one item required? if object, all required fields inside are enforced separately.
  order: number;               // display order
  fields: Field[];             // fields in this section (or in each item of array)
  condition?: Condition;       // optional condition to show/hide entire section
  ui?: {
    columns?: 1 | 2;           // layout columns for the section's fields
    description?: string;      // helper text for the section
  };
}

// ===========================================
// Field definition (core)
// ===========================================
interface Field {
  name: string;                // field key (used in data)
  label: string;               // display label
  type: FieldType;             // see union type below
  required?: boolean;
  placeholder?: string;
  helpText?: string;           // small hint below the field
  defaultValue?: any;          // initial value
  validation?: Validation;      // custom validation rules
  condition?: Condition;       // show/hide this field based on other values
  ui?: FieldUI;                // UI hints
  // For nested structures (type = 'group' or 'array')
  fields?: Field[];            // sub-fields (for group or array items)
  multiple?: boolean;          // if true and type='group', this field becomes a repeatable group (array of objects)
}

type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'richtext'      // simple formatting (bold, italic, lists)
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect'
  | 'file'           // file upload (e.g., profile picture)
  | 'group'          // nested object (contains its own fields)
  | 'array';         // repeatable group (array of objects) – same as 'group' with multiple=true

// ===========================================
// Validation rules
// ===========================================
interface Validation {
  pattern?: string;             // regex string
  minLength?: number;
  maxLength?: number;
  min?: number;                 // for number fields
  max?: number;
  custom?: string;              // name of custom validator function (app-provided)
  message?: string;             // custom error message (overrides default)
}

// ===========================================
// Conditional logic
// ===========================================
interface Condition {
  field: string;                // path to the field that controls visibility (supports dot notation and array indices, e.g., 'experience[0].company')
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'notContains' | 'empty' | 'notEmpty';
  value?: any;                  // value to compare against (not needed for empty/notEmpty)
}

// ===========================================
// UI hints (for layout and behaviour)
// ===========================================
interface FieldUI {
  grid?: string;                // e.g., "col-span-2", "col-span-1" – Tailwind classes
  rows?: number;                // for textarea
  showCount?: boolean;          // show character count
  accept?: string;              // for file input (e.g., "image/*")
  options?: { label: string; value: any }[]; // for select, radio – if provided as array of objects instead of strings
  multiple?: boolean;            // for select to allow multiple
  // ... any other field-specific props
}

export const atsFriendlyResumeTemplate: ResumeTemplate = {
  id: "ats-resume-001",
  name: "ATS Professional Resume",
  slug: "ats-professional-resume",
  isPremium: false,
  previewUrl: "https://drive.google.com/file/d/1btUFfr8uYqN5EdnYwYSnHq5z1DVJH-y4/view?usp=sharing",
  descriptions: {
    whyBest:
      "Built for ATS readability with a strict single-column structure, standard section names, and plain semantic HTML to maximize parser compatibility.",
    benefits: [
      "Single-column layout with no tables, icons, sidebars, or decorative blocks",
      "ATS-safe headings and clean hierarchy for predictable parsing",
      "Easy to customize for multiple industries and seniority levels",
      "TailwindCSS-only styling for consistent rendering"
    ],
    targetUser: [
      "Frontend developers",
      "Full-stack engineers",
      "Fresh graduates",
      "Experienced professionals"
    ]
  },
  sections: [
    {
      key: "header",
      label: "Header",
      type: "object",
      order: 1,
      fields: [
        { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "Habib Rahman", ui: { grid: "col-span-2" } },
        { name: "jobTitle", label: "Professional Title", type: "text", required: true, placeholder: "Frontend Developer", ui: { grid: "col-span-2" } },
        { name: "email", label: "Email", type: "email", required: true, placeholder: "habib@email.com" },
        { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+880 1XXXXXXXXX" },
        { name: "location", label: "Location", type: "text", required: true, placeholder: "Dhaka, Bangladesh" },
        { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/username" },
        { name: "github", label: "GitHub", type: "url", placeholder: "https://github.com/username" },
        { name: "portfolio", label: "Portfolio", type: "url", placeholder: "https://yourportfolio.com" }
      ],
      ui: {
        columns: 2,
        description: "Keep contact details clean, simple, and machine-readable."
      }
    },
    {
      key: "summary",
      label: "Professional Summary",
      type: "object",
      order: 2,
      fields: [
        {
          name: "summary",
          label: "Summary",
          type: "textarea",
          required: true,
          placeholder: "Results-driven frontend developer with experience building responsive web applications using React, TypeScript, and modern UI systems.",
          validation: {
            minLength: 120,
            maxLength: 700,
            message: "Write a focused summary between 120 and 700 characters."
          },
          ui: {
            grid: "col-span-2",
            rows: 5,
            showCount: true
          }
        }
      ],
      ui: {
        columns: 1,
        description: "Use 2–4 lines. Mention role, years of experience, core skills, and value."
      }
    },
    {
      key: "skills",
      label: "Core Skills",
      type: "array",
      required: true,
      order: 3,
      fields: [
        {
          name: "category",
          label: "Skill Category",
          type: "text",
          required: true,
          placeholder: "Frontend, Tools, Testing"
        },
        {
          name: "items",
          label: "Skills",
          type: "textarea",
          required: true,
          placeholder: "React, TypeScript, Next.js, TailwindCSS, Redux, Jest",
          validation: {
            minLength: 10,
            maxLength: 300
          },
          ui: {
            rows: 2,
            showCount: true
          }
        }
      ],
      ui: {
        columns: 2,
        description: "Group skills by category so ATS can parse keywords cleanly."
      }
    },
    {
      key: "experience",
      label: "Work Experience",
      type: "array",
      required: true,
      order: 4,
      fields: [
        { name: "company", label: "Company", type: "text", required: true, placeholder: "Company Name" },
        { name: "role", label: "Role", type: "text", required: true, placeholder: "Frontend Developer" },
        { name: "location", label: "Location", type: "text", placeholder: "Dhaka, Bangladesh" },
        { name: "startDate", label: "Start Date", type: "date", required: true },
        { name: "endDate", label: "End Date", type: "date", placeholder: "Present" },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Describe responsibilities and measurable impact using bullet points or short lines.",
          validation: {
            minLength: 80,
            maxLength: 1200,
            message: "Add clear achievements and responsibilities."
          },
          ui: {
            rows: 5,
            showCount: true
          }
        }
      ],
      ui: {
        columns: 2,
        description: "Use reverse chronological order and quantify impact whenever possible."
      }
    },
    {
      key: "projects",
      label: "Projects",
      type: "array",
      required: false,
      order: 5,
      fields: [
        { name: "name", label: "Project Name", type: "text", required: true, placeholder: "Resume Builder App" },
        { name: "link", label: "Project Link", type: "url", placeholder: "https://github.com/username/project" },
        { name: "techStack", label: "Tech Stack", type: "text", required: true, placeholder: "React, TypeScript, TailwindCSS, Node.js" },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Explain what the project does, your role, and the outcome.",
          validation: {
            minLength: 60,
            maxLength: 900
          },
          ui: {
            rows: 4,
            showCount: true
          }
        }
      ],
      ui: {
        columns: 2,
        description: "Highlight only relevant projects with clear impact and technologies."
      }
    },
    {
      key: "education",
      label: "Education",
      type: "array",
      required: true,
      order: 6,
      fields: [
        { name: "institution", label: "Institution", type: "text", required: true, placeholder: "University / College Name" },
        { name: "degree", label: "Degree", type: "text", required: true, placeholder: "B.Sc. in Computer Science" },
        { name: "field", label: "Field of Study", type: "text", placeholder: "Computer Science and Engineering" },
        { name: "startYear", label: "Start Year", type: "number", required: true, placeholder: "2020" },
        { name: "endYear", label: "End Year", type: "number", placeholder: "2024" },
        {
          name: "details",
          label: "Details",
          type: "textarea",
          placeholder: "CGPA, honors, coursework, or achievements.",
          ui: {
            rows: 3,
            showCount: true
          }
        }
      ],
      ui: {
        columns: 2,
        description: "Keep this section concise. Include only strong academic information."
      }
    },
    {
      key: "certifications",
      label: "Certifications",
      type: "array",
      required: false,
      order: 7,
      fields: [
        { name: "name", label: "Certification Name", type: "text", required: true, placeholder: "AWS Certified Developer" },
        { name: "issuer", label: "Issuer", type: "text", required: true, placeholder: "Amazon Web Services" },
        { name: "date", label: "Date", type: "date" },
        { name: "link", label: "Credential Link", type: "url", placeholder: "https://credential-url.com" }
      ],
      ui: {
        columns: 2,
        description: "Optional but valuable when directly relevant to the job target."
      }
    }
  ],
  htmlLayout: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{fullName}} - Resume</title>
  <style>
    /* ATS-friendly: minimal styling, no complex visual dependencies */
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #111827;
      background: #ffffff;
    }
    .page {
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.65in;
    }
    .header {
      text-align: center;
      margin-bottom: 16px;
    }
    .name {
      font-size: 24pt;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.2px;
    }
    .title {
      margin: 4px 0 8px;
      font-size: 12.5pt;
      font-weight: 600;
    }
    .contact {
      font-size: 10.5pt;
      word-break: break-word;
    }
    .contact span {
      display: inline-block;
      margin: 0 6px;
    }
    .section {
      margin-top: 16px;
    }
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border-bottom: 1px solid #111827;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .summary,
    .skill-line,
    .edu-item,
    .exp-item,
    .project-item,
    .cert-item {
      margin-bottom: 10px;
    }
    .item-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-weight: 700;
    }
    .item-subhead {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 10.5pt;
      margin-top: 2px;
      margin-bottom: 4px;
    }
    .muted {
      color: #374151;
    }
    .body-text {
      margin: 0;
      white-space: pre-line;
    }
    ul {
      margin: 6px 0 0 18px;
      padding: 0;
    }
    li {
      margin: 3px 0;
    }
    a {
      color: inherit;
      text-decoration: none;
      word-break: break-word;
    }
    .skills-wrap {
      white-space: pre-line;
    }
    @media print {
      body {
        background: #fff;
      }
      .page {
        padding: 0.45in;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <h1 class="name">{{fullName}}</h1>
      <div class="title">{{jobTitle}}</div>
      <div class="contact">
        <span>{{email}}</span> |
        <span>{{phone}}</span> |
        <span>{{location}}</span>
        {{#if linkedin}} | <span>{{linkedin}}</span>{{/if}}
        {{#if github}} | <span>{{github}}</span>{{/if}}
        {{#if portfolio}} | <span>{{portfolio}}</span>{{/if}}
      </div>
    </header>

    {{#if summary}}
    <section class="section">
      <h2 class="section-title">Professional Summary</h2>
      <p class="summary body-text">{{summary}}</p>
    </section>
    {{/if}}

    {{#if skills}}
    <section class="section">
      <h2 class="section-title">Core Skills</h2>
      {{#each skills}}
        <div class="skill-line">
          <strong>{{category}}:</strong>
          <span class="skills-wrap">{{items}}</span>
        </div>
      {{/each}}
    </section>
    {{/if}}

    {{#if experience}}
    <section class="section">
      <h2 class="section-title">Work Experience</h2>
      {{#each experience}}
        <article class="exp-item">
          <div class="item-head">
            <div>{{role}} — {{company}}</div>
            <div>{{startDate}} {{#if endDate}}- {{endDate}}{{else}}- Present{{/if}}</div>
          </div>
          <div class="item-subhead muted">
            <div>{{location}}</div>
          </div>
          <p class="body-text">{{description}}</p>
        </article>
      {{/each}}
    </section>
    {{/if}}

    {{#if projects}}
    <section class="section">
      <h2 class="section-title">Projects</h2>
      {{#each projects}}
        <article class="project-item">
          <div class="item-head">
            <div>{{name}}</div>
            {{#if link}}<div>{{link}}</div>{{/if}}
          </div>
          <div class="item-subhead muted">
            <div>{{techStack}}</div>
          </div>
          <p class="body-text">{{description}}</p>
        </article>
      {{/each}}
    </section>
    {{/if}}

    {{#if education}}
    <section class="section">
      <h2 class="section-title">Education</h2>
      {{#each education}}
        <article class="edu-item">
          <div class="item-head">
            <div>{{degree}} — {{institution}}</div>
            <div>{{startYear}}{{#if endYear}} - {{endYear}}{{/if}}</div>
          </div>
          {{#if field}}<div class="item-subhead muted"><div>{{field}}</div></div>{{/if}}
          {{#if details}}<p class="body-text">{{details}}</p>{{/if}}
        </article>
      {{/each}}
    </section>
    {{/if}}

    {{#if certifications}}
    <section class="section">
      <h2 class="section-title">Certifications</h2>
      {{#each certifications}}
        <article class="cert-item">
          <div class="item-head">
            <div>{{name}}</div>
            <div>{{date}}</div>
          </div>
          <div class="item-subhead muted">
            <div>{{issuer}}</div>
            {{#if link}}<div>{{link}}</div>{{/if}}
          </div>
        </article>
      {{/each}}
    </section>
    {{/if}}
  </main>
</body>
</html>
  `,
};

// {
//     fullName: "Habib Rahman",
//     jobTitle: "Frontend Developer",
//     email: "habib@email.com",
//     phone: "+880 1XXXXXXXXX",
//     location: "Dhaka, Bangladesh",
//     linkedin: "https://linkedin.com/in/habib",
//     github: "https://github.com/habib",
//     portfolio: "https://habib.dev",
//     summary:
//       "Frontend Developer with experience building responsive, accessible, and performance-focused web applications using React, TypeScript, Next.js, and TailwindCSS. Skilled in translating product requirements into clean UI, reusable component systems, and maintainable code with strong attention to UX and ATS-friendly resume presentation.",
//     skills: [
//       { category: "Frontend", items: "React, Next.js, TypeScript, JavaScript, HTML, CSS, TailwindCSS" },
//       { category: "State & Data", items: "Redux Toolkit, Zustand, TanStack Query, REST APIs, GraphQL" },
//       { category: "Testing & Quality", items: "Jest, React Testing Library, Cypress, ESLint, Prettier" },
//       { category: "Tools", items: "Git, GitHub, Vite, Webpack, Figma, Docker" }
//     ],
//     experience: [
//       {
//         company: "ABC Tech Ltd.",
//         role: "Frontend Developer",
//         location: "Dhaka, Bangladesh",
//         startDate: "2023",
//         endDate: "Present",
//         description:
//           "Built and maintained responsive web interfaces for internal and customer-facing applications. Improved component reuse, reduced UI inconsistencies, and collaborated with designers and backend engineers to deliver production-ready features on schedule."
//       }
//     ],
//     projects: [
//       {
//         name: "Resume Builder App",
//         link: "https://github.com/habib/resume-builder",
//         techStack: "React, TypeScript, TailwindCSS, Node.js",
//         description:
//           "Built an ATS-focused resume builder with dynamic sections, validation, and printable HTML export. The system supports clean semantic templates and customizable resume data for professional output."
//       }
//     ],
//     education: [
//       {
//         institution: "Your University Name",
//         degree: "B.Sc. in Computer Science",
//         field: "Computer Science and Engineering",
//         startYear: 2020,
//         endYear: 2024,
//         details: "Relevant coursework: Data Structures, Algorithms, Database Systems, Web Engineering."
//       }
//     ],
//     certifications: [
//       {
//         name: "Frontend Web Development Certificate",
//         issuer: "Example Institute",
//         date: "2024",
//         link: "https://credential.example.com"
//       }
//     ]
//   }
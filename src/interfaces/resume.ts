// --- Personal Information ---
export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

// --- Work Experience ---
export interface Experience {
  id: string; // Required for React key and reordering
  company: string;
  title: string;
  location?: string;
  period: string; // e.g., "Jan 2024 - Present"
  current: boolean;
  bullets: string; // We store as a single string/text-area for the AI to parse
}

// --- Education ---
export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

// --- The Main Data Object ---
export interface ResumeFormData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

// --- API Template Structure ---
export interface ResumeTemplate {
  id: string;
  name: string;
  htmlLayout: string; // The "Handlebars" backtick string
  sections: string[]; // ['personal', 'summary', 'experience', etc.]
  thumbnail?: string;
  category: "Professional" | "Modern" | "Creative";
}
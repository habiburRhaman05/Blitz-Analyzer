import type { DynamicField, DynamicSection } from "@/interfaces/builder";

// Schema-aware "Quick Fill": produces realistic sample data shaped EXACTLY to a
// template's sections/fields so it drops straight into the builder form via
// normalizeResumeData(). Images use free placeholder APIs (pravatar / picsum).
// This is deterministic (no LLM, instant, free); it can later be swapped for a
// Groq-backed endpoint that returns the same shape.

export interface QuickFillAnswers {
  profession: string;
  experienceLevel: "junior" | "mid" | "senior";
  industry?: string;
  fullName?: string;
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

const pick = <T,>(arr: T[], seed: number): T => arr[seed % arr.length]!;

const SAMPLE = {
  companies: ["Nimbus Labs", "Vertex Digital", "BluePeak Systems", "Northwind Co", "Cobalt Studio"],
  cities: ["San Francisco, CA", "Austin, TX", "Remote", "New York, NY", "Berlin, DE"],
  schools: ["Stanford University", "University of Texas", "MIT", "Carnegie Mellon", "UC Berkeley"],
  degrees: ["B.Sc. Computer Science", "B.A. Design", "M.Sc. Engineering", "B.Eng. Software"],
  skills: ["TypeScript", "React", "Node.js", "System Design", "Communication", "Leadership", "SQL", "Testing"],
};

const yearsFor = (level: QuickFillAnswers["experienceLevel"]) =>
  level === "senior" ? 8 : level === "mid" ? 4 : 1;

const optionValue = (field: DynamicField): string => {
  const opts = field.ui?.options ?? field.options ?? [];
  const first = opts[0];
  if (!first) return "";
  return typeof first === "string" ? first : first.value;
};

// Best-effort value for a single scalar field, keyed off its name + type.
const scalarValue = (field: DynamicField, answers: QuickFillAnswers, seed: number): any => {
  const n = field.name.toLowerCase();
  const label = field.label.toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => n.includes(k) || label.includes(k));

  switch (field.type) {
    case "checkbox":
      return false;
    case "number":
      return has("year") ? yearsFor(answers.experienceLevel) : 3;
    case "date":
      return has("end", "to") ? "2024-06" : "2021-03";
    case "select":
    case "radio":
    case "multiselect":
      return field.type === "multiselect" ? [optionValue(field)] : optionValue(field);
    case "file":
      // photo/avatar -> avatar API; anything else image-ish -> picsum
      if (has("avatar", "photo", "headshot", "profile")) return `https://i.pravatar.cc/300?img=${(seed % 70) + 1}`;
      return `https://picsum.photos/seed/${field.name}${seed}/400/300`;
    case "email":
      return "alex.morgan@example.com";
    case "tel":
      return "+1 (555) 014-2837";
    case "url":
      if (has("linkedin")) return "https://linkedin.com/in/alexmorgan";
      if (has("github")) return "https://github.com/alexmorgan";
      if (has("portfolio", "website", "site")) return "https://alexmorgan.dev";
      return "https://example.com";
    case "textarea":
    case "richtext":
      if (has("summary", "about", "objective", "profile")) {
        return `${answers.experienceLevel} ${answers.profession} with ${yearsFor(answers.experienceLevel)}+ years of experience. ${LOREM}`;
      }
      return LOREM;
    default: {
      // text: resolve by common resume field names
      if (has("fullname", "full name") || n === "name") return answers.fullName || "Alex Morgan";
      if (has("firstname")) return "Alex";
      if (has("lastname")) return "Morgan";
      if (has("title", "role", "position", "designation")) return answers.profession;
      if (has("company", "employer", "organization")) return pick(SAMPLE.companies, seed);
      if (has("location", "city", "address")) return pick(SAMPLE.cities, seed);
      if (has("school", "university", "college", "institution")) return pick(SAMPLE.schools, seed);
      if (has("degree", "qualification")) return pick(SAMPLE.degrees, seed);
      if (has("skill")) return pick(SAMPLE.skills, seed);
      if (has("industry")) return answers.industry || "Technology";
      if (has("language")) return pick(["English", "Spanish", "German"], seed);
      return `Sample ${field.label}`;
    }
  }
};

const fillFields = (
  fields: DynamicField[],
  answers: QuickFillAnswers,
  seed: number
): Record<string, any> => {
  const out: Record<string, any> = {};
  fields.forEach((field, i) => {
    const s = seed + i;
    if (field.type === "group") {
      out[field.name] = fillFields(field.fields || [], answers, s);
    } else if (field.type === "array") {
      out[field.name] = [0, 1].map((k) => fillFields(field.fields || [], answers, s + k * 7));
    } else {
      out[field.name] = scalarValue(field, answers, s);
    }
  });
  return out;
};

export const generateQuickFillData = (
  sections: DynamicSection[],
  answers: QuickFillAnswers
): Record<string, any> => {
  const data: Record<string, any> = {};

  sections.forEach((section, i) => {
    if (section.type === "array") {
      // 2 sample entries per repeatable section (experience, education, ...)
      data[section.key] = [0, 1].map((k) => fillFields(section.fields, answers, i * 13 + k * 5));
    } else {
      data[section.key] = fillFields(section.fields, answers, i * 13);
    }
  });

  return data;
};

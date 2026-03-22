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

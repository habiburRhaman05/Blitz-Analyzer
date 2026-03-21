export type FieldOperator =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "contains"
  | "notContains"
  | "empty"
  | "notEmpty";

export interface DynamicCondition {
  field: string;
  operator: FieldOperator;
  value: any;
}

export type DynamicFieldType =
  | "text"
  | "email"
  | "url"
  | "tel"
  | "number"
  | "textarea"
  | "richtext"
  | "date"
  | "checkbox"
  | "radio"
  | "select"
  | "multiselect"
  | "file"
  | "group"
  | "array";

export interface DynamicFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface DynamicFieldUI {
  grid?: string;
  rows?: number;
  showCount?: boolean;
  options?: Array<string | { label: string; value: string }>;
  accept?: string;
  maxLength?: number;
}

export interface DynamicField {
  name: string;
  label: string;
  type: DynamicFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  multiple?: boolean;
  options?: Array<string | { label: string; value: string }>;
  validation?: DynamicFieldValidation;
  ui?: DynamicFieldUI;
  condition?: DynamicCondition;
  fields?: DynamicField[];
}

export interface DynamicSection {
  key: string;
  label: string;
  type: "object" | "array";
  order: number;
  required?: boolean;
  fields: DynamicField[];
  condition?: DynamicCondition;
  ui?: {
    columns?: number;
    description?: string;
  };
}

export interface ResumeTemplate {
  id?: string;
  name: string;
  slug: string;
  isPremium: boolean;
  price?: number;
  htmlLayout?: string;
  sections?: DynamicSection[];
  resumeData?: Record<string, any>;
}
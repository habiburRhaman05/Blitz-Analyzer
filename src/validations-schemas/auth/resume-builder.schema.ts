import * as z from "zod";
import type { DynamicField, DynamicSection } from "../../interfaces/builder";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

export const getByPath = (obj: any, path: string) => {
  if (!path) return obj;
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
};

export const createDefaultValueForField = (field: DynamicField): any => {
  switch (field.type) {
    case "checkbox":
      return false;
    case "number":
      return undefined;
    case "group":
      return createDefaultValueForFields(field.fields || []);
    case "array":
      return [];
    default:
      return "";
  }
};

export const createDefaultValueForFields = (fields: DynamicField[]): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const field of fields) {
    result[field.name] = createDefaultValueForField(field);
  }
  return result;
};

const normalizeFields = (
  fields: DynamicField[],
  source: Record<string, any> | undefined
): Record<string, any> => {
  const output: Record<string, any> = { ...(source || {}) };

  for (const field of fields) {
    const current = output[field.name];

    if (field.type === "group") {
      output[field.name] = normalizeFields(
        field.fields || [],
        current && typeof current === "object" && !Array.isArray(current) ? current : {}
      );
      continue;
    }

    if (field.type === "array") {
      output[field.name] = Array.isArray(current)
        ? current.map((item) =>
            normalizeFields(
              field.fields || [],
              item && typeof item === "object" && !Array.isArray(item) ? item : {}
            )
          )
        : [];
      continue;
    }

    if (current === undefined) {
      output[field.name] = createDefaultValueForField(field);
    }
  }

  return output;
};

export const normalizeResumeData = (
  sections: DynamicSection[],
  resumeData?: Record<string, any>
): Record<string, any> => {
  const output: Record<string, any> = { ...(resumeData || {}) };

  for (const section of sections) {
    const current = output[section.key];

    if (section.type === "array") {
      output[section.key] = Array.isArray(current)
        ? current.map((item) =>
            normalizeFields(
              section.fields,
              item && typeof item === "object" && !Array.isArray(item) ? item : {}
            )
          )
        : [];
    } else {
      output[section.key] = normalizeFields(
        section.fields,
        current && typeof current === "object" && !Array.isArray(current) ? current : {}
      );
    }
  }

  return output;
};

const isValidUrl = (value: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const buildFieldSchema = (field: DynamicField): z.ZodTypeAny => {
  if (field.type === "group") {
    const groupShape: Record<string, z.ZodTypeAny> = {};
    for (const subField of field.fields || []) {
      groupShape[subField.name] = buildFieldSchema(subField);
    }
    const groupSchema = z.object(groupShape).passthrough();
    return field.multiple ? z.array(groupSchema) : groupSchema;
  }

  if (field.type === "array") {
    const itemShape: Record<string, z.ZodTypeAny> = {};
    for (const subField of field.fields || []) {
      itemShape[subField.name] = buildFieldSchema(subField);
    }
    return z.array(z.object(itemShape).passthrough());
  }

  if (field.type === "checkbox") {
    return field.required
      ? z.boolean().refine((val) => val === true, {
          message: field.validation?.message || `${field.label} is required`,
        })
      : z.boolean().default(false);
  }

  if (field.type === "number") {
    let schema: z.ZodTypeAny = z.preprocess((value) => {
      if (value === "" || value === null || value === undefined) return undefined;
      if (typeof value === "string" && value.trim() === "") return undefined;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }, z.number().finite().optional());

    if (field.required) {
      schema = schema.refine((val: number | undefined) => val !== undefined, {
        message: field.validation?.message || `${field.label} is required`,
      });
    }

    if (field.validation?.min !== undefined) {
      schema = schema.refine(
        (val: number | undefined) => val === undefined || val >= field.validation!.min!,
        {
          message:
            field.validation?.message || `Minimum value is ${field.validation.min}`,
        }
      );
    }

    if (field.validation?.max !== undefined) {
      schema = schema.refine(
        (val: number | undefined) => val === undefined || val <= field.validation!.max!,
        {
          message:
            field.validation?.message || `Maximum value is ${field.validation.max}`,
        }
      );
    }

    return schema;
  }

  let schema: z.ZodTypeAny = z.string();

  if (field.required) {
    schema = schema.min(1, {
      message: field.validation?.message || `${field.label} is required`,
    });
  }

  if (field.type === "email") {
    schema = schema.refine((val: string) => !val || z.string().email().safeParse(val).success, {
      message: field.validation?.message || "Invalid email",
    });
  }

  if (field.type === "url") {
    schema = schema.refine((val: string) => !val || isValidUrl(val), {
      message: field.validation?.message || "Invalid URL",
    });
  }

  if (field.validation?.pattern) {
    const pattern = new RegExp(field.validation.pattern);
    schema = schema.refine((val: string) => !val || pattern.test(val), {
      message: field.validation?.message || "Invalid format",
    });
  }

  if (field.validation?.minLength !== undefined) {
    schema = schema.refine(
      (val: string) => !val || val.length >= field.validation!.minLength!,
      {
        message:
          field.validation?.message ||
          `Minimum length is ${field.validation.minLength}`,
      }
    );
  }

  if (field.validation?.maxLength !== undefined) {
    schema = schema.refine(
      (val: string) => !val || val.length <= field.validation!.maxLength!,
      {
        message:
          field.validation?.message ||
          `Maximum length is ${field.validation.maxLength}`,
      }
    );
  }

  return schema;
};

export const generateZodSchema = (sections: DynamicSection[]): z.ZodObject<any> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const section of sections) {
    if (section.type === "array") {
      const itemShape: Record<string, z.ZodTypeAny> = {};
      for (const field of section.fields) {
        itemShape[field.name] = buildFieldSchema(field);
      }

      let sectionSchema: z.ZodTypeAny = z.array(z.object(itemShape).passthrough());

      if (section.required) {
        sectionSchema = sectionSchema.min(1, {
          message: `${section.label} requires at least one entry`,
        });
      }

      shape[section.key] = sectionSchema;
      continue;
    }

    const objectShape: Record<string, z.ZodTypeAny> = {};
    for (const field of section.fields) {
      objectShape[field.name] = buildFieldSchema(field);
    }
    shape[section.key] = z.object(objectShape).passthrough();
  }

  return z.object(shape).passthrough();
};

const collectErrorPaths = (node: any, basePath: string): string[] => {
  if (!node) return [];

  if (Array.isArray(node)) {
    return node.flatMap((child, index) =>
      collectErrorPaths(child, `${basePath}[${index}]`)
    );
  }

  if (typeof node !== "object") return [];

  const hasDirectMessage =
    typeof node.message === "string" && node.message.trim().length > 0;

  const childEntries = Object.entries(node).filter(([key]) =>
    !["message", "type", "ref", "root"].includes(key)
  );

  const childPaths = childEntries.flatMap(([key, value]) =>
    collectErrorPaths(value, basePath ? `${basePath}.${key}` : key)
  );

  if (hasDirectMessage) {
    return [basePath, ...childPaths];
  }

  return childPaths;
};

export const countErrorsForSection = (
  errors: any,
  sectionKey: string
): { count: number; fields: string[] } => {
  const sectionErrors = errors?.[sectionKey];
  if (!sectionErrors) return { count: 0, fields: [] };

  const rawPaths = collectErrorPaths(sectionErrors, sectionKey);

  const sectionPrefix = new RegExp(`^${escapeRegExp(sectionKey)}\\.?`);
  const fields = rawPaths
    .map((path) => path.replace(sectionPrefix, ""))
    .map((path) => path.replace(/^\./, ""))
    .map((path) => path || sectionKey);

  return {
    count: fields.length,
    fields,
  };
};
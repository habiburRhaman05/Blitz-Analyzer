"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import type {
  DynamicCondition,
  DynamicField,
  DynamicSection,
} from "@/interfaces/builder";
import {
  createDefaultValueForFields,
  getByPath,
} from "@/validations-schemas/auth/resume-builder.schema";

const useCondition = (condition: DynamicCondition | undefined, formValues: any) => {
  return useMemo(() => {
    if (!condition) return true;

    const { field, operator, value } = condition;

    const resolveValue = (path: string): any => getByPath(formValues, path);

    const fieldValue = resolveValue(field);

    switch (operator) {
      case "eq":
        return fieldValue === value;
      case "neq":
        return fieldValue !== value;
      case "gt":
        return fieldValue > value;
      case "lt":
        return fieldValue < value;
      case "contains":
        return Array.isArray(fieldValue)
          ? fieldValue.includes(value)
          : String(fieldValue ?? "").includes(String(value));
      case "notContains":
        return !String(fieldValue ?? "").includes(String(value));
      case "empty":
        return (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === "" ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
      case "notEmpty":
        return !(
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === "" ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
      default:
        return true;
    }
  }, [condition, formValues]);
};

const RichTextEditor = ({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[120px] p-3",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={`border rounded-lg overflow-hidden ${className || ""}`}>
      <div className="flex items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-900 border-b">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${
            editor.isActive("bold") ? "bg-zinc-200 dark:bg-zinc-700" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${
            editor.isActive("italic") ? "bg-zinc-200 dark:bg-zinc-700" : ""
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${
            editor.isActive("bulletList") ? "bg-zinc-200 dark:bg-zinc-700" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${
            editor.isActive("orderedList") ? "bg-zinc-200 dark:bg-zinc-700" : ""
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="bg-white dark:bg-zinc-950" />
    </div>
  );
};

const FileUpload = ({
  value,
  onChange,
  accept,
  placeholder,
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  accept?: string;
  placeholder?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onChange(base64);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          {accept?.includes("image") ? (
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-32 rounded-lg object-cover border"
            />
          ) : (
            <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <span className="text-sm">File uploaded</span>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" className="relative" disabled={loading}>
            {loading ? (
              <span className="mr-2 animate-spin">⌛</span>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {placeholder || "Upload file"}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept={accept}
              disabled={loading}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: Array<string | { label: string; value: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const selectedValues = value || [];

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const toggleOption = (optionValue: string) => {
    const newValue = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValue);
  };

  const selectedLabels = normalizedOptions
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start h-11 font-normal">
          {selectedLabels || placeholder || "Select options"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2">
          {normalizedOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => toggleOption(option.value)}
              />
              <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const getGridColsClass = (columns: number) => {
  if (columns <= 1) return "sm:grid-cols-1";
  if (columns === 2) return "sm:grid-cols-2";
  if (columns === 3) return "sm:grid-cols-3";
  return "sm:grid-cols-4";
};

export const FieldRenderer = ({
  field,
  namePrefix,
}: {
  field: DynamicField;
  namePrefix?: string;
}) => {
  const {
    register,
    setValue,
    formState: { errors },
    control,
  } = useFormContext();

  const formValues = useWatch({ control });
  const fieldPath = namePrefix ? `${namePrefix}.${field.name}` : field.name;
  const currentValue = useWatch({ control, name: fieldPath });
  const error = getByPath(errors, fieldPath);
  const ui = field.ui || {};

  if (field.condition) {
    const shouldRender = useCondition(field.condition, formValues);
    if (!shouldRender) return null;
  }

  const handleChange = (value: any) => {
    setValue(fieldPath, value, { shouldValidate: true, shouldDirty: true });
  };

  const showCount =
    ui.showCount && (field.type === "text" || field.type === "textarea" || field.type === "richtext");

  return (
    <div className={`space-y-2 ${ui.grid || "col-span-2"}`}>
      <div className="flex items-center justify-between">
        <Label
          className={`text-sm font-medium ${
            error ? "text-destructive" : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {field.label || field.name}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {showCount && (
          <span className="text-xs text-zinc-400">
            {(currentValue as string)?.length || 0}/{ui.maxLength || "∞"}
          </span>
        )}
      </div>

      {field.type === "text" && (
        <Input
          type="text"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "email" && (
        <Input
          type="email"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "url" && (
        <Input
          type="url"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "tel" && (
        <Input
          type="tel"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "number" && (
        <Input
          type="number"
          {...register(fieldPath, { valueAsNumber: true })}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          {...register(fieldPath)}
          placeholder={field.placeholder}
          rows={ui.rows || 3}
          className={`rounded-lg resize-none border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "richtext" && (
        <RichTextEditor
          value={(currentValue as string) || ""}
          onChange={(val: string) => handleChange(val)}
          className={error ? "border-destructive" : ""}
        />
      )}

      {field.type === "date" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={`w-full justify-start rounded-lg h-11 text-left font-normal ${
                error ? "border-destructive" : ""
              }`}
            >
              {currentValue ? format(new Date(currentValue), "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={currentValue ? new Date(currentValue) : undefined}
              onSelect={(date) => handleChange(date?.toLocaleDateString("en-US",{
                day:"numeric",
                year:"numeric",
                month:"long"
              }))}
            />
          </PopoverContent>
        </Popover>
      )}

      {field.type === "checkbox" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={fieldPath}
            checked={!!currentValue}
            onCheckedChange={(checked) => handleChange(!!checked)}
          />
          <Label htmlFor={fieldPath} className="text-sm font-normal cursor-pointer">
            {field.label}
          </Label>
        </div>
      )}

      {field.type === "radio" && (
        <RadioGroup
          value={currentValue}
          onValueChange={handleChange}
          className="flex flex-col space-y-1"
        >
          {(ui.options || field.options || []).map((opt: any) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <div key={optValue} className="flex items-center space-x-2">
                <RadioGroupItem value={optValue} id={`${fieldPath}-${optValue}`} />
                <Label
                  htmlFor={`${fieldPath}-${optValue}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {optLabel}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}

      {field.type === "select" && (
        <Select onValueChange={handleChange} value={currentValue}>
          <SelectTrigger
            className={`rounded-lg border ${
              error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
            <SelectValue placeholder={field.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {(ui.options || field.options || []).map((opt: any) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              return (
                <SelectItem key={optValue} value={optValue}>
                  {optLabel}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}

      {field.type === "multiselect" && (
        <MultiSelect
          options={ui.options || field.options || []}
          value={Array.isArray(currentValue) ? currentValue : []}
          onChange={handleChange}
          placeholder={field.placeholder}
        />
      )}

      {field.type === "file" && (
        <FileUpload
          value={(currentValue as string) || ""}
          onChange={handleChange}
          accept={ui.accept}
          placeholder={field.placeholder}
        />
      )}

      {field.type === "group" && (
        <div className="space-y-4 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
          {(field.fields || []).map((subField) => (
            <FieldRenderer
              key={subField.name}
              field={subField}
              namePrefix={fieldPath}
            />
          ))}
        </div>
      )}

      {field.type === "array" && (
        <ArrayField field={field} namePrefix={fieldPath} />
      )}

      {error?.message && <p className="text-xs text-destructive">{error.message}</p>}
      {field.helpText && !error?.message && (
        <p className="text-xs text-zinc-400">{field.helpText}</p>
      )}
    </div>
  );
};

const ArrayField = ({
  field,
  namePrefix,
}: {
  field: DynamicField;
  namePrefix: string;
}) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: namePrefix,
  });

  return (
    <div className="space-y-4">
      {fields.map((item, idx) => (
        <div
          key={item.id}
          className="relative p-4 border rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white dark:bg-zinc-800 border shadow-sm text-destructive"
            onClick={() => remove(idx)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(field.fields || []).map((subField) => (
              <FieldRenderer
                key={subField.name}
                field={subField}
                namePrefix={`${namePrefix}.${idx}`}
              />
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
        onClick={() => append(createDefaultValueForFields(field.fields || []))}
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">Add item</span>
      </Button>
    </div>
  );
};

const ArraySectionContent = ({ section }: { section: DynamicSection }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: section.key,
  });

  const columns = section.ui?.columns || 2;
  const gridColsClass = getGridColsClass(columns);

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="relative p-4 sm:p-6 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white dark:bg-zinc-800 border shadow-sm text-destructive"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
            {section.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                namePrefix={`${section.key}.${index}`}
              />
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 py-4 sm:py-6 rounded-2xl flex flex-col gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
        onClick={() => append(createDefaultValueForFields(section.fields))}
      >
        <Plus className="h-5 w-5 text-zinc-400" />
        <span className="text-sm font-bold text-zinc-500">
          Add entry to {section.label}
        </span>
      </Button>
    </div>
  );
};

export const SectionRenderer = ({ section }: { section: DynamicSection }) => {
  const { watch } = useFormContext();
  const formValues = watch();

  if (section.condition) {
    const shouldRender = useCondition(section.condition, formValues);
    if (!shouldRender) return null;
  }

  const columns = section.ui?.columns || 2;
  const gridColsClass = getGridColsClass(columns);

  return (
    <div className="space-y-6">
      {section.ui?.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {section.ui.description}
        </p>
      )}

      {section.type === "array" ? (
        <ArraySectionContent section={section} />
      ) : (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
          {section.fields.map((field) => (
            <FieldRenderer key={field.name} field={field} namePrefix={section.key} />
          ))}
        </div>
      )}
    </div>
  );
};
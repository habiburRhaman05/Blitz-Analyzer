"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormPasswordProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
}

export function FormPassword<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  placeholder
}: FormPasswordProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={show ? "text" : "password"}
                disabled={disabled}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => setShow((p) => !p)}
                disabled={disabled}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
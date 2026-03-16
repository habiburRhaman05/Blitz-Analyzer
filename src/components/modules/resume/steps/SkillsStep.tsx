import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  data: string[];
  onChange: (val: string[]) => void;
}

export const SkillsStep = ({ data, onChange }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = inputValue.trim().replace(/,$/, "");
      if (skill && !data.includes(skill)) {
        onChange([...data, skill]);
        setInputValue("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skills & Technologies</h2>
        <p className="text-zinc-500 text-sm">Add keywords that ATS systems look for. Press Enter to add.</p>
      </div>

      <div className="space-y-4">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React.js, TypeScript, Docker..."
          className="h-12 rounded-xl border-zinc-200 focus-visible:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2 pt-2">
          {data.map((skill) => (
            <Badge 
              key={skill}
              variant="secondary"
              className="pl-3 pr-1 py-1.5 rounded-lg bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none flex items-center gap-1 group transition-all hover:bg-zinc-200"
            >
              {skill}
              <button 
                onClick={() => removeSkill(skill)}
                className="p-0.5 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {data.length === 0 && (
            <p className="text-xs text-zinc-400 italic">No skills added yet...</p>
          )}
        </div>
      </div>
    </div>
  );
};
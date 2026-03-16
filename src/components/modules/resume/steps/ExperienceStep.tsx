import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Experience } from "@/interfaces/resume";

interface Props {
  data: Experience[];
  onChange: (val: Experience[]) => void;
}

export const ExperienceStep = ({ data, onChange }: Props) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: "",
      title: "",
      period: "",
      current: false,
      bullets: ""
    };
    onChange([newExp, ...data]);
  };

  const updateExp = (id: string, field: keyof Experience, value: any) => {
    onChange(data.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const removeExp = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Work Experience</h2>
          <p className="text-zinc-500 text-sm">Your professional timeline.</p>
        </div>
        <Button onClick={addExperience} variant="outline" size="sm" className="rounded-full border-dashed">
          <Plus className="h-4 w-4 mr-2" /> Add Job
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((exp) => (
          <div key={exp.id} className="group relative bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:ring-1 ring-blue-500/30 transition-all">
            <button 
              onClick={() => removeExp(exp.id)}
              className="absolute -top-2 -right-2 h-7 w-7 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Company" 
                value={exp.company} 
                onChange={(e) => updateExp(exp.id, "company", e.target.value)}
                className="font-bold border-none px-0 focus-visible:ring-0 text-lg placeholder:text-zinc-300"
              />
              <Input 
                placeholder="Job Title" 
                value={exp.title} 
                onChange={(e) => updateExp(exp.id, "title", e.target.value)}
                className="border-none px-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300"
              />
            </div>

            <div className="flex gap-4 mt-2">
              <Input 
                placeholder="Duration (e.g. 2021 - Present)" 
                value={exp.period} 
                onChange={(e) => updateExp(exp.id, "period", e.target.value)}
                className="h-8 text-xs w-full max-w-[200px] bg-zinc-50 dark:bg-zinc-800 border-none"
              />
            </div>

            <Textarea 
              placeholder="Describe your achievements..." 
              value={exp.bullets} 
              onChange={(e) => updateExp(exp.id, "bullets", e.target.value)}
              className="mt-4 min-h-[100px] bg-zinc-50/50 dark:bg-zinc-800/50 border-none rounded-xl resize-none text-sm leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
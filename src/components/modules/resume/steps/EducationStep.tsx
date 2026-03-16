import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Education } from "@/interfaces/resume";

interface Props {
  data: Education[];
  onChange: (val: Education[]) => void;
}

export const EducationStep = ({ data, onChange }: Props) => {
  const addEducation = () => {
    const newEdu: Education = { id: crypto.randomUUID(), institution: "", degree: "", year: "", gpa: "" };
    onChange([newEdu, ...data]);
  };

  const updateEdu = (id: string, field: keyof Education, value: string) => {
    onChange(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const removeEdu = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Education</h2>
          <p className="text-zinc-500 text-sm">Where did you study?</p>
        </div>
        <Button onClick={addEducation} variant="outline" size="sm" className="rounded-full border-dashed">
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {data.map((edu) => (
          <div key={edu.id} className="group relative p-6 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm">
            <button 
              onClick={() => removeEdu(edu.id)}
              className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Institution</label>
                <Input value={edu.institution} onChange={(e) => updateEdu(edu.id, "institution", e.target.value)} placeholder="University of Oxford" className="h-10 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Degree</label>
                <Input value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} placeholder="B.Sc. in Computer Science" className="h-10 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Graduation Year</label>
                <Input value={edu.year} onChange={(e) => updateEdu(edu.id, "year", e.target.value)} placeholder="2024" className="h-10 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-400">GPA (Optional)</label>
                <Input value={edu.gpa} onChange={(e) => updateEdu(edu.id, "gpa", e.target.value)} placeholder="3.8/4.0" className="h-10 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const SummaryStep = ({ value, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Professional Summary</h2>
          <p className="text-zinc-500 text-sm">Briefly describe your career goals and key achievements.</p>
        </div>
        <Button size="sm" variant="outline" className="text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-100 rounded-full">
          <Sparkles className="h-3 w-3 mr-2" /> AI Enhance
        </Button>
      </div>

      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Passionate Full-stack Developer with 5+ years of experience in building scalable SaaS applications..."
        className="min-h-[250px] p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 focus-visible:ring-blue-500 text-base leading-relaxed"
      />
    </div>
  );
};
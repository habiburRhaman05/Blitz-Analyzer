import { Input } from "@/components/ui/input";
import { PersonalInfo } from "@/interfaces/resume";

interface Props {
  data: PersonalInfo;
  onChange: (val: PersonalInfo) => void;
}

export const PersonalStep = ({ data, onChange }: Props) => {
  console.log(data);
    const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <p className="text-zinc-500 text-sm">How can recruiters reach you?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Full Name</label>
          <Input 
            value={data.fullName} 
            onChange={(e) => handleChange("fullName", e.target.value)} 
            placeholder="John Doe"
            className="rounded-xl h-11 focus-visible:ring-blue-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Job Title</label>
          <Input 
            value={data.title} 
            onChange={(e) => handleChange("title", e.target.value)} 
            placeholder="Software Engineer"
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Email</label>
          <Input 
            value={data.email} 
            onChange={(e) => handleChange("email", e.target.value)} 
            placeholder="hello@example.com"
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-zinc-400 ml-1">Phone</label>
          <Input 
            value={data.phone} 
            onChange={(e) => handleChange("phone", e.target.value)} 
            placeholder="+1 (555) 000-0000"
            className="rounded-xl h-11"
          />
        </div>
      </div>
    </div>
  );
};
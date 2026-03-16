import { ResumeFormData } from "@/interfaces/resume";

export const validateResume = (data: ResumeFormData) => {
  // Safe Access: data.personal ব্যবহার করুন (যা আপনার নতুন JSON স্ট্রাকচারে আছে)
  const personal = data?.personal || {};

  const errors = {
    personal: !personal.fullName?.trim() || !personal.email?.trim(),
    summary: (data.summary?.length || 0) < 50,
    experience: (data.experience?.length || 0) === 0,
    education: (data.education?.length || 0) === 0,
    skills: (data.skills?.length || 0) === 0,
  };

  // সব এরর false হলে রেজুমে ভ্যালিড
  const isValid = !Object.values(errors).some((hasError) => hasError === true);

  return { errors, isValid };
};

export const OverviewStep = ({ 
  data, 
  onNavigate 
}: { 
  data: ResumeFormData, 
  onNavigate: (id: string) => void 
}) => {
  const { errors } = validateResume(data);

  const sections = [
    { id: 'personal', label: 'Personal Info', error: errors.personal },
    { id: 'summary', label: 'Professional Summary', error: errors.summary },
    { id: 'experience', label: 'Work Experience', error: errors.experience },
    { id: 'skills', label: 'Technical Skills', error: errors.skills },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
          Ready to review?
        </h3>
        <p className="text-xs text-blue-600/80 mt-1">Check the sections below to ensure everything is perfect.</p>
      </div>

      <div className="grid gap-3">
        {sections.map((section) => (
          <div 
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border rounded-xl cursor-pointer hover:border-zinc-400 transition-all"
          >
            <span className="text-sm font-bold">{section.label}</span>
            {section.error ? (
              <span className="text-[10px] font-black text-red-500 uppercase bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Incomplete</span>
            ) : (
              <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Complete</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
// components/marketing/BackgroundWrapper.tsx
export const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative isolate">
      {/* Grid and Glows only for this section */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-40">
         <svg className="h-full w-full">  </svg>
         <div className="absolute top-0 bg-blue-500/10 blur-[120px] ..." />
      </div>
      {children}
    </div>
  )
}
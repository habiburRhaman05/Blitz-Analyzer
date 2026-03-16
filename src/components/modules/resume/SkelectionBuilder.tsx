import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonBuilder() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header Skeleton */}
      <header className="h-14 border-b px-4 flex items-center justify-between bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20 rounded-md ml-4" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_550px]">
        
        {/* Left Side: Form Skeleton */}
        <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-10">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" /> {/* Title */}
            <Skeleton className="h-4 w-48" />  {/* Subtitle */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-2xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}
            <div className="col-span-full space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>

          {/* Navigation Bar Skeleton */}
          <div className="flex justify-between items-center mt-12">
            <Skeleton className="h-11 w-24 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>

        {/* Right Side: Preview Skeleton (Desktop) */}
        <div className="hidden lg:block border-l p-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex flex-col h-[calc(100vh-100px)] rounded-xl border bg-white dark:bg-zinc-800 overflow-hidden">
            <div className="px-4 py-3 border-b flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-3" />
            </div>
            <div className="flex-1 p-8 space-y-6">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="pt-10 space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
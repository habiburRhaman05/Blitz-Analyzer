export const PricingCardSkeleton = () => (
  <div className="flex flex-col rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 animate-pulse">
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-muted" />
        <div className="h-7 w-32 bg-muted rounded-md" />
      </div>
      <div className="h-12 w-28 bg-muted rounded-md mb-4" />
      <div className="h-8 w-36 bg-muted rounded-lg" />
    </div>
    <div className="space-y-4 flex-1">
      <div className="h-5 w-3/4 bg-muted rounded-md" />
      <div className="space-y-3 pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-muted" />
            <div className="h-4 w-full bg-muted rounded-md" />
          </div>
        ))}
      </div>
    </div>
    <div className="h-12 w-full bg-muted rounded-full mt-6" />
  </div>
);
export default function LabLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      {/* Hero skeleton */}
      <div className="text-center mb-12">
        <div className="inline-block h-8 w-32 rounded-full bg-[var(--glass-bg)] mb-6" />
        <div className="h-12 w-80 mx-auto rounded-lg bg-[var(--glass-bg)] mb-4" />
        <div className="h-6 w-96 mx-auto rounded-lg bg-[var(--glass-bg)] mb-2" />
        <div className="h-5 w-64 mx-auto rounded-lg bg-[var(--glass-bg)]" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6"
          >
            <div className="w-14 h-14 rounded-xl bg-[var(--glass-border)] mb-4" />
            <div className="h-6 w-40 rounded bg-[var(--glass-border)] mb-3" />
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full rounded bg-[var(--glass-border)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--glass-border)]" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-[var(--glass-border)]" />
              <div className="h-6 w-20 rounded-full bg-[var(--glass-border)]" />
              <div className="h-6 w-14 rounded-full bg-[var(--glass-border)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

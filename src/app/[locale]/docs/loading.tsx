export default function DocsLoading() {
  return (
    <div className="flex min-h-[80vh] animate-pulse">
      {/* Sidebar skeleton */}
      <div className="hidden md:block w-64 border-r border-[var(--glass-border)] p-4 space-y-3">
        <div className="h-8 w-full rounded-lg bg-[var(--glass-bg)] mb-6" />
        {[75, 60, 85, 70, 90, 65, 80, 72].map((w, i) => (
          <div
            key={i}
            className="h-5 rounded bg-[var(--glass-bg)]"
            style={{ width: `${w}%` }}
          />
        ))}
        <div className="h-px bg-[var(--glass-border)] my-4" />
        {[68, 82, 55, 78, 62].map((w, i) => (
          <div
            key={i}
            className="h-5 rounded bg-[var(--glass-bg)]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div className="h-10 w-3/4 rounded-lg bg-[var(--glass-bg)]" />
        <div className="h-5 w-48 rounded bg-[var(--glass-bg)]" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full rounded bg-[var(--glass-bg)]" />
          <div className="h-4 w-full rounded bg-[var(--glass-bg)]" />
          <div className="h-4 w-5/6 rounded bg-[var(--glass-bg)]" />
          <div className="h-4 w-full rounded bg-[var(--glass-bg)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--glass-bg)]" />
        </div>
        <div className="h-48 w-full rounded-xl bg-[var(--glass-bg)] mt-6" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-[var(--glass-bg)]" />
          <div className="h-4 w-4/5 rounded bg-[var(--glass-bg)]" />
          <div className="h-4 w-full rounded bg-[var(--glass-bg)]" />
        </div>
      </div>
    </div>
  );
}

/** Instant feedback while the next admin page streams in. Matches Card / cream tokens. */
export default function AdminLoading() {
  return (
    <div
      className="animate-pulse space-y-5"
      aria-busy="true"
      aria-live="polite"
      aria-label="Seite wird geladen"
    >
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-sage/20" />
        <div className="h-8 w-56 max-w-full rounded-lg bg-sage/15" />
        <div className="h-4 w-80 max-w-full rounded bg-sage/10" />
      </div>
      <div className="rounded-xl border border-sage/15 bg-white/80 p-5 shadow-sm space-y-3">
        <div className="h-4 w-full rounded bg-sage/10" />
        <div className="h-4 w-[83%] rounded bg-sage/10" />
        <div className="h-4 w-[66%] rounded bg-sage/10" />
        <div className="mt-4 h-24 w-full rounded-lg bg-cream/80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 rounded-xl border border-sage/15 bg-white/80" />
        <div className="h-28 rounded-xl border border-sage/15 bg-white/80" />
        <div className="h-28 rounded-xl border border-sage/15 bg-white/80" />
      </div>
    </div>
  );
}

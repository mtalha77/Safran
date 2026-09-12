export default function StorefrontLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-5 py-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-sage/25 border-t-sage"
          aria-hidden
        />
        <p className="text-sm text-muted">Wird geladen…</p>
      </div>
    </div>
  );
}

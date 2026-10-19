export default function DiagnosticReviewLoading() {
  return (
    <div
      role="status"
      aria-label="Loading diagnostic review"
      className="w-full motion-safe:animate-pulse space-y-6 px-4 py-6 md:px-8"
    >
      <span className="sr-only">Loading diagnostic review…</span>
      <div className="h-4 w-52 rounded bg-[#E9EDF2]" />
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="min-h-[560px] rounded-2xl border border-[#F0F0F0] bg-white p-5">
          <div className="h-5 w-32 rounded bg-[#E9EDF2]" />
          <div className="mt-8 h-28 rounded bg-[#F1F3F6]" />
          <div className="mt-8 h-56 rounded bg-[#F1F3F6]" />
        </div>
        <div className="min-h-[560px] rounded-2xl border border-[#F0F0F0] bg-white p-5">
          <div className="h-10 rounded bg-[#F1F3F6]" />
          <div className="mt-8 space-y-4">
            {Array.from({ length: 7 }, (_, index) => (
              <div key={index} className="h-4 rounded bg-[#F1F3F6]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LabResultLoading() {
  return (
    <div
      role="status"
      aria-label="Loading lab result"
      className="w-full motion-safe:animate-pulse space-y-6 px-4 py-6 md:px-6"
    >
      <span className="sr-only">Loading lab result…</span>
      <div className="h-4 w-44 rounded bg-[#E9EDF2]" />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="min-h-[600px] rounded-2xl border border-[#F0F0F0] bg-white p-8 lg:col-span-8">
          <div className="h-6 w-2/3 rounded bg-[#E9EDF2]" />
          <div className="mt-10 space-y-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="h-4 rounded bg-[#F1F3F6]" />
            ))}
          </div>
        </div>
        <div className="space-y-6 lg:col-span-4">
          <div className="h-12 w-full rounded-xl bg-[#E9EDF2]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl bg-[#F1F3F6]" />
            <div className="aspect-[3/4] rounded-2xl bg-[#F1F3F6]" />
          </div>
        </div>
      </div>
    </div>
  );
}

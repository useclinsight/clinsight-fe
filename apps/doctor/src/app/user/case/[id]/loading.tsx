export default function CaseDetailLoading() {
  return (
    <div
      role="status"
      aria-label="Loading case details"
      className="w-full motion-safe:animate-pulse space-y-6 px-4 py-6 md:px-6"
    >
      <span className="sr-only">Loading case details…</span>
      <div className="h-4 w-44 rounded bg-[#E9EDF2]" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-56 rounded bg-[#E9EDF2]" />
          <div className="h-4 w-64 rounded bg-[#F1F3F6]" />
        </div>
        <div className="h-12 w-52 rounded-xl bg-[#E9EDF2]" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-28 rounded-2xl border border-[#F0F0F0] bg-white p-5">
            <div className="h-4 w-28 rounded bg-[#E9EDF2]" />
            <div className="mt-4 h-5 w-36 rounded bg-[#F1F3F6]" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-[460px] rounded-2xl border border-[#F0F0F0] bg-white lg:col-span-2" />
        <div className="h-[350px] rounded-2xl border border-[#F0F0F0] bg-white" />
      </div>
    </div>
  );
}

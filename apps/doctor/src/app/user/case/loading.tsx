export default function CaseListLoading() {
  return (
    <div
      role="status"
      aria-label="Loading cases"
      className="w-full max-w-7xl animate-pulse px-2.5 pb-10 pt-2.5"
    >
      <span className="sr-only">Loading cases…</span>
      <div className="min-h-[65vh] overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] p-5">
          <div className="h-6 w-24 rounded bg-[#ECEFF3]" />
          <div className="h-11 w-64 rounded bg-[#F4F5F7]" />
        </div>
        <div className="h-12 bg-[#FAFAFA]" />
        <div className="space-y-4 p-5">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="h-12 rounded bg-[#F4F5F7]" />
          ))}
        </div>
      </div>
    </div>
  );
}

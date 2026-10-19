export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading doctor dashboard"
      className="mx-auto flex w-full max-w-7xl animate-pulse flex-col gap-6 px-2.5 pb-10 pt-2.5"
    >
      <span className="sr-only">Loading doctor dashboard…</span>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-[140px] rounded-xl border border-[#F0F0F0] bg-white p-5">
            <div className="h-4 w-28 rounded bg-[#ECEFF3]" />
            <div className="mt-8 h-8 w-24 rounded bg-[#ECEFF3]" />
            <div className="mt-3 h-3 w-32 rounded bg-[#F4F5F7]" />
          </div>
        ))}
      </div>
      <div className="h-[230px] rounded-2xl border border-[#F0F0F0] bg-white p-6">
        <div className="h-5 w-32 rounded bg-[#ECEFF3]" />
        <div className="mt-10 h-16 rounded bg-[#F4F5F7]" />
      </div>
      <div className="h-[330px] rounded-2xl border border-[#F0F0F0] bg-white p-6">
        <div className="h-5 w-36 rounded bg-[#ECEFF3]" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-14 rounded bg-[#F4F5F7]" />
          ))}
        </div>
      </div>
    </div>
  );
}

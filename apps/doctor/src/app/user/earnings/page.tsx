import Image from 'next/image';

const cards = [
  {
    title: 'Total Earnings',
    note: 'No earnings yet',
    icon: 'earnings-total.svg',
    width: 18.1667,
    height: 13.1667,
    chip: 'bg-[#E8EFFF]',
  },
  {
    title: 'Available Balance',
    note: 'Nothing available yet',
    icon: 'earnings-balance.svg',
    width: 20,
    height: 20,
    chip: 'bg-[#E0F7E8]',
  },
  {
    title: 'Pending Earnings',
    note: 'No pending earnings',
    icon: 'earnings-pending.svg',
    width: 16.5,
    height: 18.1667,
    chip: 'bg-[#FFF0D9]',
  },
  {
    title: 'Total Withdrawn',
    note: 'No withdrawals yet',
    icon: 'earnings-withdrawn.svg',
    width: 18.1667,
    height: 15.6667,
    chip: 'bg-[#F1E9FF]',
  },
];

function HistoryEmpty({ kind }: { kind: 'withdrawals' | 'earnings' }) {
  const isEarnings = kind === 'earnings';
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center px-4 py-4 text-center md:min-h-[239px] md:py-8">
      {isEarnings ? (
        <Image src="/assets/doctor-design/earnings-empty.svg" alt="" width={80} height={80} />
      ) : (
        <span
          className="flex size-16 items-center justify-center rounded-full bg-[#EFF4FF] md:size-20"
          aria-hidden="true"
        >
          <span className="relative h-10 w-8 rounded-md bg-[#BDD1FE]">
            <span className="absolute inset-x-1 top-3 h-1 rounded bg-white" />
            <span className="absolute inset-x-1 bottom-2 h-2 rounded bg-[#2563EB]" />
          </span>
        </span>
      )}
      <h3 className="mt-3 text-sm font-semibold text-text-primary md:text-base">
        {isEarnings ? 'No earnings yet' : 'No withdrawals yet'}
      </h3>
      <p className="mt-1 text-xs leading-5 text-[#64748B] md:text-sm">
        {isEarnings
          ? 'Complete your first case review to start earning.'
          : 'Your withdrawals and payments will appear here.'}
      </p>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <div className="flex w-full max-w-[1162px] flex-col gap-5 px-2.5 pb-8 sm:-mt-1 max-sm:mt-[5px] max-sm:px-1.5">
      <h1 className="sr-only">Earnings</h1>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {cards.map((card) => (
          <section
            key={card.title}
            className="flex min-h-[138px] flex-col justify-between rounded-[20px] border border-outline-border bg-white px-4 py-3 md:min-h-[137px] md:px-6 md:py-[18px]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-text-secondary md:text-base">{card.title}</h2>
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${card.chip}`}
              >
                <Image
                  src={`/assets/doctor-design/${card.icon}`}
                  alt=""
                  width={card.width}
                  height={card.height}
                />
              </span>
            </div>
            <div>
              <p className="text-2xl font-semibold leading-tight text-[#0F172A] md:text-[32px]">
                ₦0
              </p>
              <p className="text-xs text-text-disabled">{card.note}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[464fr_656fr] lg:gap-5">
        <section className="flex min-h-[254px] flex-col rounded-2xl border border-[#E8EDF3] bg-white p-4 md:min-h-[300px] md:items-center md:justify-center md:p-6">
          <h2 className="text-sm font-semibold text-text-primary md:sr-only">Bank Account</h2>
          <div className="flex flex-1 flex-col items-center justify-center text-center md:flex-none">
            <span
              className="relative flex size-11 items-center justify-center rounded-[22px] bg-[#EFF4FF]"
              aria-hidden="true"
            >
              <span className="relative h-[18px] w-[26px] rounded bg-[#BDD1FE]">
                <span className="absolute inset-x-0 top-1 h-1 bg-[#2563EB]" />
              </span>
            </span>
            <p className="mt-3 hidden text-[15px] font-semibold text-text-primary md:block">
              Bank Account
            </p>
            <p className="mt-1 text-xs font-semibold text-text-primary md:text-[13px] md:font-normal md:text-[#64748B]">
              <span className="md:hidden">No bank account added</span>
              <span className="hidden md:inline">No account added yet</span>
            </p>
            <p className="mt-4 text-xs text-[#64748B] md:text-[13px]">
              Add a bank account to receive your earnings.
            </p>
            <button
              type="button"
              disabled
              title="Bank account setup is not available yet"
              className="mt-4 inline-flex h-[42px] items-center gap-2 rounded-[10px] bg-[#2563EB] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                +
              </span>
              Add account
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[20px] border border-outline-border bg-white">
          <div className="flex items-center justify-between border-b border-outline-border px-5 py-4">
            <h2 className="text-sm font-medium text-text-primary md:text-base">
              Recent Withdrawals
            </h2>
            <span className="text-sm text-primary-blue">View All</span>
          </div>
          <HistoryEmpty kind="withdrawals" />
        </section>
      </div>

      <section className="overflow-hidden rounded-[20px] border border-outline-border bg-white">
        <div className="flex items-center justify-between border-b border-outline-border px-5 py-4">
          <h2 className="text-sm font-medium text-text-primary md:text-base">Earning History</h2>
          <span className="text-sm text-primary-blue">View All</span>
        </div>
        <HistoryEmpty kind="earnings" />
      </section>
    </div>
  );
}

import { Banknote, Landmark, ReceiptText, Timer, WalletCards } from 'lucide-react';

const cards = [
  {
    title: 'Total Earnings',
    note: 'No earnings yet',
    icon: Banknote,
    color: 'bg-[#E8EFFF] text-[#2965E8]',
  },
  {
    title: 'Available Balance',
    note: 'Nothing available yet',
    icon: Landmark,
    color: 'bg-[#E0F7E8] text-[#1A9B54]',
  },
  {
    title: 'Pending Earnings',
    note: 'No pending earnings',
    icon: Timer,
    color: 'bg-[#FFF0D9] text-[#F2A900]',
  },
  {
    title: 'Total Withdrawn',
    note: 'No withdrawals yet',
    icon: WalletCards,
    color: 'bg-[#F1E9FF] text-[#8354EB]',
  },
];

function EmptyPanel({
  icon: Icon,
  title,
  note,
}: {
  icon: typeof Banknote;
  title: string;
  note: string;
}) {
  return (
    <div className="flex min-h-[170px] flex-col items-center justify-center px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-[#ECF2FF] text-[#2866E6]">
        <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-sm font-medium text-[#1B1B1B]">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-[#62779A]">{note}</p>
    </div>
  );
}

export default function EarningsPage() {
  return (
    <main className="w-full max-w-7xl space-y-4 px-2.5 pb-10 pt-2.5">
      <h1 className="sr-only sm:hidden">Earnings</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, note, icon: Icon, color }) => (
          <section
            key={title}
            className="min-h-[100px] rounded-2xl border border-[#F0F0F0] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm text-[#1B1B1B]">{title}</h2>
              <span className={`flex size-7 items-center justify-center rounded-lg ${color}`}>
                <Icon size={16} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-[#16213B]">₦0</p>
            <p className="text-xs text-[#767676]">{note}</p>
          </section>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.71fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#F0F0F0] bg-white">
          <EmptyPanel
            icon={Landmark}
            title="Bank Account"
            note="Account details will appear here when payment setup is available."
          />
        </section>
        <section className="rounded-2xl border border-[#F0F0F0] bg-white">
          <h2 className="border-b border-[#F0F0F0] p-4 text-sm font-medium text-[#1B1B1B]">
            Recent Withdrawals
          </h2>
          <EmptyPanel
            icon={ReceiptText}
            title="No withdrawals yet"
            note="Your withdrawals and payments will appear here."
          />
        </section>
      </div>
      <section className="min-h-[260px] rounded-2xl border border-[#F0F0F0] bg-white">
        <h2 className="border-b border-[#F0F0F0] p-4 text-sm font-medium text-[#1B1B1B]">
          Earning History
        </h2>
        <EmptyPanel
          icon={WalletCards}
          title="No earnings yet"
          note="Complete your first case review to start earning."
        />
      </section>
    </main>
  );
}

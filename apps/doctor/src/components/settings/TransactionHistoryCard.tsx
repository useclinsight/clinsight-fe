import { cn } from '@/lib/utils';
import { Banknote, Landmark } from 'lucide-react';

type Status = 'Completed' | 'Pending' | 'Failed';

interface Transaction {
  date: string;
  type: 'Earning' | 'Withdrawal';
  description: string;
  amount: string;
  status: Status;
}

const transactions: Transaction[] = [
  {
    date: 'Oct 24, 2023',
    type: 'Earning',
    description: 'Patient Consultation - Case #A9281',
    amount: '+₦240.00',
    status: 'Completed',
  },
  {
    date: 'Oct 23, 2023',
    type: 'Withdrawal',
    description: 'Transfer to Bank Account (•••• 8842)',
    amount: '-₦5,000.00',
    status: 'Pending',
  },
  {
    date: 'Oct 22, 2023',
    type: 'Earning',
    description: 'Diagnostic Report Review - Case #B1123',
    amount: '+₦85.00',
    status: 'Completed',
  },
  {
    date: 'Oct 20, 2023',
    type: 'Withdrawal',
    description: 'Transfer to Bank Account (•••• 8842)',
    amount: '-₦1,200.00',
    status: 'Failed',
  },
];

const statusStyles: Record<Status, string> = {
  Completed: 'bg-[#ecfdf5] border-[#d1fae5] text-[#047857]',
  Pending: 'bg-[#fffbeb] border-[#fef3c7] text-[#b45309]',
  Failed: 'bg-[#fef2f2] border-[#fee2e2] text-[#b91c1c]',
};

const thClass =
  'text-left font-semibold uppercase text-[#505f76] text-[10.392px] tracking-[0.5196px] leading-[14.548px] px-[20.783px] py-[13.856px]';
const tdClass = 'px-[20.783px] py-[14.289px] text-[12.124px] leading-[18.185px] align-middle';

export default function TransactionHistoryCard() {
  return (
    <div className="rounded-[10.392px] bg-white border-[0.866px] border-primary-subtle payment_overview_card_shadow overflow-hidden">
      <header className="flex items-center justify-between py-[13.86px] px-[20.783px] border-b-[0.866px] border-primary-subtle bg-[#f8fafc]">
        <h2 className="text-[17.319px] font-semibold leading-[24.247px] text-[#111c2d]">
          Transaction History
        </h2>

        <div className="flex items-center gap-[3.464px] bg-[rgba(226,232,240,0.5)] rounded-[6.928px] p-[3.464px]">
          <button className="bg-white shadow-[0px_0.866px_0.866px_rgba(0,0,0,0.05)] text-[#003884] text-[10.392px] font-semibold leading-[14.548px] rounded-[5.196px] px-[20.783px] py-[5.196px]">
            All
          </button>
          <button className="text-[#475569] text-[10.392px] font-medium leading-[14.548px] rounded-[5.196px] px-[20.783px] py-[5.196px]">
            Earnings
          </button>
          <button className="text-[#475569] text-[10.392px] font-medium leading-[14.548px] rounded-[5.196px] px-[20.783px] py-[5.196px]">
            Withdrawals
          </button>
        </div>
      </header>

      <table className="w-full border-collapse">
        <thead className="bg-[#f8fafc]/30">
          <tr className="border-b-[0.866px] border-[#f1f5f9]">
            <th className={thClass}>Date</th>
            <th className={thClass}>Type</th>
            <th className={thClass}>Description</th>
            <th className={thClass}>Amount</th>
            <th className={cn(thClass, 'text-right')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, idx) => (
            <tr
              key={`${transaction.date}-${transaction.description}`}
              className={cn(idx > 0 && 'border-t-[0.866px] border-[#f1f5f9]')}
            >
              <td className={cn(tdClass, 'text-[#111c2d]')}>{transaction.date}</td>
              <td className={tdClass}>
                <div className="flex items-center gap-2.5">
                  {transaction.type === 'Earning' ? (
                    <Banknote className="size-3.5 text-[#059669] shrink-0" />
                  ) : (
                    <Landmark className="size-3.25 text-[#475569] shrink-0" />
                  )}
                  <span className="text-[#111c2d]">{transaction.type}</span>
                </div>
              </td>
              <td className={cn(tdClass, 'text-[#475569]')}>{transaction.description}</td>
              <td
                className={cn(
                  tdClass,
                  'font-semibold',
                  transaction.amount.startsWith('+') ? 'text-[#059669]' : 'text-[#111c2d]',
                )}
              >
                {transaction.amount}
              </td>
              <td className={tdClass}>
                <div className="flex justify-end">
                  <span
                    className={cn(
                      'rounded-full border-[0.866px] px-[7.794px] py-[3.464px] text-[10.392px] font-bold leading-[14.548px]',
                      statusStyles[transaction.status],
                    )}
                  >
                    {transaction.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between bg-[#f8fafc]/30 border-t-[0.866px] border-[#f1f5f9] px-[20.783px] py-[13.856px]">
        <p className="text-[#505f76] text-[10.392px] leading-[14.548px]">
          Showing 5 of 24 transactions
        </p>
        <div className="flex items-center gap-[6.928px]">
          <button className="border-[0.866px] border-[#e2e8f0] card-radius text-[#475569] text-[10.392px] leading-[14.548px] px-[14.722px] py-[4.33px]">
            Previous
          </button>
          <button className="border-[0.866px] border-[#e2e8f0] card-radius text-[#475569] text-[10.392px] leading-[14.548px] px-[14.722px] py-[4.33px]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

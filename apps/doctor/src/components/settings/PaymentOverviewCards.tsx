import PaymentOverviewCard from '@/components/settings/PaymentOverviewCard';
import { Clock, History, TrendingUp } from 'lucide-react';

export default function PaymentOverviewCards() {
  return (
    <div className="payment_overview_cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20.78px]">
      <PaymentOverviewCard title="Total Earnings" amount="₦42,850.00">
        <div className="flex items-center gap-1">
          <TrendingUp className="text-[#059669] size-3" />
          <p className="text-success-green text-[10px] leading-[14.548px]">
            +12.5% from last month
          </p>
        </div>
      </PaymentOverviewCard>

      <PaymentOverviewCard title="Available Balance" amount="₦12,420.00">
        <div className="flex items-center gap-1">
          <p className="text-secondary-3 text-[10px] leading-[14.548px]">Updated 2 mins ago.</p>
        </div>
      </PaymentOverviewCard>

      <PaymentOverviewCard title="Withdrawn Amount" amount="₦12,420.00">
        <div className="flex items-center gap-1">
          <History className="text-text-secondary size-2.5" />
          <p className="text-secondary-3 text-[10px] leading-[14.548px]">Total 24 withdrawals.</p>
        </div>
      </PaymentOverviewCard>

      <PaymentOverviewCard title="Pending earnings" amount="₦2,100.00">
        <div className="flex items-center gap-1 text-[#D97706]">
          <Clock className="size-2.5" />
          <p className="text-[10px] leading-[14.548px]">Processing (3 items)</p>
        </div>
      </PaymentOverviewCard>
    </div>
  );
}

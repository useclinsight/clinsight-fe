import PaymentOverviewCards from '@/components/settings/PaymentOverviewCards';
import WithdrawFundsCard from '@/components/settings/WithdrawFundsCard';
import BankDetailsCard from '@/components/settings/BankDetailsCard';
import PaymentSettingsCard from '@/components/settings/PaymentSettingsCard';
import TransactionHistoryCard from '@/components/settings/TransactionHistoryCard';

export default function Page() {
  return (
    <div className="px-6 pt-7.5 pb-20 font-inter">
      <div className="flex flex-col gap-[20.783px]">
        {/* Header */}
        <header className="flex flex-col gap-[4.871px]">
          <h1 className="text-settings-header-text text-[40px] font-semibold leading-[1.2] tracking-[-0.8px]">
            Payments and Earnings
          </h1>
          <p className="text-settings-subheader-text text-[19.482px] leading-[29.223px]">
            View, manage and withdraw earnings.
          </p>
        </header>

        {/* Earnings overview */}
        <PaymentOverviewCards />

        {/* Withdraw + Bank details / settings */}
        <div className="grid grid-cols-2 gap-[20.783px] items-start">
          <WithdrawFundsCard />

          <div className="flex flex-col gap-[20.792px]">
            <BankDetailsCard />
            <PaymentSettingsCard />
          </div>
        </div>

        {/* Transaction history */}
        <TransactionHistoryCard />
      </div>
    </div>
  );
}

import { PropsWithChildren } from 'react';

interface PaymentOverviewCardProps extends PropsWithChildren {
  title: string;
  amount: string;
}

export default function PaymentOverviewCard({ title, children, amount }: PaymentOverviewCardProps) {
  return (
    <div className="payment_overview_card flex flex-col py-5 px-[20.783px] items-start gap-[6.928px] justify-stretch rounded-[10.392px] border-[0.866px] border-primary-subtle bg-white payment_overview_card_shadow">
      <p className="text-secondary-3 text-[10.392px] font-semibold leading-[14.548px] tracking-[0.52px] uppercase">
        {title}
      </p>
      <h3 className="text-[25.972px] text-text-primary font-semibold leading-[130%] tracking-[-0.26px]">
        {amount}
      </h3>

      {children}
    </div>
  );
}

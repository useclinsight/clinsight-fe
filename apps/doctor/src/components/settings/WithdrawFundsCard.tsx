import { Wallet } from 'lucide-react';

export default function WithdrawFundsCard() {
  return (
    <div className="rounded-[10.392px] bg-[#F3F4F6]  border-[0.866px] border-primary-subtle payment_overview_card_shadow overflow-hidden flex flex-col ">
      <div className="flex items-center justify-between py-[13.86px] px-[20.783px] border-b-[0.866px] border-primary-subtle bg-[#f8fafc] w-full">
        <h2 className="text-[17.319px] font-semibold leading-[24.247px] text-[#111c2d] ">
          Withdraw Funds
        </h2>
      </div>

      <div className="space-y-[20.78px] pt-[20.78px] pb-[153.282px] px-[20.783px] bg-white h-full flex-1">
        <div className="p-[13.856px] flex items-center justify-between card-radius background bg-withdraw-card">
          <div>
            <p className="text-[#003884] font-inter text-[10.392px] font-semibold leading-[140%]">
              Ready to Withdraw
            </p>

            <h3 className="text-blue-1 text-[20.783px] font-bold leading-[130%] tracking-[-0.208px]">
              ₦12,420.00
            </h3>
          </div>

          <Wallet className="w-[30.551px] h-[38.103px] text-blue-1" />
        </div>

        <form action="" className="space-y-[20.78px]">
          <div className="space-y-[6.93px]">
            <label htmlFor="amount" className="text-sm leading-[150%] text-[#434652]">
              Enter Amount
            </label>

            <div className="border-0.8 border-primary-subtle bg-white card-radius h-[44.675px] w-full px-[13.85px] flex items-center gap-2 focus-within:ring-1 focus-within:ring-primary-blue">
              <p className="text-[#949BA8] font-inter text-[13.856px] font-bold leading-[20.783px]">
                ₦
              </p>

              <input
                type="text"
                name="amount"
                id="amount"
                className="text-sm text-text-primary w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-[10.39px]">
            <button className="flex items-center justify-center bg-blue-1 card-radius py-[10.392px] px-[20.783px] text-white w-full text-[13.856px] leading-[20.783px]">
              Withdraw Funds
            </button>

            <p className="text-[#64748B] text-center text-[10.392px] leading-[140%]">
              Withdrawals are processed within 24 hours
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

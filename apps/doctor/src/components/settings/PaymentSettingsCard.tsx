export default function PaymentSettingsCard() {
  return (
    <div className="rounded-[10.392px] bg-white border-[0.866px] border-primary-subtle payment_overview_card_shadow overflow-hidden">
      <header className="py-[13.86px] px-[20.783px] border-b-[0.866px] border-primary-subtle bg-[#f8fafc]">
        <h2 className="text-[17.319px] font-semibold leading-[24.247px] text-[#111c2d]">
          Payment Settings
        </h2>
      </header>

      <div className="p-[20.783px] space-y-[20.775px]">
        {/* Auto-withdraw */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[#111c2d] text-[13.856px] leading-[20.783px]">Auto-withdraw</p>
            <p className="text-[#505f76] text-[10.392px] leading-[14.548px]">
              Automatically transfer funds when threshold is reached
            </p>
          </div>

          <span
            role="img"
            aria-label="Auto-withdraw on"
            className="relative inline-block h-[20.783px] w-[41.567px] rounded-full bg-blue-1 shrink-0"
          >
            <span className="absolute right-[3.464px] top-[3.464px] size-[13.856px] rounded-full bg-white" />
          </span>
        </div>

        {/* Minimum withdrawal threshold */}
        <div className="space-y-[6.928px]">
          <label
            htmlFor="threshold"
            className="block text-[#434652] text-[13.856px] leading-[20.783px]"
          >
            Minimum withdrawal threshold
          </label>

          <form className="flex items-center gap-[20.783px]">
            <div className="flex-1 flex items-center gap-2 bg-white border-[0.866px] border-[#e2e8f0] card-radius px-[10.38px] py-[7.794px]">
              <span className="text-[#94a3b8] text-[13.856px] leading-[20.783px]">₦</span>
              <input
                id="threshold"
                name="threshold"
                type="text"
                placeholder="1000"
                className="w-full text-[12.124px] text-[#111c2d] placeholder:text-[rgba(17,28,45,0.5)] focus:outline-none"
              />
            </div>

            <button className="bg-[#f1f5f9] text-[#475569] text-[13.856px] leading-[20.783px] card-radius px-[20.783px] py-[6.928px]">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

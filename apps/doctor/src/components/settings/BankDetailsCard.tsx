import { Pencil, ShieldCheck } from 'lucide-react';

const details = [
  { label: 'Account Name', value: 'Dr. Light Adeyemi' },
  { label: 'Bank Name', value: 'Zenith Bank' },
  { label: 'Account Number', value: '•••• •••• 8842' },
  { label: 'Swift/BIC', value: 'GHFBLX22' },
];

export default function BankDetailsCard() {
  return (
    <div className="rounded-[10.392px] bg-white border-[0.866px] border-primary-subtle payment_overview_card_shadow overflow-hidden">
      <header className="flex items-center justify-between py-[13.86px] px-[20.783px] border-b-[0.866px] border-primary-subtle bg-[#f8fafc]">
        <h2 className="text-[17.319px] font-semibold leading-[24.247px] text-[#111c2d]">
          Bank Details
        </h2>
        <button className="flex items-center gap-[3.464px] text-[#003884] text-[13.856px] leading-[20.783px]">
          <Pencil className="size-[11.691px]" />
          Edit Details
        </button>
      </header>

      <div className="p-[20.783px] space-y-[20.792px]">
        <div className="grid grid-cols-2 gap-[20.783px]">
          {details.map((detail) => (
            <div key={detail.label} className="space-y-[3.464px]">
              <p className="text-[#505f76] text-[10.392px] leading-[14.548px]">{detail.label}</p>
              <p className="text-[#111c2d] text-[13.856px] leading-[20.783px]">{detail.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2.5 bg-[#f0f3ff] rounded-[5px] px-2.5 py-[10.55px]">
          <ShieldCheck className="size-[13.333px] text-primary-blue shrink-0" />
          <p className="text-[12px] leading-normal tracking-[-0.12px] text-primary-blue">
            Your payment details are securely stored and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}

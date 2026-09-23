import Toggle from '@/components/settings/Toggle';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[14.612px] border-[1.218px] border-[#e2e8f0] bg-white shadow-[0px_1.218px_2.435px_0px_rgba(0,0,0,0.05)]',
        className,
      )}
    >
      <header className="border-b-[1.218px] border-[#e2e8f0] bg-[#f8fafc] px-[29.223px] pt-[19.482px] pb-[20.7px]">
        <h3 className="text-[24.353px] font-semibold leading-[34.094px] text-[#111c2d]">{title}</h3>
      </header>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  className,
}: {
  label: string;
  checked: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className="text-[19.482px] leading-[29.223px] text-[#111c2d]">{label}</p>
      <Toggle checked={checked} />
    </div>
  );
}

export default function Page() {
  return (
    <div className="px-6 pt-7.5 pb-20 font-inter">
      <div className="flex flex-col gap-[29.223px]">
        {/* Header */}
        <header className="flex flex-col gap-[4.871px]">
          <h1 className="text-settings-header-text text-[40px] font-semibold leading-[1.2] tracking-[-0.8px]">
            Notification Settings
          </h1>
          <p className="text-settings-subheader-text text-[19.482px] leading-[29.223px]">
            Configure how and when you receive updates about your clinical practice.
          </p>
        </header>

        {/* Case + Activity */}
        <div className="grid grid-cols-2 gap-[29.223px]">
          <SectionCard title="Case Notifications" className="self-start">
            <div className="flex flex-col gap-[19.482px] p-[29.223px]">
              <p className="text-[18px] leading-[1.5] tracking-[-0.18px] text-[#505f76]">
                Get notified when new or urgent cases require your attention
              </p>
              <ToggleRow label="New case assigned" checked className="py-[4.871px]" />
              <ToggleRow label="High-priority case" checked className="py-[4.871px]" />
              <ToggleRow label="Case reassigned" checked={false} className="py-[4.871px]" />
            </div>
          </SectionCard>

          <SectionCard title="Activity Notifications" className="self-start">
            <div className="flex flex-col gap-[19.482px] p-[29.223px]">
              <p className="text-[18px] leading-[1.5] tracking-[-0.18px] text-[#505f76]">
                Stay updated on activity related to your cases
              </p>
              <ToggleRow label="Case completed" checked className="py-[12px]" />
              <ToggleRow label="Patient feedback received" checked={false} className="py-[12px]" />
              <ToggleRow label="Case updates" checked className="py-[12px]" />
            </div>
          </SectionCard>
        </div>

        {/* Payment Notifications */}
        <SectionCard title="Payment Notifications">
          <div className="flex flex-col gap-[29.223px] p-[29.223px]">
            <p className="text-[19.482px] italic leading-[29.223px] text-[#505f76]">
              Track your earnings and payment updates
            </p>
            <div className="grid grid-cols-2 gap-[29.223px]">
              <div className="flex items-center justify-between rounded-[9.741px] border-[1.218px] border-[#f1f5f9] px-[19.49px] py-[19.48px]">
                <div className="flex items-center gap-5">
                  <Image
                    src="/assets/settings/payment-received-icon.svg"
                    alt=""
                    width={22}
                    height={16}
                  />
                  <p className="text-[19.482px] leading-[29.223px] text-[#111c2d]">
                    Payment received
                  </p>
                </div>
                <Toggle checked />
              </div>

              <div className="flex items-center justify-between rounded-[9.741px] border-[1.218px] border-[#f1f5f9] px-[19.49px] py-[19.48px]">
                <div className="flex items-center gap-6">
                  <Image
                    src="/assets/settings/withdrawal-processed-icon.svg"
                    alt=""
                    width={19}
                    height={18}
                  />
                  <p className="text-[19.482px] leading-[29.223px] text-[#111c2d]">
                    Withdrawal processed
                  </p>
                </div>
                <Toggle checked />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Notification Channels */}
        <SectionCard title="Notification Channels">
          <table className="w-full border-collapse">
            <thead className="bg-[#f8fafc]/50">
              <tr>
                <th className="px-[29.223px] py-[19.482px] text-left text-[19.482px] font-bold uppercase tracking-[0.9741px] text-[#505f76]">
                  Channel Row
                </th>
                <th className="px-[29.223px] py-[19.482px] text-center text-[19.482px] font-bold uppercase tracking-[0.9741px] text-[#505f76]">
                  In-App
                </th>
                <th className="px-[29.223px] py-[19.482px] text-center text-[19.482px] font-bold uppercase tracking-[0.9741px] text-[#505f76]">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  { channel: 'Case Updates', inApp: true, email: true },
                  { channel: 'Payments', inApp: true, email: false },
                  { channel: 'System Alerts', inApp: true, email: true },
                ] as const
              ).map((row, idx) => (
                <tr
                  key={row.channel}
                  className={cn(idx > 0 && 'border-t-[1.218px] border-[#f1f5f9]')}
                >
                  <td className="px-[29.223px] py-[32px] text-[19.482px] text-[#111c2d]">
                    {row.channel}
                  </td>
                  <td className="px-[29.223px] py-[32px]">
                    <div className="flex justify-center">
                      <Toggle checked={row.inApp} />
                    </div>
                  </td>
                  <td className="px-[29.223px] py-[32px]">
                    <div className="flex justify-center">
                      <Toggle checked={row.email} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* Save Action */}
        <div className="flex justify-end pt-[19.482px]">
          <button
            type="button"
            className="rounded-[9.741px] bg-primary-blue px-[38.964px] py-[14.612px] text-[19.482px] leading-[29.223px] text-white shadow-[0px_12.176px_18.265px_-3.653px_rgba(0,0,0,0.1),0px_4.871px_7.306px_-4.871px_rgba(0,0,0,0.1)]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

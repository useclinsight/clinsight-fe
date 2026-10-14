import { cn } from '@/lib/utils';

export default function SectionCard({
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

import Toggle from '@/components/settings/Toggle';
import { cn } from '@/lib/utils';

export default function ToggleRow({
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

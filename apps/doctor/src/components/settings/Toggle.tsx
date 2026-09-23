import { cn } from '@/lib/utils';

export default function Toggle({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span
      role="img"
      aria-label={checked ? 'On' : 'Off'}
      className={cn(
        'relative inline-block h-[29.223px] w-[53.576px] rounded-full',
        checked ? 'bg-success-green' : 'bg-[#e2e8f0]',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-[2.44px] size-[24.353px] rounded-full bg-white',
          checked ? 'left-[26.79px]' : 'left-[2.43px] border-[1.218px] border-[#cbd5e1]',
        )}
      />
    </span>
  );
}

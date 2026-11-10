import { getPriorityBadgeClasses, type CasePriority } from '@/lib/cases-utils';

export default function PriorityBadge({
  priority,
  isMobile = false,
}: {
  priority?: CasePriority | string;
  isMobile?: boolean;
}) {
  const level = priority || 'Medium';
  const label = isMobile ? `${level} Priority` : level;

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${getPriorityBadgeClasses(level)}`}
    >
      {label}
    </span>
  );
}

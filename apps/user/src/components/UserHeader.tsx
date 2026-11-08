import { PatientSignOutButton } from '@/components/PatientSignOutButton';

interface UserHeaderProps {
  firstName: string;
  lastName: string;
}

export function UserHeader({ firstName, lastName }: UserHeaderProps) {
  const initials = [firstName, lastName].map((name) => Array.from(name.trim())[0]).join('');

  return (
    <header className="flex min-h-18 items-center justify-between gap-4 border-b border-outline-border bg-white px-5 py-4 md:min-h-23 md:px-10 md:py-5">
      <h1 className="min-w-0 text-[23px] leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] text-gray-900 md:text-[32px]">
        Welcome, {firstName}
      </h1>
      <div className="hidden max-w-[44%] shrink-0 items-center gap-2.5 md:flex">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-subtle text-[13px] font-semibold text-primary-blue"
        >
          {initials.toUpperCase()}
        </span>
        <div className="min-w-0 text-sm font-medium [overflow-wrap:anywhere] text-gray-900">
          {firstName} {lastName}
          <p className="text-xs font-normal text-slate-600">Patient</p>
        </div>
      </div>
      <div className="shrink-0 md:hidden">
        <PatientSignOutButton />
      </div>
    </header>
  );
}

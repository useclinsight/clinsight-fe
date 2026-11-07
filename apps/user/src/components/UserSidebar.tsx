'use client';

import { cn } from '@clinsight/lib';
import { LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PatientSignOutButton } from '@/components/PatientSignOutButton';

export function UserSidebar() {
  const isOverview = usePathname() === '/';

  return (
    <aside className="hidden flex-col border-r border-outline-border bg-white px-4 py-6 md:flex">
      <Link href="/" className="mb-13 ml-2 inline-flex self-start rounded-md">
        <Image
          src="/assets/header-assets/clinsight-logo.svg"
          alt="Clinsight"
          width={130}
          height={34}
        />
      </Link>
      <nav aria-label="Patient portal">
        <Link
          href="/"
          aria-current={isOverview ? 'page' : undefined}
          className={cn(
            'flex items-center gap-2.5 rounded-lg px-2.5 py-3 text-sm font-semibold',
            isOverview
              ? 'bg-primary-subtle text-primary-blue'
              : 'text-slate-600 hover:bg-primary-subtle',
          )}
        >
          <LayoutDashboard aria-hidden="true" className="size-5" />
          Overview
        </Link>
      </nav>
      <div className="mt-auto pt-6">
        <PatientSignOutButton appearance="navigation" />
      </div>
    </aside>
  );
}

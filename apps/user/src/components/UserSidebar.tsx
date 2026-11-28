'use client';

import { cn } from '@clinsight/lib';
import { Bell, House, Lightbulb, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PatientSignOutButton } from '@/components/PatientSignOutButton';

export function UserSidebar() {
  const pathname = usePathname();
  const links = [
    { href: '/dashboard', label: 'Home', icon: House },
    { href: '/insights', label: 'Insights', icon: Lightbulb },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <aside className="hidden flex-col border-r border-outline-border bg-white px-4 py-6 md:flex">
      <Link href="/dashboard" className="mb-13 ml-2 inline-flex self-start rounded-md">
        <Image
          src="/assets/header-assets/clinsight-logo.svg"
          alt="Clinsight"
          width={130}
          height={34}
        />
      </Link>
      <nav aria-label="Patient portal" className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-3 text-sm font-semibold',
                active
                  ? 'bg-primary-subtle text-primary-blue'
                  : 'text-slate-600 hover:bg-primary-subtle',
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6">
        <PatientSignOutButton appearance="navigation" />
      </div>
    </aside>
  );
}

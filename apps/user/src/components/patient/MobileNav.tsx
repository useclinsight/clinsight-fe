'use client';

import { Bell, House, Lightbulb, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@clinsight/lib';

const links = [
	{ href: '/', label: 'Home', icon: House },
	{ href: '/insights', label: 'Insights', icon: Lightbulb },
	{ href: '/notifications', label: 'Alerts', icon: Bell },
	{ href: '/profile', label: 'Profile', icon: UserRound },
];

export function MobileNav() {
	const pathname = usePathname();
	return (
		<nav
			aria-label="Patient navigation"
			className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-outline-border bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
		>
			{links.map(({ href, label, icon: Icon }) => {
				const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? 'page' : undefined}
						className={cn(
							'flex flex-col items-center gap-1 py-3 text-[11px] font-medium',
							active ? 'text-primary-blue' : 'text-slate-500',
						)}
					>
						<Icon aria-hidden="true" className="size-5" />
						{label}
					</Link>
				);
			})}
		</nav>
	);
}

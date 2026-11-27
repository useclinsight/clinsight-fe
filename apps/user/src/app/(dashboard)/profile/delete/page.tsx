import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DeleteAccountButton } from '@/components/profile/DeleteAccountButton';

export const metadata = { title: 'Delete Account · Clinsight' };

export default function DeleteAccountPage() {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<Link
				href="/profile"
				className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-600 hover:text-gray-900"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Back to profile
			</Link>
			<header>
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Are You Sure?</h1>
				<p className="mt-1 text-sm text-slate-600">
					You’re about to permanently delete your account and all associated medical insights.
				</p>
			</header>
			<DeleteAccountButton />
		</div>
	);
}

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PasswordForm } from '@/components/profile/PasswordForm';

export const metadata = { title: 'Change Password · Clinsight' };

export default function ChangePasswordPage() {
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
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Change Password</h1>
				<h2 className="mt-4 text-lg font-semibold text-gray-900">Create New Password</h2>
				<p className="mt-1 text-sm text-slate-600">Choose a new password for your account.</p>
			</header>
			<PasswordForm />
		</div>
	);
}

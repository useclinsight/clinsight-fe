import { Avatar, Button, Card, CardContent } from '@clinsight/ui';
import { KeyRound, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { PatientSignOutButton } from '@/components/PatientSignOutButton';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { patientApi } from '@/lib/patient-api';

export const metadata = { title: 'Profile · Clinsight' };

const memberSinceFormatter = new Intl.DateTimeFormat('en-GB', {
	day: '2-digit',
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC',
});

function LoadingState() {
	return (
		<div role="status" aria-live="polite" aria-busy="true" className="space-y-5" data-testid="profile-loading">
			<span className="sr-only">Loading your profile…</span>
			<div className="h-28 animate-pulse rounded-[14px] bg-gray-100" />
			<div className="h-48 animate-pulse rounded-[14px] bg-gray-100" />
			<div className="h-56 animate-pulse rounded-[14px] bg-gray-100" />
		</div>
	);
}

function ErrorState({ detail }: { detail: string }) {
	return (
		<Card role="alert" className="rounded-[14px] border-gray-200 shadow-none">
			<CardContent className="flex flex-col items-start gap-3 p-6">
				<h2 className="text-lg font-semibold text-gray-900">We couldn’t load your profile</h2>
				<p className="text-sm text-slate-600">{detail}</p>
				<Button asChild variant="outline" size="sm" className="gap-2">
					<a href="/profile">
						<RefreshCw aria-hidden="true" className="size-4" />
						Try again
					</a>
				</Button>
			</CardContent>
		</Card>
	);
}

async function ProfileContent() {
	const result = await patientApi.getProfile();
	if (!result.ok) return <ErrorState detail={result.message} />;

	const profile = result.data;
	const fullName = `${profile.first_name} ${profile.last_name}`.trim();
	const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
	const created = new Date(profile.created_at);
	const memberSince =
		Number.isNaN(created.getTime()) ? null : memberSinceFormatter.format(created);

	return (
		<div className="space-y-6">
			<Card className="rounded-[14px] border-gray-200 shadow-none">
				<CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
					<Avatar
						src={profile.avatar_url ?? undefined}
						alt={`${fullName}'s profile photo`}
						fallback={initials}
						size="xl"
					/>
					<div className="min-w-0 space-y-1">
						<h2 className="truncate text-xl font-semibold text-gray-900">{fullName}</h2>
						<p className="truncate text-sm text-slate-600">{profile.email}</p>
						{memberSince && (
							<p className="text-xs text-slate-500">Member since {memberSince}</p>
						)}
					</div>
				</CardContent>
			</Card>

			<AvatarUpload avatarUrl={profile.avatar_url} fallback={initials} />

			<div>
				<h2 className="mb-3 text-lg font-semibold text-gray-900">Personal information</h2>
				<ProfileForm
					firstName={profile.first_name}
					lastName={profile.last_name}
					email={profile.email}
				/>
			</div>

			<div>
				<h2 className="mb-3 text-lg font-semibold text-gray-900">Account settings</h2>
				<Card className="rounded-[14px] border-gray-200 shadow-none">
					<CardContent className="divide-y divide-gray-100 p-0">
						<Link
							href="/profile/password"
							className="flex items-center gap-3 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:px-6"
						>
							<KeyRound aria-hidden="true" className="size-5 text-slate-500" />
							Change Password
						</Link>
						<Link
							href="/notifications"
							className="flex items-center gap-3 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:px-6"
						>
							<ShieldCheck aria-hidden="true" className="size-5 text-slate-500" />
							Notifications
						</Link>
						<Link
							href="/terms"
							className="flex items-center gap-3 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:px-6"
						>
							Terms
						</Link>
						<Link
							href="/privacy"
							className="flex items-center gap-3 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:px-6"
						>
							Privacy Policy
						</Link>
						<Link
							href="/profile/delete"
							className="flex items-center gap-3 px-4 py-4 text-sm font-medium text-red-700 hover:bg-red-50 sm:px-6"
						>
							<Trash2 aria-hidden="true" className="size-5" />
							Delete Account
						</Link>
						<div className="px-4 py-4 sm:px-6">
							<PatientSignOutButton />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<header>
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
				<p className="mt-1 text-sm text-slate-600">
					Manage your personal details and account preferences.
				</p>
			</header>
			<Suspense fallback={<LoadingState />}>
				<ProfileContent />
			</Suspense>
		</div>
	);
}

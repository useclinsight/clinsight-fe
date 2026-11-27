import { Button, Card, CardContent } from '@clinsight/ui';
import { Bell, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';
import { NotificationList } from '@/components/notifications/NotificationList';
import { patientApi } from '@/lib/patient-api';

export const metadata = { title: 'Notifications · Clinsight' };

function LoadingState() {
	return (
		<div role="status" aria-live="polite" aria-busy="true" className="space-y-4" data-testid="notifications-loading">
			<span className="sr-only">Loading your notifications…</span>
			<div className="h-24 animate-pulse rounded-[14px] bg-gray-100" />
			<div className="h-6 w-48 animate-pulse rounded bg-gray-100" />
			{Array.from({ length: 3 }, (_, index) => (
				<div key={index} className="h-24 animate-pulse rounded-[14px] bg-gray-100" />
			))}
		</div>
	);
}

function ErrorState({ detail }: { detail: string }) {
	return (
		<Card role="alert" className="rounded-[14px] border-gray-200 shadow-none">
			<CardContent className="flex flex-col items-start gap-3 p-6">
				<h2 className="text-lg font-semibold text-gray-900">We couldn’t load your notifications</h2>
				<p className="text-sm text-slate-600">{detail}</p>
				<Button asChild variant="outline" size="sm" className="gap-2">
					<a href="/notifications">
						<RefreshCw aria-hidden="true" className="size-4" />
						Try again
					</a>
				</Button>
			</CardContent>
		</Card>
	);
}

async function NotificationsContent() {
	const [list, count, preferences] = await Promise.all([
		patientApi.listNotifications(),
		patientApi.unreadCount(),
		patientApi.getPreferences(),
	]);

	if (!list.ok) return <ErrorState detail={list.message} />;
	if (!count.ok) return <ErrorState detail={count.message} />;
	if (!preferences.ok) return <ErrorState detail={preferences.message} />;

	return (
		<NotificationList
			notifications={list.data}
			initialUnreadCount={count.data.unread}
			initialNotifyOnComplete={preferences.data.notify_on_complete}
		/>
	);
}

export default function NotificationsPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<header className="flex items-start gap-3">
				<span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-subtle text-primary-blue">
					<Bell aria-hidden="true" className="size-5" />
				</span>
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h1>
					<p className="mt-1 text-sm text-slate-600">
						Updates about your lab results and account activity.
					</p>
				</div>
			</header>

			<Suspense fallback={<LoadingState />}>
				<NotificationsContent />
			</Suspense>
		</div>
	);
}

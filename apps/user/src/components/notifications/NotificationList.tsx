'use client';

import { Badge, Button, Card, CardContent } from '@clinsight/ui';
import { Bell, CheckCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import {
	markAllNotificationsReadAction,
	markNotificationReadAction,
	updateNotificationPreferenceAction,
} from '@/actions/patient-notifications';

export type NotificationView = {
	id: string;
	title: string;
	message: string | null;
	medical_case_id: string | null;
	is_read: boolean;
	created_at: string;
};

type Feedback = { kind: 'success' | 'error'; text: string };

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZone: 'UTC',
});

function formatDate(iso: string) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return 'Recently';
	return `${dateFormatter.format(date)} UTC`;
}

export function NotificationList({
	notifications,
	initialUnreadCount,
	initialNotifyOnComplete,
}: {
	notifications: NotificationView[];
	initialUnreadCount: number;
	initialNotifyOnComplete: boolean;
}) {
	// Local overrides layer over server data, so no effects mirror props into state.
	const [readOverrides, setReadOverrides] = useState<Record<string, true>>({});
	const [preferenceOverride, setPreferenceOverride] = useState<boolean | null>(null);
	const [feedback, setFeedback] = useState<Feedback | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const items = notifications.map((item) =>
		readOverrides[item.id] ? { ...item, is_read: true } : item,
	);
	const newlyRead = notifications.filter(
		(item) => !item.is_read && readOverrides[item.id],
	).length;
	const unreadCount = Math.max(0, initialUnreadCount - newlyRead);
	const notifyOnComplete = preferenceOverride ?? initialNotifyOnComplete;

	function applyFeedback(result: { success: boolean; message: string }) {
		setFeedback({ kind: result.success ? 'success' : 'error', text: result.message });
	}

	function handleMarkRead(id: string) {
		if (isPending) return;
		setBusyId(id);
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await markNotificationReadAction(id);
				if (result.success) setReadOverrides((current) => ({ ...current, [id]: true }));
				applyFeedback(result);
			} catch {
				setFeedback({ kind: 'error', text: 'Please try again in a moment.' });
			} finally {
				setBusyId(null);
			}
		});
	}

	function handleMarkAllRead() {
		if (isPending) return;
		const ids = items.filter((item) => !item.is_read).map((item) => item.id);
		if (ids.length === 0) return;
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await markAllNotificationsReadAction(ids);
				if (result.success) {
					setReadOverrides((current) => ({
						...current,
						...Object.fromEntries(ids.map((id) => [id, true as const])),
					}));
				}
				applyFeedback(result);
			} catch {
				setFeedback({ kind: 'error', text: 'Please try again in a moment.' });
			}
		});
	}

	function handlePreferenceChange(enabled: boolean) {
		if (isPending) return;
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await updateNotificationPreferenceAction({ notify_on_complete: enabled });
				if (result.success) setPreferenceOverride(enabled);
				applyFeedback(result);
			} catch {
				setFeedback({ kind: 'error', text: 'Please try again in a moment.' });
			}
		});
	}

	return (
		<div className="space-y-5">
			<Card className="rounded-[14px] border-gray-200 shadow-none">
				<CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
					<div className="flex items-center gap-3">
						<span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-subtle text-primary-blue">
							<Bell aria-hidden="true" className="size-5" />
						</span>
						<div>
							<p className="font-semibold text-gray-900">Notification preferences</p>
							<p id="notify-on-complete-hint" className="text-sm text-slate-600">
								Get notified when your AI analysis is ready.
							</p>
						</div>
					</div>
					<label className="flex cursor-pointer items-center gap-3">
						<span className="text-sm font-medium text-gray-800">Analysis-ready alerts</span>
						<input
							id="notify-on-complete"
							type="checkbox"
							role="switch"
							checked={notifyOnComplete}
							disabled={isPending}
							aria-describedby="notify-on-complete-hint"
							onChange={(event) => handlePreferenceChange(event.target.checked)}
							className="h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-gray-300 transition-colors checked:bg-[#1565c0] disabled:cursor-wait checked:relative checked:after:absolute checked:after:top-0.5 checked:after:left-0.5 checked:after:size-5 checked:after:rounded-full checked:after:bg-white checked:after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1565c0]"
						/>
						<span className="sr-only">Analysis-ready alerts are {notifyOnComplete ? 'on' : 'off'}</span>
					</label>
				</CardContent>
			</Card>

			{feedback && (
				<p
					role={feedback.kind === 'error' ? 'alert' : 'status'}
					aria-live="polite"
					className={
						feedback.kind === 'error'
							? 'rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800'
							: 'rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800'
					}
				>
					{feedback.text}
				</p>
			)}

			<div className="flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-lg font-semibold text-gray-900" id="notification-list-heading">
					All notifications
					{unreadCount > 0 && (
						<Badge variant="info" className="ml-2 align-middle">
							{unreadCount} unread
						</Badge>
					)}
				</h3>
				{unreadCount > 0 && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending}
						onClick={handleMarkAllRead}
						className="gap-2"
					>
						<CheckCheck aria-hidden="true" className="size-4" />
						{isPending ? 'Updating…' : 'Mark all as read'}
					</Button>
				)}
			</div>

			{items.length === 0 ? (
				<Card className="rounded-[14px] border-gray-200 shadow-none">
					<CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
						<Bell aria-hidden="true" className="size-10 text-slate-400" />
						<h3 className="text-lg font-semibold text-gray-900">No Notifications Yet!</h3>
						<p className="max-w-sm text-sm text-slate-600">
							We’ll notify you when there’s something new to review.
						</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2 gap-2"
							onClick={() => document.getElementById('notify-on-complete')?.focus()}
						>
							Notification preferences
						</Button>
					</CardContent>
				</Card>
			) : (
				<ul role="list" aria-labelledby="notification-list-heading" className="space-y-3">
					{items.map((item) => (
						<li key={item.id}>
							<Card
								className={
									item.is_read
										? 'rounded-[14px] border-gray-200 shadow-none'
										: 'rounded-[14px] border-[#1565c0]/30 bg-blue-50/40 shadow-none'
								}
							>
								<CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
									<div className="min-w-0 space-y-1.5">
										<div className="flex flex-wrap items-center gap-2">
											<h4 className="font-semibold text-gray-900">{item.title}</h4>
											{!item.is_read && <Badge variant="info">New</Badge>}
											{item.is_read && (
												<span className="inline-flex items-center gap-1 text-xs text-slate-500">
													<CheckCircle2 aria-hidden="true" className="size-3.5" />
													Read
												</span>
											)}
										</div>
										{item.message && (
											<p className="text-sm leading-relaxed text-slate-600">{item.message}</p>
										)}
										<time dateTime={item.created_at} className="block text-xs text-slate-500">
											{formatDate(item.created_at)}
										</time>
									</div>
									<div className="flex shrink-0 flex-wrap items-center gap-2">
										{!item.is_read && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={isPending}
												aria-label={`Mark ${item.title} as read`}
												onClick={() => handleMarkRead(item.id)}
											>
												{busyId === item.id ? 'Saving…' : 'Mark as read'}
											</Button>
										)}
										{item.medical_case_id && (
											<Button asChild variant="link" size="sm">
												<Link
													href="/records"
													aria-label={`View the result for ${item.title}`}
													onClick={() => {
														if (!item.is_read) handleMarkRead(item.id);
													}}
												>
													View result
												</Link>
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

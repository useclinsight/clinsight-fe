'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { FileText, Pencil, Trash2, Search, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input } from '@clinsight/ui';

import { deleteCaseAction, renameCaseAction } from '@/actions/patient-data';
import type { MedicalCase } from '@/lib/patient-api';

export function InsightsList({ cases }: { cases: MedicalCase[] }) {
	const [query, setQuery] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState('');
	const [confirmId, setConfirmId] = useState<string | null>(null);
	const [pending, startTransition] = useTransition();

	const filtered = cases.filter((item) =>
		(item.title ?? 'Lab report').toLowerCase().includes(query.trim().toLowerCase()),
	);

	const saveRename = (id: string) => {
		startTransition(async () => {
			const result = await renameCaseAction(id, draft);
			if (!result.ok) {
				toast.error(result.message);
				return;
			}
			toast.success('Insight renamed.');
			setEditingId(null);
		});
	};

	const remove = (id: string) => {
		startTransition(async () => {
			const result = await deleteCaseAction(id);
			if (!result.ok) {
				toast.error(result.message);
				return;
			}
			toast.success('Insight deleted.');
			setConfirmId(null);
		});
	};

	return (
		<div className="space-y-4">
			<div className="relative">
				<Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
				<Input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search insights"
					aria-label="Search insights"
					className="pl-9"
				/>
			</div>

			{cases.length === 0 ? (
				<div role="status" className="rounded-xl border border-outline-border bg-white px-6 py-12 text-center">
					<h2 className="text-base font-semibold text-gray-900">No insights yet</h2>
					<p className="mt-1 text-sm text-slate-600">Upload your first lab report to get started.</p>
				</div>
			) : filtered.length === 0 ? (
				<div role="status" className="rounded-xl border border-outline-border bg-white px-6 py-12 text-center">
					<h2 className="text-base font-semibold text-gray-900">No matching insights</h2>
					<p className="mt-1 text-sm text-slate-600">Try another keyword or upload a new result.</p>
				</div>
			) : (
				<ul className="space-y-2">
					{filtered.map((item) => (
						<li key={item.id} className="rounded-xl border border-outline-border bg-white p-4">
							<div className="flex items-start gap-3">
								<FileText aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary-blue" />
								<div className="min-w-0 flex-1">
									{editingId === item.id ? (
										<div className="space-y-2">
											<label htmlFor={`rename-${item.id}`} className="text-xs font-medium text-gray-700">
												Rename Insight
											</label>
											<Input
												id={`rename-${item.id}`}
												value={draft}
												maxLength={50}
												onChange={(event) => setDraft(event.target.value)}
											/>
											<p className="text-xs text-slate-500">{draft.length}/50 characters</p>
											<div className="flex gap-2">
												<Button size="xs" variant="brand" disabled={pending} onClick={() => saveRename(item.id)}>
													Save
												</Button>
												<Button size="xs" variant="ghost" onClick={() => setEditingId(null)}>
													Cancel
												</Button>
											</div>
										</div>
									) : (
										<>
											<Link href={`/insights/${item.id}`} className="text-sm font-semibold text-gray-900 hover:text-primary-blue">
												{item.title ?? 'Lab report'}
											</Link>
											<p className="mt-0.5 text-xs text-slate-500">
												{new Date(item.created_at).toLocaleString()} · {item.status}
											</p>
										</>
									)}
								</div>
								<div className="flex shrink-0 gap-1">
									<Button
										size="icon-xs"
										variant="ghost"
										aria-label={`Rename ${item.title ?? 'Lab report'}`}
										onClick={() => {
											setEditingId(item.id);
											setDraft(item.title ?? '');
										}}
									>
										<Pencil aria-hidden="true" className="size-4" />
									</Button>
									<Button
										size="icon-xs"
										variant="ghost"
										aria-label={`Delete ${item.title ?? 'Lab report'}`}
										onClick={() => setConfirmId(item.id)}
									>
										<Trash2 aria-hidden="true" className="size-4 text-red-600" />
									</Button>
								</div>
							</div>
							{confirmId === item.id ? (
								<div role="alertdialog" aria-label="Delete this insight?" className="mt-3 rounded-lg bg-red-50 p-3">
									<p className="text-sm font-medium text-red-900">Delete this insight?</p>
									<p className="mt-0.5 text-xs text-red-800">This action cannot be undone.</p>
									<div className="mt-2 flex gap-2">
										<Button size="xs" variant="destructive" disabled={pending} onClick={() => remove(item.id)}>
											{pending ? <LoaderCircle aria-hidden="true" className="size-3 animate-spin" /> : null}
											Delete
										</Button>
										<Button size="xs" variant="ghost" onClick={() => setConfirmId(null)}>
											Cancel
										</Button>
									</div>
								</div>
							) : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

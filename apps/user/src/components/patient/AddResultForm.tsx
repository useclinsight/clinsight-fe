'use client';

import { useRef, useState, useTransition } from 'react';
import { Paperclip, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@clinsight/ui';

import { addLabResultAction } from '@/actions/patient-data';

export function AddResultForm({ caseId }: { caseId: string }) {
	const ref = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [pending, startTransition] = useTransition();

	return (
		<div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-border bg-white p-4">
			<input
				ref={ref}
				type="file"
				accept="image/jpeg,image/png,image/webp,application/pdf"
				className="sr-only"
				aria-label="Add another lab report"
				onChange={(event) => setFile(event.target.files?.[0] ?? null)}
			/>
			<Button variant="outline" size="sm" onClick={() => ref.current?.click()} className="gap-2">
				<Paperclip aria-hidden="true" className="size-4" />
				{file ? file.name : 'Add another report'}
			</Button>
			<Button
				variant="brand"
				size="sm"
				disabled={!file || pending}
				onClick={() => {
					if (!file) return;
					const form = new FormData();
					form.set('file', file);
					startTransition(async () => {
						const result = await addLabResultAction(caseId, form);
						if (!result.ok) {
							toast.error(result.message);
							return;
						}
						setFile(null);
						toast.success('Report added. We will include it in your interpretation.');
					});
				}}
			>
				{pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
				Add
			</Button>
		</div>
	);
}

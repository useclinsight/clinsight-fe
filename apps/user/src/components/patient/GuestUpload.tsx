'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent } from '@clinsight/ui';

import { guestUploadAction } from '@/actions/patient-guest';

export function GuestUpload() {
	const router = useRouter();
	const ref = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [pending, startTransition] = useTransition();

	return (
		<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
			<CardContent className="space-y-4 p-5 sm:p-6">
				<div className="flex items-start gap-3.5">
					<span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-subtle text-primary-blue">
						<UploadCloud aria-hidden="true" className="size-5" />
					</span>
					<div>
						<h2 className="text-[17px] font-semibold text-gray-900">Upload your result</h2>
						<p className="mt-1 text-sm text-slate-600">Upload your lab report to get started</p>
						<p className="mt-1 text-xs text-slate-500">JPEG, PDF and PNG formats up to 10MB</p>
					</div>
				</div>
				<input
					ref={ref}
					type="file"
					accept="image/jpeg,image/png,image/webp,application/pdf"
					className="sr-only"
					aria-label="Choose a lab report file"
					onChange={(event) => setFile(event.target.files?.[0] ?? null)}
				/>
				{file ? (
					<div className="flex items-center gap-2 rounded-lg border border-outline-border bg-slate-50 px-3 py-2.5">
						<FileText aria-hidden="true" className="size-4 text-primary-blue" />
						<span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
						<span className="text-xs text-slate-500">{(file.size / 1048576).toFixed(1)} MB</span>
					</div>
				) : null}
				<div className="flex flex-wrap gap-2">
					<Button variant="brand" onClick={() => ref.current?.click()} className="gap-2">
						{file ? 'Choose a different file' : 'Choose file'}
					</Button>
					<Button
						variant="outline"
						disabled={!file || pending}
						onClick={() => {
							if (!file) return;
							const form = new FormData();
							form.set('file', file);
							startTransition(async () => {
								const result = await guestUploadAction(form);
								if (!result.ok) {
									toast.error(result.message);
									return;
								}
								toast.success('Lab report uploaded.');
								router.push(`/guest/${result.data.caseId}?new=1`);
							});
						}}
					>
						{pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
						Upload Result
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

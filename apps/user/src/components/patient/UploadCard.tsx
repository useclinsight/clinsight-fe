'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent } from '@clinsight/ui';

import { uploadLabAction } from '@/actions/patient-data';

export function UploadCard({ compact = false }: { compact?: boolean }) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [pending, startTransition] = useTransition();

	const submit = () => {
		if (!file) return;
		const formData = new FormData();
		formData.set('file', file);
		startTransition(async () => {
			const result = await uploadLabAction(formData);
			if (!result.ok) {
				toast.error(result.message);
				return;
			}
			toast.success('Lab report uploaded. We are preparing your interpretation.');
			router.push(`/insights/${result.data.caseId}?new=1`);
		});
	};

	return (
		<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
			<CardContent className="space-y-4 p-5 sm:p-6">
				<div className="flex items-start gap-3.5">
					<span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-subtle text-primary-blue">
						<UploadCloud aria-hidden="true" className="size-5" />
					</span>
					<div className="min-w-0">
						<h2 className="text-[17px] font-semibold text-gray-900">
							{compact ? 'Upload your result' : 'Upload a lab report'}
						</h2>
						<p className="mt-1 text-sm text-slate-600">
							{compact
								? 'Upload your lab report to get started'
								: 'Get a plain-English interpretation of your lab results.'}
						</p>
						<p className="mt-1 text-xs text-slate-500">JPEG, PDF and PNG formats up to 10MB</p>
					</div>
				</div>

				<input
					ref={inputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp,application/pdf"
					className="sr-only"
					aria-label="Choose a lab report file"
					onChange={(event) => setFile(event.target.files?.[0] ?? null)}
				/>

				{file ? (
					<div className="flex items-center gap-2 rounded-lg border border-outline-border bg-slate-50 px-3 py-2.5">
						<FileText aria-hidden="true" className="size-4 shrink-0 text-primary-blue" />
						<span className="min-w-0 flex-1 truncate text-sm text-gray-800">{file.name}</span>
						<span className="shrink-0 text-xs text-slate-500">
							{(file.size / 1024 / 1024).toFixed(1)} MB
						</span>
					</div>
				) : null}

				<div className="flex flex-wrap gap-2">
					<Button
						variant="brand"
						onClick={() => inputRef.current?.click()}
						disabled={pending}
						className="gap-2"
					>
						{file ? 'Choose a different file' : 'Choose file'}
					</Button>
					<Button variant="outline" onClick={submit} disabled={!file || pending} className="gap-2">
						{pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
						{pending ? 'Uploading…' : 'Upload Result'}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

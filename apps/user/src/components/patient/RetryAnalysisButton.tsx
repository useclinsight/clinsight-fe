'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { retryAnalysisAction } from '@/actions/patient-data';
import { Button } from '@clinsight/ui';

export function RetryAnalysisButton({ caseId, labResultId }: { caseId: string; labResultId: string }) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	return (
		<Button
			size="sm"
			variant="brand"
			disabled={pending}
			className="gap-2"
			onClick={() =>
				startTransition(async () => {
					const result = await retryAnalysisAction(caseId, labResultId);
					if (!result.ok) {
						toast.error(result.message);
						return;
					}
					toast.success('Analysis restarted. We’ll refresh your results shortly.');
					router.refresh();
				})
			}
		>
			<RotateCcw aria-hidden="true" className={pending ? 'size-4 animate-spin' : 'size-4'} />
			Retry analysis
		</Button>
	);
}

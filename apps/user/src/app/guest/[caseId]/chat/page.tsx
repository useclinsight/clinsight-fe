import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@clinsight/ui';

import { GuestChat } from '@/components/patient/GuestChat';
import { getGuestId, guestApi } from '@/lib/patient-guest';

export default async function GuestChatPage({ params }: { params: Promise<{ caseId: string }> }) {
  if (!(await getGuestId())) redirect('/guest');

  const { caseId } = await params;
  const reportPath = `/guest/${encodeURIComponent(caseId)}`;
  const result = await guestApi.caseFull(caseId);
  const review = result.ok ? result.data.interpretation : null;
  if (!result.ok || review?.status !== 'complete' || !review.summary?.trim()) redirect(reportPath);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-5 py-8 sm:py-10">
      <header>
        <Link href={reportPath} className="text-sm font-medium text-primary-blue underline">
          Back to lab report
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{result.data.case.title ?? 'Lab report'}</h1>
      </header>

      <GuestChat
        caseId={caseId}
        messages={result.data.chats}
        questions={review.suggested_questions ?? []}
        summary={review.summary}
      />

      <section className="space-y-3 rounded-xl border border-outline-border bg-white p-5">
        <h2 className="font-semibold">Save your review</h2>
        <p className="text-sm text-slate-600">
          Create an account to keep this report and continue your conversation.
        </p>
        <Button asChild variant="brand">
          <Link href="/signup?guest=1">Create account</Link>
        </Button>
      </section>
    </main>
  );
}

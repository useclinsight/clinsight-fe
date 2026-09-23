import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function GuideThankYouPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Your guide is ready</h1>
      <p className="mt-3 text-slate-600">
        Thanks for your interest in understanding your lab results.
      </p>
      <Link
        className="mt-6 rounded-xl bg-primary-blue px-5 py-3 font-semibold text-white"
        href="/guides/5-lab-values-every-nigerian-should-understand.pdf"
      >
        Download the free guide
      </Link>
    </section>
  );
}

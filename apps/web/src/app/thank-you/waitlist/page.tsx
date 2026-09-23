import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function WaitlistThankYouPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">You&apos;re on the waitlist</h1>
      <p className="mt-3 text-slate-600">We&apos;ll let you know when early access is available.</p>
      <Link className="mt-6 font-semibold text-primary-blue underline" href="/">
        Return home
      </Link>
    </section>
  );
}

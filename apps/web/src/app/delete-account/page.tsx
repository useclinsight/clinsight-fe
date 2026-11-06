// app/delete-account/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'Delete Account',
  'Learn how to request deletion of your Clinsight account and associated personal data.',
  '/delete-account',
);

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-[#F6FAFF] text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="relative h-8 w-30 lg:h-10 lg:w-35">
              <Image
                src="/assets/header-assets/clinsight-logo.svg"
                alt="Clinsight Logo"
                fill
                sizes="(max-width: 1024px) 120px, 140px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#0B5ED7]/20 px-5 py-2 text-sm font-medium text-[#0B5ED7] transition hover:bg-[#0B5ED7] hover:text-white"
          >
            Back home
          </Link>
        </header>

        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#0B5ED7]">
            Privacy & Data Control
          </p>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Delete Your ClinSight Account & Data
          </h1>

          <p className="mb-8 text-base leading-7 text-slate-600">
            At ClinSight, we respect your privacy and your right to control your personal
            information. This page explains how you can request deletion of your ClinSight account
            and the personal data associated with it.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-950">
                How to Request Account Deletion
              </h2>

              <p className="leading-7 text-slate-600">
                To request deletion of your account and associated data, please email us at{' '}
                <a
                  href="mailto:support@clinsight.com?subject=Delete My Account"
                  className="font-semibold text-[#0B5ED7] underline-offset-4 hover:underline"
                >
                  clinsightai@gmail.com
                </a>{' '}
                with the subject line{' '}
                <span className="font-semibold text-slate-900">“Delete My Account”</span>.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                For security purposes, please send the request using the email address linked to
                your ClinSight account so we can verify your identity.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-950">
                Data That Will Be Deleted
              </h2>

              <ul className="list-inside list-disc space-y-2 text-slate-600">
                <li>Account profile information</li>
                <li>Uploaded laboratory reports and medical documents</li>
                <li>AI-generated interpretations and insights</li>
                <li>Chat or support history linked to your account</li>
                <li>Saved preferences and account settings</li>
                <li>Usage data directly linked to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-950">Data We May Retain</h2>

              <p className="leading-7 text-slate-600">
                We may retain limited information where required for legal, security,
                fraud-prevention, financial, or regulatory compliance reasons. Any retained data is
                stored securely and kept only for as long as necessary.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-950">Processing Time</h2>

              <p className="leading-7 text-slate-600">
                We aim to process verified deletion requests within{' '}
                <span className="font-semibold text-slate-900">30 days</span>. Once your account and
                data have been deleted, we will send you an email confirmation.
              </p>
            </section>
          </div>

          <div className="mt-10 rounded-2xl bg-[#EAF3FF] p-5">
            <h3 className="mb-2 font-semibold text-slate-950">Need help?</h3>
            <p className="text-sm leading-6 text-slate-600">
              For questions about account deletion or data privacy, contact us at{' '}
              <a
                href="mailto:support@clinsight.com"
                className="font-semibold text-[#0B5ED7] underline-offset-4 hover:underline"
              >
                clinsightai@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

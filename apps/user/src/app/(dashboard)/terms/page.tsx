import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Terms · Clinsight' };

const sections = [
	{
		id: 'introduction',
		title: 'Introduction',
		body: [
			'These Terms and Conditions govern your access to and use of our platform. By using our services, you agree to comply with these terms.',
		],
	},
	{
		id: 'use-of-the-service',
		title: 'Use of the Service',
		body: ['By using our services, you agree to comply with these terms.'],
	},
	{
		id: 'medical-disclaimer',
		title: 'Medical Disclaimer',
		body: ['Clinsight provides AI-powered explanations, not medical diagnoses.'],
	},
	{
		id: 'user-responsibilities',
		title: 'User Responsibilities',
		body: [
			'You are responsible for Ensuring the accuracy of the information you provide Using the platform responsibly',
		],
	},
	{
		id: 'payments',
		title: 'Payments',
		body: [
			'Some features (e.g., doctor consultations) require payment. Payments are processed through secure third-party providers Fees are clearly displayed before payment Refund policies (if any) will be communicated within the platform',
		],
	},
	{
		id: 'limitation-of-liability',
		title: 'Limitation of Liability',
		body: [
			'We are not liable for: Outcomes of doctor consultations Decisions made based on AI interpretations Refund policies (if any) will be communicated within the platform',
		],
	},
	{
		id: 'termination',
		title: 'Termination',
		body: [
			'We reserve the right to suspend or terminate access if: You violate these terms You misuse the platform',
		],
	},
	{
		id: 'changes-to-terms',
		title: 'Changes to Terms',
		body: [
			'We may update these Terms of Use from time to time. Continued use of the platform means you accept any updates',
		],
	},
];

export default function TermsPage() {
	return (
		<article aria-labelledby="terms-heading" className="mx-auto max-w-3xl space-y-6">
			<Link
				href="/profile"
				className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-600 hover:text-gray-900"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Back to profile
			</Link>
			<header className="space-y-1">
				<h1 id="terms-heading" className="text-2xl font-bold tracking-tight text-gray-900">
					Terms and Conditions
				</h1>
				<p className="text-sm text-slate-600">Last Updated, May 2026</p>
			</header>
			<div className="space-y-6">
				{sections.map((section) => (
					<section key={section.id} aria-labelledby={`terms-${section.id}`}>
						<h2
							id={`terms-${section.id}`}
							className="text-lg font-semibold text-gray-900"
						>
							{section.title}
						</h2>
						{section.body.map((paragraph) => (
							<p key={paragraph} className="mt-2 text-sm leading-relaxed text-slate-600">
								{paragraph}
							</p>
						))}
					</section>
				))}
				<section aria-labelledby="terms-contact">
					<h2 id="terms-contact" className="text-lg font-semibold text-gray-900">
						Contact Us
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-slate-600">
						If you have any questions or concerns about these Terms, you can reach us at: Email:{' '}
						<a className="text-[#1565c0] underline" href="mailto:support@clinsight.com">
							support@clinsight.com
						</a>
					</p>
				</section>
			</div>
		</article>
	);
}

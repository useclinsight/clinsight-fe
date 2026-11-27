import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy · Clinsight' };

export default function PrivacyPage() {
	return (
		<article aria-labelledby="privacy-heading" className="mx-auto max-w-3xl space-y-6">
			<Link
				href="/profile"
				className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-600 hover:text-gray-900"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Back to profile
			</Link>
			<header className="space-y-1">
				<h1 id="privacy-heading" className="text-2xl font-bold tracking-tight text-gray-900">
					Privacy Policy
				</h1>
				<p className="text-sm text-slate-600">Last Updated, May 2026</p>
			</header>

			<section aria-labelledby="privacy-introduction">
				<h2 id="privacy-introduction" className="text-lg font-semibold text-gray-900">
					Introduction
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					This Privacy Policy describes Our policies and procedures on the collection, use and
					disclosure of Your information when You use the Service and tells You about Your privacy
					rights and how the law protects You. We use Your Personal Data to provide and improve the
					Service. By using the Service, You agree to the collection and use of information in
					accordance with this Privacy Policy.
				</p>
			</section>

			<section aria-labelledby="privacy-collection">
				<h2 id="privacy-collection" className="text-lg font-semibold text-gray-900">
					Data Collection
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					We collect different types of information to provide and improve our services:
				</p>
				<dl className="mt-3 grid gap-3 text-sm text-slate-600">
					<div>
						<dt className="font-semibold text-gray-900">Personal Information</dt>
						<dd>Name, Email address, Address</dd>
					</div>
					<div>
						<dt className="font-semibold text-gray-900">Health Information</dt>
						<dd>
							Lab test results (uploaded files), Extracted medical data (e.g., HbA1c, glucose
							levels), Information shared during consultations (messages, symptoms)
						</dd>
					</div>
					<div>
						<dt className="font-semibold text-gray-900">Usage Data</dt>
						<dd>Device type, Browser type, Pages visited and interactions</dd>
					</div>
				</dl>
			</section>

			<section aria-labelledby="privacy-uses">
				<h2 id="privacy-uses" className="text-lg font-semibold text-gray-900">
					Uses of Data
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">We use your information to:</p>
				<ul role="list" className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
					<li>Analyze and interpret your lab results using AI</li>
					<li>Connect you with verified doctors for consultations</li>
					<li>Provide personalized health insights and recommendations</li>
					<li>Improve system performance and accuracy</li>
					<li>Send important updates and notifications</li>
				</ul>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					We only use your data for purposes directly related to providing our services.
				</p>
			</section>

			<section aria-labelledby="privacy-cookies">
				<h2 id="privacy-cookies" className="text-lg font-semibold text-gray-900">
					Cookies
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					We use cookies and similar technologies to: Enhance your experience on our platform
					Remember your preferences Analyse how users interact with our services You can choose to
					disable cookies through your browser settings, but this may affect some features of the
					platform.
				</p>
			</section>

			<section aria-labelledby="privacy-rights">
				<h2 id="privacy-rights" className="text-lg font-semibold text-gray-900">
					Your Rights
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					You have the right to:
				</p>
				<ul role="list" className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600">
					<li>Access your personal data</li>
					<li>Request correction of inaccurate information</li>
					<li>Request deletion of your data</li>
					<li>Withdraw consent for data processing</li>
				</ul>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					If you would like to exercise any of these rights, please contact us.
				</p>
			</section>

			<section aria-labelledby="privacy-contact">
				<h2 id="privacy-contact" className="text-lg font-semibold text-gray-900">
					Contact Us
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-slate-600">
					If you have any questions or concerns about this Privacy Policy, you can reach us at:
					Email:{' '}
					<a className="text-[#1565c0] underline" href="mailto:support@clinsight.com">
						support@clinsight.com
					</a>
				</p>
			</section>
		</article>
	);
}

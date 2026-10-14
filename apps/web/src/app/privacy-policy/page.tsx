import PrivacyPolicyContent from './privacy-policy-content';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'Privacy Policy',
  'Read how Clinsight collects, uses, and protects information for lab insights and doctor consultations.',
  '/privacy-policy',
);

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}

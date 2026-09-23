import { pageMetadata } from '@/lib/pageMetadata';
import TermsContent from './terms-content';

export const metadata = pageMetadata(
  'Terms and Conditions — Clinsight',
  'Read the terms and conditions for using Clinsight.',
  '/terms-and-conditions',
);

export default function TermsAndConditions() {
  return <TermsContent />;
}

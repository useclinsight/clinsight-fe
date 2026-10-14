import SignupContent from './signup-content';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'Sign up — Clinsight',
  'Create a Clinsight account to get personalized lab insights.',
  '/signup',
);

export default function SignupPage() {
  return <SignupContent />;
}

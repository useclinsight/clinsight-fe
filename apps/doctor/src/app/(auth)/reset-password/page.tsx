import { pageMetadata } from '@/lib/pageMetadata';
import ResetPasswordContent from './reset-password-content';

export const metadata = pageMetadata(
  'Reset Password — Clinsight',
  'Reset your Clinsight account password by entering your email address.',
  '/reset-password',
);

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}

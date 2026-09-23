import { pageMetadata } from '@/lib/pageMetadata';
import ForgotPasswordContent from './forgot-password-content';

export const metadata = pageMetadata(
  'Forgot Password — Clinsight',
  'Reset your Clinsight account password by entering your email address and verifying the OTP sent to you.',
  '/forgot-password',
);

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}

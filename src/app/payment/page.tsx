import { pageMetadata } from '@/lib/pageMetadata';
import PaymentContent from './payment-content';

export const metadata = pageMetadata(
  'Payment — Clinsight',
  'Complete your payment to access personalized lab insights and doctor consultations.',
  '/payment',
);

export default function PaymentPage() {
  return <PaymentContent />;
}

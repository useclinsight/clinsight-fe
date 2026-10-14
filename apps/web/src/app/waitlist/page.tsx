import { WaitlistForm } from '@/components/waitlist/waitlist-form';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'Join the waitlist — Clinsight',
  'Sign up to be notified when Clinsight launches.',
  '/waitlist',
);

export default function WaitlistPage() {
  return (
    <div className="bg-white">
      <WaitlistForm />
    </div>
  );
}

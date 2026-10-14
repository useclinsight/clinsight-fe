import FAQHeader from '@/components/faqs/FAQHeader';
import { MedicalProfessional } from '@/components/faqs/MedicalProfessional';
import { FAQ } from '@/components/landing-page/FAQ';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'FAQs',
  'Answers to common questions about Clinsight, lab-result insights, and doctor review.',
  '/faqs',
);

export default function Page() {
  return (
    <div>
      <FAQHeader />

      <FAQ />
      <MedicalProfessional />
    </div>
  );
}

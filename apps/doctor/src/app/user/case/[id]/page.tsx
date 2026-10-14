import CaseScreen from '@/components/doctor/case/CaseScreen';
import { getCaseById } from '@/services/doctor';
import { notFound } from 'next/navigation';

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseData = await getCaseById(id);

  if (!caseData) {
    notFound();
  }

  return <CaseScreen caseData={caseData} />;
}

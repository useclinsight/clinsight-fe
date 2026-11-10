import { notFound } from 'next/navigation';
import CaseScreen from '@/components/doctor/case/CaseScreen';
import { mapApiDetailToCaseData } from '@/lib/cases-utils';
import { fetchCaseFullDetail } from '@/services/doctor';

export const dynamic = 'force-dynamic';

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await fetchCaseFullDetail(id);

  if (!detail || !detail.case) {
    notFound();
  }

  const caseData = mapApiDetailToCaseData(detail);

  return <CaseScreen caseData={caseData} />;
}

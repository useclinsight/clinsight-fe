import CaseScreen from '@/components/doctor/case/CaseScreen';
import {
  buildDemoCaseList,
  resolveCaseDetail,
  type CaseDetailData,
  type CaseListItem,
} from '@/lib/cases-utils';
import casesMock from '@/mocks/doctor/cases.json';
import { notFound } from 'next/navigation';

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseData = resolveCaseDetail(
    id,
    buildDemoCaseList(casesMock.list as CaseListItem[]),
    casesMock.details as Record<string, CaseDetailData>,
  );

  if (!caseData) {
    notFound();
  }

  return <CaseScreen caseData={caseData} />;
}

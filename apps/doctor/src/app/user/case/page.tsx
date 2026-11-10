import CaseList from '@/components/doctor/case/CaseList';
import { mapApiCaseToListItem, type CaseListItem } from '@/lib/cases-utils';
import { fetchDoctorCases } from '@/services/doctor';

export const dynamic = 'force-dynamic';

export default async function CaseListPage() {
  const casePage = await fetchDoctorCases();
  const cases: CaseListItem[] = (casePage?.items || []).map(mapApiCaseToListItem);

  return (
    <div className="flex flex-col gap-5 pt-2.5 pb-10 px-2.5 max-w-6xl">
      <CaseList cases={cases} />
    </div>
  );
}

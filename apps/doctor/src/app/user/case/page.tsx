import CaseList from '@/components/doctor/case/CaseList';
import { buildDemoCaseList, type CaseListItem } from '@/lib/cases-utils';
import casesMock from '@/mocks/doctor/cases.json';

export default function CaseListPage() {
  const cases = buildDemoCaseList(casesMock.list as CaseListItem[]);

  return (
    <div className="flex flex-col gap-5 pt-2.5 pb-10 px-2.5 max-w-6xl">
      <CaseList cases={cases} />
    </div>
  );
}

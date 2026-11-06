import CaseList from '@/components/doctor/case/CaseList';
import { getOverview, Overview } from '@/services/doctor';

export default async function CaseListPage() {
  const overview = (await getOverview()) as Overview;

  return (
    <div className="flex flex-col gap-5 pt-2.5 pb-10 px-2.5">
      <CaseList cases={overview.cases} />
    </div>
  );
}

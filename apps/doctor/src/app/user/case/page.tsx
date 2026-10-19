import CaseList from '@/components/doctor/case/CaseList';
import { getOverview, Overview } from '@/services/doctor';

export default async function CaseListPage() {
  const overview = (await getOverview()) as Overview;

  return (
    <div className="w-full max-w-7xl px-2.5 pb-10 pt-2.5">
      <CaseList cases={overview.cases} />
    </div>
  );
}

import { OverviewDashboard } from '@/components/doctor/overview';
import { getOverview, Overview } from '@/services/doctor';

export default async function OverviewPage() {
  const overview = await getOverview();

  return <OverviewDashboard overview={overview as Overview} />;
}

import { Card, CardContent, CardHeader } from '@clinsight/ui';
import { getPatientSession } from '@/lib/patient-session';

export default async function UserOverviewPage() {
  const session = await getPatientSession();
  if (session.status !== 'ok') return null;

  return (
    <Card className="max-w-xl border-slate-200 shadow-sm">
      <CardHeader>
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          Welcome, {session.patient.first_name}
        </h1>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">You’re signed in to your Clinsight patient account.</p>
      </CardContent>
    </Card>
  );
}

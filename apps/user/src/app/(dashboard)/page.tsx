import { Card, CardContent } from '@clinsight/ui';
import { Check } from 'lucide-react';
import { getPatientSession } from '@/lib/patient-session';

export default async function UserOverviewPage() {
  const session = await getPatientSession();
  if (session.status !== 'ok') return null;

  return (
    <Card className="max-w-135 rounded-[14px] border-gray-200 shadow-none">
      <CardContent className="flex items-start gap-3.5 p-4 sm:p-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-subtle text-primary-blue">
          <Check aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="text-[17px] font-semibold text-gray-900">Your patient portal</h2>
          <p className="mt-1 text-sm text-slate-600">
            You’re signed in to your Clinsight patient account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

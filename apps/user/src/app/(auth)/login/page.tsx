import { Card, CardContent, CardDescription, CardHeader } from '@clinsight/ui';
import { PatientSignInForm } from '@/components/PatientSignInForm';

export default async function UserLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ signout?: string }>;
}) {
  const { signout } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="text-2xl font-bold text-[#1565c0]">Clinsight</div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">
            Sign in to your patient portal
          </h1>
          <CardDescription>
            Use the email address and password for your Clinsight patient account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {signout === 'local' && (
            <p role="status" className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
              You signed out of this browser. We couldn’t confirm that the server session ended.
            </p>
          )}
          <PatientSignInForm />
        </CardContent>
      </Card>
    </main>
  );
}

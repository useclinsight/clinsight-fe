'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@clinsight/ui';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        toast.error(data.message ?? 'Unable to sign in.');
        return;
      }
      toast.success('Signed in to the admin portal.');
      router.replace(searchParams.get('next') || '/');
      router.refresh();
    } catch {
      toast.error('Unable to reach the authentication service.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <Card className="w-full max-w-md border-slate-800 bg-slate-950 text-white shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl text-white">Admin Authorization</CardTitle>
          <CardDescription className="text-slate-400">
            Secure administrative access for Clinsight operators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="text-xs font-medium text-slate-300" htmlFor="email">
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@useclinsight.com"
                className="mt-1 border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300" htmlFor="password">
                Security Key / Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                className="mt-1 border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              disabled={pending}
              className="w-full bg-amber-500 font-semibold text-slate-950 hover:bg-amber-600"
            >
              {pending ? 'Authenticating…' : 'Authenticate'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

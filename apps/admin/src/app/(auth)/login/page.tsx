'use client';

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

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-slate-800 bg-slate-950 text-white">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl text-white">Admin Authorization</CardTitle>
          <CardDescription className="text-slate-400">
            Secure administrative access for Clinsight operators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300">Admin Email</label>
            <Input
              type="email"
              placeholder="admin@useclinsight.com"
              className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300">Security Key / Password</label>
            <Input
              type="password"
              placeholder="••••••••••••"
              className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <Button
            variant="brand"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Authenticate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

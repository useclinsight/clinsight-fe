'use client';

import Link from 'next/link';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@clinsight/ui';

export default function UserLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto mb-2 text-2xl font-bold text-[#1565c0]">Clinsight</div>
          <CardTitle className="text-xl">Sign in to Patient Portal</CardTitle>
          <CardDescription>
            Enter your email and password to access your health portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700">Email Address</label>
            <Input type="email" placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs text-[#1565c0] hover:underline">
                Forgot password?
              </a>
            </div>
            <Input type="password" placeholder="••••••••" className="mt-1" />
          </div>
          <Button
            variant="brand"
            className="w-full"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Sign In
          </Button>
          <div className="text-center text-xs text-gray-500 pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-[#1565c0] hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import DashboardLayout from '@/layout/layout';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const dynamic = 'force-dynamic';

export default function DoctorsDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['doctor']}>
      <DashboardLayout user="Doctor">{children}</DashboardLayout>
    </AuthGuard>
  );
}

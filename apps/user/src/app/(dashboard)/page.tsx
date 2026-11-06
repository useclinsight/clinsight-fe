import Link from 'next/link';
import { CalendarCheck, FileText, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@clinsight/ui';

export default function UserOverviewPage() {
  const stats = [
    {
      label: 'Upcoming Consultations',
      value: '1',
      icon: CalendarCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Lab Records Explained',
      value: '4',
      icon: FileText,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Active Care Plans',
      value: '2',
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    { label: 'Pending Reviews', value: '1', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ];

  const upcomingConsultations = [
    {
      id: 'c1',
      doctor: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      date: 'Tomorrow, Sep 24',
      time: '10:30 AM',
      type: 'Follow-up on Lipid Panel',
    },
  ];

  const recentRecords = [
    {
      id: 'r1',
      title: 'Comprehensive Metabolic Panel (CMP)',
      doctor: 'Dr. Sarah Jenkins',
      date: 'Sep 18, 2026',
      status: 'Explained & Verified',
      statusVariant: 'success' as const,
    },
    {
      id: 'r2',
      title: 'Complete Blood Count (CBC)',
      doctor: 'Dr. Robert Chen',
      date: 'Aug 30, 2026',
      status: 'Reviewed',
      statusVariant: 'info' as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back, John!</h2>
        <p className="text-sm text-gray-500 mt-1">
          Here is a quick overview of your health insights and upcoming consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Upcoming Consultation</CardTitle>
            <Link
              href="/consultations"
              className="text-xs font-semibold text-[#1565c0] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {upcomingConsultations.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.doctor}</h4>
                    <p className="text-xs text-gray-500">{item.specialty}</p>
                  </div>
                  <Badge variant="default" className="bg-blue-600 text-white">
                    Upcoming
                  </Badge>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.date} at {item.time}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="brand" className="w-full">
                    Join Video Call
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Lab Reports</CardTitle>
            <Link
              href="/records"
              className="text-xs font-semibold text-[#1565c0] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-gray-900">{record.title}</h4>
                  <p className="text-xs text-gray-500">
                    Ordered by {record.doctor} • {record.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={record.statusVariant}>{record.status}</Badge>
                  <Link href={`/records`}>
                    <Button size="xs" variant="outline">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

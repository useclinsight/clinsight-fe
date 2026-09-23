import Link from 'next/link';
import { Stethoscope, Users, FileCheck2, DollarSign, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@clinsight/ui';

export default function AdminOverviewPage() {
  const metrics = [
    {
      label: 'Total Doctors',
      value: '142',
      subtext: '+12 this month',
      icon: Stethoscope,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Active Patients',
      value: '3,840',
      subtext: '+18% growth',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Pending Verifications',
      value: '8',
      subtext: 'Action required',
      icon: FileCheck2,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Platform Revenue',
      value: '$48,250',
      subtext: 'Sep 2026',
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const pendingDoctors = [
    {
      id: 'v1',
      name: 'Dr. Michael Chang',
      email: 'm.chang@hospital.org',
      license: 'MD-849204',
      specialty: 'Internal Medicine',
      submittedAt: 'Today, 2:15 PM',
    },
    {
      id: 'v2',
      name: 'Dr. Allison Green',
      email: 'allison.green@clinic.com',
      license: 'NY-729103',
      specialty: 'Cardiology',
      submittedAt: 'Yesterday',
    },
    {
      id: 'v3',
      name: 'Dr. Marcus Vance',
      email: 'm.vance@healthmed.net',
      license: 'CA-993821',
      specialty: 'Pathology',
      submittedAt: 'Sep 21, 2026',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admin Control Center</h2>
        <p className="text-sm text-gray-500 mt-1">
          Platform overview, credential review queues, and system activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl p-3 ${m.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{m.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.subtext}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Doctor Credential Verification Queue
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Doctors awaiting credential approval to practice on Clinsight.
            </p>
          </div>
          <Link href="/verifications">
            <Button size="sm" variant="outline" className="gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>License #</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDoctors.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium text-gray-900">
                    <div>
                      <p>{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{doc.specialty}</TableCell>
                  <TableCell className="font-mono text-xs">{doc.license}</TableCell>
                  <TableCell className="text-gray-500">{doc.submittedAt}</TableCell>
                  <TableCell>
                    <Badge variant="warning">Pending Review</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="xs" variant="brand">
                      Approve
                    </Button>
                    <Button size="xs" variant="outline">
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

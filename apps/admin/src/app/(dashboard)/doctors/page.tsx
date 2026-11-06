import {
  Button,
  Card,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Input,
} from '@clinsight/ui';

export default function AdminDoctorsDirectoryPage() {
  const doctors = [
    {
      id: 'doc-1',
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@clinsight.com',
      specialty: 'Cardiology',
      license: 'MD-192837',
      status: 'Active',
      statusVariant: 'success' as const,
      completedReviews: 124,
      joinedAt: 'Jan 15, 2026',
    },
    {
      id: 'doc-2',
      name: 'Dr. Robert Chen',
      email: 'r.chen@clinsight.com',
      specialty: 'General Practice',
      license: 'CA-449102',
      status: 'Active',
      statusVariant: 'success' as const,
      completedReviews: 89,
      joinedAt: 'Feb 02, 2026',
    },
    {
      id: 'doc-3',
      name: 'Dr. Emily Watson',
      email: 'e.watson@clinsight.com',
      specialty: 'Endocrinology',
      license: 'NY-882910',
      status: 'On Leave',
      statusVariant: 'warning' as const,
      completedReviews: 45,
      joinedAt: 'Mar 10, 2026',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Registered Doctors</h2>
          <p className="text-sm text-gray-500">
            Directory of approved and verified clinicians on the Clinsight platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search doctor by name or specialty..." className="w-64" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>License #</TableHead>
                <TableHead>Reviews Done</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium text-gray-900">
                    <div>
                      <p>{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{doc.specialty}</TableCell>
                  <TableCell className="font-mono text-xs">{doc.license}</TableCell>
                  <TableCell>{doc.completedReviews}</TableCell>
                  <TableCell className="text-gray-500">{doc.joinedAt}</TableCell>
                  <TableCell>
                    <Badge variant={doc.statusVariant}>{doc.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="xs" variant="outline">
                      Manage
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

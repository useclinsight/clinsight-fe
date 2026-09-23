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

export default function AdminUsersPage() {
  const users = [
    {
      id: 'usr-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      labTestsCount: 4,
      consultationsCount: 2,
      status: 'Active',
      joinedAt: 'Jul 12, 2026',
    },
    {
      id: 'usr-2',
      name: 'Maria Garcia',
      email: 'm.garcia@example.com',
      labTestsCount: 7,
      consultationsCount: 5,
      status: 'Active',
      joinedAt: 'Jun 28, 2026',
    },
    {
      id: 'usr-3',
      name: 'David Smith',
      email: 'dsmith99@example.com',
      labTestsCount: 1,
      consultationsCount: 1,
      status: 'Active',
      joinedAt: 'Aug 04, 2026',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Patient Directory</h2>
          <p className="text-sm text-gray-500">
            Registered patients utilizing Clinsight for diagnostic summaries and consultations.
          </p>
        </div>
        <Input placeholder="Search patient by name or email..." className="w-64" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Lab Tests Uploaded</TableHead>
                <TableHead>Consultations</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium text-gray-900">
                    <div>
                      <p>{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{u.labTestsCount}</TableCell>
                  <TableCell>{u.consultationsCount}</TableCell>
                  <TableCell className="text-gray-500">{u.joinedAt}</TableCell>
                  <TableCell>
                    <Badge variant="success">{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="xs" variant="outline">
                      View Profile
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

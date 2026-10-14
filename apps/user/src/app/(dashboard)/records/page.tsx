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
} from '@clinsight/ui';
import { UploadCloud, FileText, Download, Eye } from 'lucide-react';

export default function LabRecordsPage() {
  const records = [
    {
      id: 'REC-001',
      name: 'Comprehensive Metabolic Panel (CMP)',
      category: 'Blood Chemistry',
      date: 'Sep 18, 2026',
      doctor: 'Dr. Sarah Jenkins',
      status: 'Verified by Doctor',
    },
    {
      id: 'REC-002',
      name: 'Lipid Panel',
      category: 'Cholesterol & Lipids',
      date: 'Sep 18, 2026',
      doctor: 'Dr. Sarah Jenkins',
      status: 'Verified by Doctor',
    },
    {
      id: 'REC-003',
      name: 'Thyroid Stimulating Hormone (TSH)',
      category: 'Endocrinology',
      date: 'Aug 14, 2026',
      doctor: 'Dr. Emily Watson',
      status: 'AI Summary Ready',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Lab Records & Results</h2>
          <p className="text-sm text-gray-500">
            Upload lab reports for instant AI-powered plain English explanations and doctor
            validation.
          </p>
        </div>
        <Button variant="brand" className="gap-2">
          <UploadCloud className="h-4 w-4" /> Upload Lab Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test / Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Uploaded</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#1565c0]" />
                      {r.name}
                    </div>
                  </TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell className="text-gray-500">{r.date}</TableCell>
                  <TableCell>{r.doctor}</TableCell>
                  <TableCell>
                    <Badge variant="success">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="xs" variant="outline" className="gap-1">
                      <Eye className="h-3 w-3" /> View Summary
                    </Button>
                    <Button size="xs" variant="ghost">
                      <Download className="h-3 w-3" />
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

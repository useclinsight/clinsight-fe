import Link from 'next/link';
import { Badge, Card, CardContent } from '@clinsight/ui';
import { ExternalLink } from 'lucide-react';

import { VerificationActions } from '@/components/VerificationActions';
import { adminFetch } from '@/lib/admin-api';

type VerificationDocument = {
  id: string;
  document_type: string;
  filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
};

type VerificationRequest = {
  id: string;
  doctor_name: string;
  doctor_email: string;
  license_number: string;
  issuing_state: string;
  license_expiry_date: string;
  specialty: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  document_count: number;
  documents: VerificationDocument[];
};

const FILTERS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default async function DoctorVerificationsQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: requestedStatus } = await searchParams;
  const status = FILTERS.some((filter) => filter.value === requestedStatus)
    ? requestedStatus!
    : 'pending';

  let requests: VerificationRequest[] = [];
  let total = 0;
  let errorMessage = '';
  try {
    const response = await adminFetch(
      `/api/v1/admin/doctor-requests?status=${status}&limit=100`,
    );
    const payload = (await response.json()) as {
      status?: string;
      message?: string;
      data?: { items: VerificationRequest[]; total: number };
    };
    if (!response.ok || !payload.data) {
      errorMessage = payload.message ?? 'Unable to load doctor requests.';
    } else {
      requests = payload.data.items;
      total = payload.data.total;
    }
  } catch {
    errorMessage = 'Unable to reach the API.';
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Doctor Credential Verification Queue
        </h2>
        <p className="text-sm text-gray-500">
          Review submitted medical licenses, government IDs, and board certifications before
          granting platform privileges.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={`/verifications?status=${filter.value}`}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              status === filter.value
                ? 'bg-[#1565c0] text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </Link>
        ))}
        <span className="self-center text-xs text-gray-500">{total} request{total === 1 ? '' : 's'}</span>
      </div>

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-5 text-sm text-red-700">{errorMessage}</CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-gray-500">
            No {status} doctor requests found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.doctor_name}</h3>
                      <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'destructive' : 'warning'}>
                        {status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {item.doctor_email} • {item.specialty}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-1">
                      <div>
                        <span className="font-semibold text-gray-800">License: </span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">
                          {item.license_number} ({item.issuing_state})
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Expires: </span>
                        <span>{new Date(item.license_expiry_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Submitted: </span>
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    {item.rejection_reason ? (
                      <p className="text-xs text-red-700">Reason: {item.rejection_reason}</p>
                    ) : null}
                    <div className="pt-2">
                      <p className="mb-1.5 text-xs font-semibold text-gray-700">Submitted Credentials:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.documents.length === 0 ? (
                          <span className="text-xs text-gray-400">No documents attached.</span>
                        ) : (
                          item.documents.map((document) => (
                            <a
                              key={document.id}
                              href={`/api/admin/documents/${document.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                            >
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                              {document.filename || document.document_type}
                            </a>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  {status === 'pending' ? (
                    <VerificationActions id={item.id} name={item.doctor_name} />
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

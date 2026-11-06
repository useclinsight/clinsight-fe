import { Button, Card, CardContent, Badge } from '@clinsight/ui';
import { Check, X, ExternalLink } from 'lucide-react';

export default function DoctorVerificationsQueuePage() {
  const queue = [
    {
      id: 'v-101',
      name: 'Dr. Michael Chang',
      email: 'm.chang@hospital.org',
      license: 'MD-849204',
      issuingState: 'California',
      specialty: 'Internal Medicine',
      experienceYears: '11 years',
      documents: ['Medical_License.pdf', 'Board_Certification.pdf', 'Gov_ID.png'],
      submittedAt: 'Today, 2:15 PM',
    },
    {
      id: 'v-102',
      name: 'Dr. Allison Green',
      email: 'allison.green@clinic.com',
      license: 'NY-729103',
      issuingState: 'New York',
      specialty: 'Cardiology',
      experienceYears: '8 years',
      documents: ['NY_State_License.pdf', 'DEA_Registration.pdf'],
      submittedAt: 'Yesterday',
    },
    {
      id: 'v-103',
      name: 'Dr. Marcus Vance',
      email: 'm.vance@healthmed.net',
      license: 'CA-993821',
      issuingState: 'California',
      specialty: 'Pathology',
      experienceYears: '15 years',
      documents: ['CA_License.pdf', 'Hospital_Privileges.pdf'],
      submittedAt: 'Sep 21, 2026',
    },
  ];

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

      <div className="space-y-4">
        {queue.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <Badge variant="warning">Pending Review</Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.email} • {item.specialty} ({item.experienceYears})
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-1">
                    <div>
                      <span className="font-semibold text-gray-800">License: </span>
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.license} ({item.issuingState})
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Submitted: </span>
                      <span>{item.submittedAt}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1.5">
                      Submitted Credentials:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.documents.map((doc) => (
                        <button
                          key={doc}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                          {doc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="brand"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="h-4 w-4" /> Approve Doctor
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                  >
                    <X className="h-4 w-4" /> Reject Submission
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

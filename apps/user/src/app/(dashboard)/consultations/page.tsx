import { Button, Card, CardContent, Badge } from '@clinsight/ui';
import { Calendar, Clock, Video, UserPlus } from 'lucide-react';

export default function ConsultationsPage() {
  const consultations = [
    {
      id: 'c-101',
      doctor: 'Dr. Sarah Jenkins',
      specialty: 'Cardiologist',
      date: 'Sep 24, 2026',
      time: '10:30 AM',
      status: 'Upcoming',
      statusVariant: 'default' as const,
      reason: 'Follow-up on Lipid Panel & Consultation Review',
    },
    {
      id: 'c-102',
      doctor: 'Dr. Robert Chen',
      specialty: 'General Practitioner',
      date: 'Aug 30, 2026',
      time: '02:00 PM',
      status: 'Completed',
      statusVariant: 'success' as const,
      reason: 'Annual Routine Health Check',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Consultations</h2>
          <p className="text-sm text-gray-500">
            Manage and schedule appointments with certified healthcare providers.
          </p>
        </div>
        <Button variant="brand" className="gap-2">
          <UserPlus className="h-4 w-4" /> Book New Consultation
        </Button>
      </div>

      <div className="space-y-4">
        {consultations.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{c.doctor}</h3>
                  <Badge variant={c.statusVariant}>{c.status}</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {c.specialty} • {c.reason}
                </p>
                <div className="flex items-center gap-4 pt-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" /> {c.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" /> {c.time}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {c.status === 'Upcoming' ? (
                  <>
                    <Button size="sm" variant="brand" className="gap-1.5">
                      <Video className="h-4 w-4" /> Join Session
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline">
                    View Summary
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@clinsight/ui';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Platform Settings & Security
        </h2>
        <p className="text-sm text-gray-500">
          Configure global platform thresholds, API keys, and clinician review policies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health & API Connection</CardTitle>
          <CardDescription>Current status of backend clinical endpoints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Production Clinical API</p>
              <p className="text-xs text-emerald-700">
                https://api.useclinsight.com/api/v1 (Latency: 48ms)
              </p>
            </div>
            <Badge variant="success">Operational</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Vercel Edge Network</p>
              <p className="text-xs text-emerald-700">
                Subdomains connected: admin, doctor, app, web
              </p>
            </div>
            <Badge variant="success">Healthy</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

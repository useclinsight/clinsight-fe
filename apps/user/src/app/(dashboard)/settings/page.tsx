import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
} from '@clinsight/ui';

export default function UserSettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-500">
          Manage your profile, personal medical information, and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your contact details and basic info.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700">First Name</label>
              <Input defaultValue="John" className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Last Name</label>
              <Input defaultValue="Doe" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Email Address</label>
            <Input defaultValue="john.doe@example.com" type="email" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Phone Number</label>
            <Input defaultValue="+1 (555) 234-5678" type="tel" className="mt-1" />
          </div>
          <div className="pt-2">
            <Button variant="brand">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

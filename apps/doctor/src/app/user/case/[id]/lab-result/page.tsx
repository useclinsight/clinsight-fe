import { redirect } from 'next/navigation';

export default async function LabResultPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/user/case/${id}`);
}

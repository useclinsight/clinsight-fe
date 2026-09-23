import DiagnosticReviewScreen from '@/components/doctor/case/diagnostic-review/DiagnosticReviewScreen';

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function DiagnosticReviewPage({ params }: PageProps) {
  const { id } = await params;

  return <DiagnosticReviewScreen caseId={id} />;
}

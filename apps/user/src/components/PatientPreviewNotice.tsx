'use client';

import { usePathname } from 'next/navigation';

const previewPaths = new Set(['/consultations', '/records', '/messages', '/settings']);

export function PatientPreviewNotice() {
  if (!previewPaths.has(usePathname())) return null;

  return (
    <p className="mb-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
      Preview with sample data. This page does not show your personal health information.
    </p>
  );
}

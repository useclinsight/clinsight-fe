export type LabReview =
  | { status: 'empty' | 'failed' | 'unavailable' | 'expired' }
  | { status: 'pending'; phase?: 'reading' | 'explaining' }
  | {
      status: 'ready';
      summary: string | null;
      questions: string[];
      values: {
        metric: string;
        value: string | number;
        unit?: string | null;
        status?: string | null;
      }[];
    };

export const maxLabFileSize = 10 * 1024 * 1024;
export const labFileTypes: Readonly<Record<string, string>> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

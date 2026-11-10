import 'server-only';

import { z } from 'zod';
import { apiBaseUrl } from './patient-auth-api';
import type { LabReview } from './lab-review';

const caseListSchema = z.object({
  data: z.array(z.object({ id: z.uuid(), title: z.string().nullish() })),
});

const reviewSchema = z.object({
  data: z.object({
    case: z.object({ status: z.string() }),
    lab_results: z.array(z.object({ ocr_status: z.string() })).optional(),
    interpretation: z
      .object({
        status: z.string(),
        summary: z.string().nullish(),
        suggested_questions: z.array(z.string()).nullish(),
        value_breakdown: z
          .array(
            z.object({
              metric: z.string(),
              value: z.union([z.string(), z.number()]),
              unit: z.string().nullish(),
              status: z.string().nullish(),
            }),
          )
          .nullish(),
      })
      .nullish(),
  }),
});

type Identity = { guestId: string } | { accessToken: string };
type CaseList =
  | { status: 'ok'; cases: z.infer<typeof caseListSchema>['data'] }
  | { status: 'expired' | 'unavailable' };

export function labApiRequest(path: string, init?: RequestInit) {
  return fetch(apiBaseUrl() + '/api/v1' + path, {
    ...init,
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
  });
}

function identityHeaders(identity: Identity): HeadersInit {
  return 'guestId' in identity
    ? { 'x-guest-session-id': identity.guestId }
    : { Authorization: 'Bearer ' + identity.accessToken };
}

export async function listLabCases(identity: Identity): Promise<CaseList> {
  try {
    const response = await labApiRequest('guestId' in identity ? '/guest/cases' : '/cases', {
      headers: identityHeaders(identity),
    });
    if ([401, 403, 410].includes(response.status)) return { status: 'expired' };
    if (!response.ok) return { status: 'unavailable' };
    const parsed = caseListSchema.safeParse(await response.json());
    return parsed.success ? { status: 'ok', cases: parsed.data.data } : { status: 'unavailable' };
  } catch {
    return { status: 'unavailable' };
  }
}

export async function readLabReview(caseId: string, identity: Identity): Promise<LabReview> {
  if (!z.uuid().safeParse(caseId).success) return { status: 'empty' };

  try {
    const response = await labApiRequest('/cases/' + caseId + '/full', {
      headers: identityHeaders(identity),
    });
    if (response.status === 401 || response.status === 410) return { status: 'expired' };
    if ([403, 404].includes(response.status)) return { status: 'empty' };
    if (!response.ok) return { status: 'unavailable' };
    const parsed = reviewSchema.safeParse(await response.json());
    if (!parsed.success) return { status: 'unavailable' };

    const { case: labCase, lab_results: labs, interpretation } = parsed.data.data;
    if (labCase.status === 'failed' || interpretation?.status === 'failed') {
      return { status: 'failed' };
    }
    if (interpretation && ['complete', 'completed'].includes(interpretation.status)) {
      const summary = interpretation.summary?.trim() || null;
      const values = interpretation.value_breakdown ?? [];
      if (summary || values.length) {
        const questions = [
          ...new Set(
            interpretation.suggested_questions?.map((question) => question.trim()).filter(Boolean),
          ),
        ].slice(0, 4);
        return { status: 'ready', summary, values, questions };
      }
    }
    if (
      interpretation?.status === 'processing' ||
      (labs?.length &&
        labs.every((lab) => lab.ocr_status === 'complete' || lab.ocr_status === 'completed'))
    ) {
      return { status: 'pending', phase: 'explaining' };
    }
    if (labs?.some((lab) => lab.ocr_status === 'processing')) {
      return { status: 'pending', phase: 'reading' };
    }
    return { status: 'pending' };
  } catch {
    return { status: 'unavailable' };
  }
}

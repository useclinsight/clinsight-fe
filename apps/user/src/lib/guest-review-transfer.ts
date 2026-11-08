import type { LabReview } from './lab-review';

export type GuestReviewFile = { file: File; mimeType: string };
type ReadyReview = Extract<LabReview, { status: 'ready' }>;

let queuedFile: GuestReviewFile | undefined;
let queuedReview: ReadyReview | undefined;

// These handoffs only live in the current browser tab, never in a URL or persistent storage.
export function stageGuestReviewFile(file: GuestReviewFile) {
  queuedFile = file;
  queuedReview = undefined;
}

export function takeGuestReviewFile() {
  const file = queuedFile;
  queuedFile = undefined;
  return file;
}

export function stageGuestChat(review: ReadyReview) {
  queuedFile = undefined;
  queuedReview = review;
}

export function takeGuestChat() {
  const review = queuedReview;
  queuedReview = undefined;
  return review;
}

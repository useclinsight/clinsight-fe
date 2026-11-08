import 'server-only';

export function guestUploadEnabled() {
  return process.env.GUEST_UPLOAD_ENABLED === 'true';
}

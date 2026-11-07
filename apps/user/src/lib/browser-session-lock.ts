// Serialize session mutations across tabs so rotating a refresh token cannot race with sign-out.
export async function withSessionLock<T>(task: () => Promise<T>): Promise<T> {
  return navigator.locks ? navigator.locks.request('clinsight-patient-session', task) : task();
}

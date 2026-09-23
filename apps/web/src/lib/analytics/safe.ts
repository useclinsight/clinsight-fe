export function runAnalyticsSafely(...tasks: Array<() => void>) {
  for (const task of tasks) {
    try {
      task();
    } catch (error) {
      console.error('Analytics event failed:', error);
    }
  }
}

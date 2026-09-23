declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function track(event: string) {
  if (measurementId) window.gtag?.('event', event);
}

export const trackGuideDownload = () => track('guide_download');
export const trackWaitlist = () => track('join_waitlist');
export const trackSignup = () => track('sign_up');

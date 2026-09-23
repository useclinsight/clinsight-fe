declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead() {
  window.fbq?.('track', 'Lead');
}

export function trackPageView() {
  window.fbq?.('track', 'PageView');
}

export function trackRegistration() {
  window.fbq?.('track', 'CompleteRegistration');
}

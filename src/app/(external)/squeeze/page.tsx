import { permanentRedirect } from 'next/navigation';

const GUIDE_URL = '/resources/5-lab-values-every-nigerian-should-understand';

/** Keep the legacy campaign URL pointed at the canonical resource URL. */
export default function SqueezePage() {
  permanentRedirect(GUIDE_URL);
}

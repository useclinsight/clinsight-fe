import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface PaymentFailedProps {
  onRetry: () => void;
  onRetryLater: () => void;
}

export function PaymentFailed({ onRetry, onRetryLater }: PaymentFailedProps) {
  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
      <div className="mb-2 flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
          !
        </span>
      </div>

      <p className="mb-8 text-sm text-gray-500">
        Your payment was not successfully processed. Please try again
      </p>

      <button
        onClick={onRetry}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#1565C0] text-white transition hover:bg-[#0F5BB3]"
      >
        <span className="font-medium">Retry payment now</span>
        <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
      </button>

      <button
        onClick={onRetryLater}
        className="mt-4 text-sm font-medium text-[#1565C0] hover:underline"
      >
        Retry later
      </button>
    </div>
  );
}

import { ArrowRight02Icon, Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface PaymentSuccessfulProps {
  email?: string;
  onContinue: () => void;
  onDownloadReceipt?: () => void;
}

export function PaymentSuccessful({
  email = 'customer@example.com',
  onContinue,
  onDownloadReceipt,
}: PaymentSuccessfulProps) {
  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
      <div className="mb-2 flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Your payment has been processed successfully. You will receive a confirmation email shortly.
      </p>

      {/* Receipt email */}
      <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3">
        <HugeiconsIcon icon={Mail01Icon} size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">Receipt sent to {email}</span>
      </div>

      <button
        onClick={onContinue}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#1565C0] text-white transition hover:bg-[#0F5BB3]"
      >
        <span className="font-medium">Continue</span>
        <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
      </button>

      {onDownloadReceipt && (
        <button
          onClick={onDownloadReceipt}
          className="mt-4 text-sm font-medium text-[`#1565C0`] hover:underline"
        >
          Download Receipt
        </button>
      )}
    </div>
  );
}

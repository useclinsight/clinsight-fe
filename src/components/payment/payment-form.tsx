'use client';

import { useState } from 'react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type PaymentMethod = 'card' | 'bank' | 'transfer';

interface PaymentFormProps {
  amount?: number;
  onSubmit: () => void;
}

export function PaymentForm({ amount = 5000, onSubmit }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const [selectedBank, setSelectedBank] = useState('');
  const normalizedCard = cardNumber.replace(/\s/g, '');
  const isCardValid =
    normalizedCard.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    (cvv.length === 3 || cvv.length === 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCardValid) return;
    onSubmit();
  };

  return (
    <div className="w-full max-w-[480px] rounded-[32px] border border-gray-200 bg-white px-8 py-8 shadow-sm">
      <div className="w-full max-w-[480px] bg-white px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
        <hr className="my-4 border-gray-200" />

        {/* Pay With */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-gray-700">Pay With:</p>
          <div className="flex items-center gap-6">
            {(['card', 'bank', 'transfer'] as PaymentMethod[]).map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="payment-method"
                  className="sr-only"
                  checked={method === m}
                  onChange={() => setMethod(m)}
                />

                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-300">
                  {method === m && <span className="h-2 w-2 rounded-full bg-green-500" />}
                </span>
                <span className="text-sm capitalize text-gray-700">{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Card */}
        {method === 'card' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                placeholder="1234  5678  9101  1121"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="h-[48px] w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#1565C0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Expiration Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="h-[48px] w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#1565C0]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="h-[48px] w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-[#1565C0]"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="sr-only"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
              />
              <span className="flex h-4 w-4 items-center justify-center rounded border border-gray-300">
                {saveCard && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-gray-600">Save card details</span>
            </label>

            <button
              type="submit"
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#1565C0] text-white transition hover:bg-[#0F5BB3] active:bg-[#0D4F9E]"
            >
              <span className="font-medium">Pay ₦{amount.toLocaleString()}</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </button>

            <p className="text-xs leading-relaxed text-gray-400">
              Your personal data will be used to process your payment, support your experience
              throughout this website, and for other purposes described in our privacy policy.
            </p>
          </form>
        )}

        {/* Bank */}
        {method === 'bank' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">Select your bank to proceed with payment.</p>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="h-[48px] w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-[#1565C0]"
            >
              <option value="">Select Bank</option>
              <option>First Bank</option>
              <option>GTBank</option>
              <option>Access Bank</option>
              <option>Zenith Bank</option>
              <option>UBA</option>
            </select>
            <button
              onClick={() => selectedBank && onSubmit()}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#1565C0] text-white transition hover:bg-[#0F5BB3]"
            >
              <span className="font-medium">Pay ₦{amount.toLocaleString()}</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </button>
          </div>
        )}

        {/* Transfer */}
        {method === 'transfer' && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p className="mb-2 font-medium text-gray-800">Transfer Details</p>
              <p>
                Bank: <span className="font-medium text-gray-900">First Bank</span>
              </p>
              <p>
                Account Number: <span className="font-medium text-gray-900">0123456789</span>
              </p>
              <p>
                Account Name: <span className="font-medium text-gray-900">Clinsight Health</span>
              </p>
              <p>
                Amount:{' '}
                <span className="font-medium text-gray-900">₦{amount.toLocaleString()}</span>
              </p>
            </div>
            <button
              onClick={onSubmit}
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#1565C0] text-white transition hover:bg-[#0F5BB3]"
            >
              <span className="font-medium">I have transferred</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

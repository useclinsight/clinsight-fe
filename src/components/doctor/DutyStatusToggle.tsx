'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { updateDutyStatus, DoctorDutyStatus } from '@/services/doctor/service';

type DutyStatusToggleProps = {
  isOnDuty?: boolean;
  onToggle?: () => void;
  initialIsOnDuty?: boolean;
  dutyStatus?: DoctorDutyStatus;
  onStatusChange?: (status: DoctorDutyStatus) => void;
  disabled?: boolean;
  disabledReason?: string;
};

export default function DutyStatusToggle({
  isOnDuty: propIsOnDuty,
  onToggle,
  initialIsOnDuty = false,
  dutyStatus: externalDutyStatus,
  onStatusChange,
  disabled = false,
  disabledReason,
}: DutyStatusToggleProps) {
  const [internalIsOnDuty, setInternalIsOnDuty] = useState<boolean | null>(null);
  const [internalRemainingSeconds, setInternalRemainingSeconds] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const effectiveIsOnDuty = propIsOnDuty ?? internalIsOnDuty ?? externalDutyStatus?.isOnDuty ?? initialIsOnDuty;
  const remainingSeconds = internalRemainingSeconds ?? externalDutyStatus?.remainingDutySeconds ?? 0;

  // Countdown timer for shift duration if set
  useEffect(() => {
    if (!effectiveIsOnDuty || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setInternalRemainingSeconds((prev) => {
        const current = prev ?? remainingSeconds;
        if (current <= 1) {
          setInternalIsOnDuty(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [effectiveIsOnDuty, remainingSeconds]);

  const formatCountdown = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const handleToggle = async () => {
    if (disabled) {
      setErrorMessage(disabledReason || 'Approval required: Your doctor verification must be approved before you can go on duty.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const nextState = !effectiveIsOnDuty;
    const result = await updateDutyStatus(nextState);
    setIsLoading(false);

    if ('error' in result) {
      setErrorMessage(result.error);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setInternalIsOnDuty(result.isOnDuty);
      setInternalRemainingSeconds(result.remainingDutySeconds);
      if (onToggle) {
        onToggle();
      }
      if (onStatusChange) {
        onStatusChange(result);
      }
    }
  };

  return (
    <div className="relative inline-flex flex-col items-end">
      <button
        type="button"
        role="switch"
        aria-checked={effectiveIsOnDuty}
        aria-label={
          disabled
            ? 'Toggle disabled. Verification required.'
            : effectiveIsOnDuty
            ? 'On duty. Click to go off duty.'
            : 'Off duty. Click to go on duty.'
        }
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'flex h-9 shrink-0 items-center justify-between gap-2 rounded-full border px-2 transition-all sm:w-auto sm:gap-3 sm:px-3.5 border-none outline-none cursor-pointer',
          disabled
            ? 'bg-[#E5E7EB] opacity-60 cursor-not-allowed'
            : effectiveIsOnDuty
            ? 'bg-[#DEF6E7] hover:bg-[#D1FAE5]'
            : 'bg-[#EBEBEB] hover:bg-[#E0E0E0]',
          isLoading && 'opacity-70 cursor-wait'
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              disabled
                ? 'bg-gray-400'
                : effectiveIsOnDuty
                ? 'bg-[#147638] animate-pulse'
                : 'bg-text-secondary',
            )}
          />
          <span
            className={cn(
              'whitespace-nowrap text-xs sm:text-sm font-medium',
              disabled
                ? 'text-gray-500'
                : effectiveIsOnDuty
                ? 'text-[#147638]'
                : 'text-text-secondary',
            )}
          >
            {effectiveIsOnDuty ? 'On duty' : 'Off duty'}
          </span>

          {effectiveIsOnDuty && remainingSeconds > 0 && !disabled && (
            <span className="text-[11px] font-mono text-[#147638]/80 bg-[#147638]/10 px-1.5 py-0.5 rounded ml-0.5">
              {formatCountdown(remainingSeconds)}
            </span>
          )}
        </div>

        <span
          className={cn(
            'relative inline-flex h-4.5 w-8.5 shrink-0 rounded-full transition-colors ml-1',
            disabled ? 'bg-gray-300' : effectiveIsOnDuty ? 'bg-primary-blue' : 'bg-[#B0B0B0]',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-3.5 rounded-full bg-white transition-[left]',
              effectiveIsOnDuty && !disabled ? 'left-4.5' : 'left-0.5',
            )}
          />
        </span>
      </button>

      {errorMessage && (
        <div className="absolute top-11 right-0 z-50 w-72 rounded-lg bg-gray-900 text-white text-xs p-2.5 shadow-xl border border-gray-700 animate-in fade-in slide-in-from-top-1">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

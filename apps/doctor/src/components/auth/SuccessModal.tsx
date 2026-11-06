'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';

interface SuccessModalProps {
  title: string;
  message: string;
  /** Called after the auto-dismiss delay (default 2.5s) */
  onComplete: () => void;
  delayMs?: number;
}

export default function SuccessModal({
  title,
  message,
  onComplete,
  delayMs = 2500,
}: SuccessModalProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, delayMs);
    return () => clearTimeout(timer);
  }, [onComplete, delayMs]);

  return (
    <motion.div
      key="success-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    >
      <motion.div
        key="success-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white p-10 text-center shadow-xl"
      >
        {/* Animated tick */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50"
        >
          <svg
            className="h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-sans text-2xl font-semibold leading-8 tracking-tight text-text-primary">
            {title}
          </h2>
          <p className="font-sans text-sm font-normal leading-5 text-text-secondary-3">{message}</p>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-green-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: delayMs / 1000, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

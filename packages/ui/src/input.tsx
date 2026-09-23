import * as React from 'react';
import { cn } from '@clinsight/lib';

export interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
}

function Input({ className, type, error, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-normal text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0] transition-colors font-sans file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export { Input };

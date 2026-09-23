import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
}

function Input({ className, type, error, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-outline-border bg-white px-5 py-3 text-sm font-normal text-text-primary placeholder:text-text-disabled outline-none focus:border-primary-blue transition-colors font-sans file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export { Input };

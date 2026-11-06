import { AnimatePresence, motion } from 'motion/react';
import { PropsWithChildren } from 'react';

interface InputFieldContainerProps extends PropsWithChildren {
  label: string;
  htmlFor: string;
  error?: string;
}

interface VerificationInputFieldProps extends PropsWithChildren {
  label: string;
  htmlFor: string;
  error?: string;
  style?: string;
}

export default function InputFieldContainer({
  label,
  htmlFor,
  error,
  children,
}: InputFieldContainerProps) {
  const renderLabel = (text: string) => {
    if (text.endsWith('*')) {
      return (
        <>
          {text.slice(0, -1)}
          <span className="text-red-500">*</span>
        </>
      );
    }
    return text;
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs text-text-primary leading-[150%] tracking-[-1%] md:text-sm"
      >
        {renderLabel(label)}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-xs italic text-red-500 font-medium text-left"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function VerificationInputField({
  label,
  htmlFor,
  error,
  children,
}: VerificationInputFieldProps) {
  const renderLabel = (text: string) => {
    if (text.endsWith('*')) {
      return (
        <>
          {text.slice(0, -1)}
          <span className="text-red-500">*</span>
        </>
      );
    }
    return text;
  };

  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={htmlFor}
        className="text-lg text-text-primary leading-[150%] tracking-[-1%] md:text-lg"
      >
        {renderLabel(label)}
      </label>
      <div className="input__field flex items-center gap-2 focus-within:border-primary-blue focus-within:border">
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-xs italic text-red-500 font-medium text-left"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

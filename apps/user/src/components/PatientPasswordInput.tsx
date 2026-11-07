'use client';

import { Button, Input, type InputProps } from '@clinsight/ui';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type PatientPasswordInputProps = Omit<InputProps, 'type'> & {
  id: string;
  passwordLabel: string;
};

export function PatientPasswordInput({
  id,
  passwordLabel,
  className,
  ...input
}: PatientPasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? Eye : EyeOff;

  return (
    <div className="relative">
      <Input
        {...input}
        id={id}
        type={visible ? 'text' : 'password'}
        className={`${className ?? ''} pr-14 [&::-ms-reveal]:hidden`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={(visible ? 'Hide ' : 'Show ') + passwordLabel.toLowerCase()}
        aria-controls={id}
        onClick={() => setVisible((value) => !value)}
        className="absolute top-1/2 right-1.5 size-11 -translate-y-1/2 rounded-lg text-gray-700"
      >
        <Icon aria-hidden="true" className="size-[18px]" />
      </Button>
    </div>
  );
}

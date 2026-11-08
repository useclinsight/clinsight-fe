'use client';

import { Button } from '@clinsight/ui';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { PatientGuestUpload } from './PatientGuestUpload';

export function PatientGuestUploadSheet() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="h-12 rounded-xl border-gray-300 bg-white text-base text-gray-800"
        >
          Continue as guest
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-xl outline-none motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out md:bottom-5 md:max-h-[calc(100dvh-2.5rem)] md:rounded-3xl motion-safe:data-[state=open]:slide-in-from-bottom-[110%] motion-safe:data-[state=closed]:slide-out-to-bottom-[110%]">
          <Dialog.Title className="sr-only">Guest upload</Dialog.Title>
          <Dialog.Description className="sr-only">
            Choose a lab report or check your guest result.
          </Dialog.Description>
          <div className="sticky top-0 z-10 flex justify-end bg-white px-2 pt-1">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close guest upload"
                className="size-11 rounded-full text-slate-700"
              >
                <X aria-hidden="true" className="size-5" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-8">
            <PatientGuestUpload inSheet />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

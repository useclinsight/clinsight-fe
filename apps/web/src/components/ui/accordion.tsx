'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item data-slot="accordion-item" className={cn('', className)} {...props} />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/accordion-trigger relative flex flex-1 items-center justify-between gap-6 p-4 text-left transition-all outline-none disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
        <div
          className="flex h-8 w-8 shrink-0 items-center 
        justify-center rounded-full transition-all 
        group-aria-expanded/accordion-trigger:bg-white 
        group-aria-expanded/accordion-trigger:shadow-sm"
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            data-slot="accordion-trigger-icon"
            className="pointer-events-none 
          shrink-0 group-aria-expanded/accordion-trigger:hidden"
          />
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            data-slot="accordion-trigger-icon"
            className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
          />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn('h-(--radix-accordion-content-height) pt-0 pb-4', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

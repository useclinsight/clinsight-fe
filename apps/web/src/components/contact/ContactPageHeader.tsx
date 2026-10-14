'use client';

import { motion } from 'motion/react';

export default function ContactPageHeader() {
  return (
    <motion.header
      className="px-4 space-y-5 max-w-237.5 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <h1 className="text-[32px] font-semibold leading-[130%] tracking-[-2%] text-center text-heading-text md:font-bold md:text-[64px] md:leading-[120%] ">
        We&apos;d love to{' '}
        <span className="text-white bg-primary-blue rounded-xl p-2.5 block w-fit mx-auto md:block lg:inline  sm:inline mt-4 sm:mt-0 md:mt-4 lg:mt-0">
          {' '}
          hear from you.
        </span>
      </h1>

      <p className="text-center text-sm leading-[150%] tracking-[-1%] md:text-xl text-text-disabled">
        Questions, comments, or partnership inquiries? We&apos;d love to hear from you. Our team
        replies within one business day.
      </p>
    </motion.header>
  );
}

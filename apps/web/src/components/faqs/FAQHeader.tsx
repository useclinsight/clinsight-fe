'use client';

import { motion } from 'motion/react';

export default function FAQHeader() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col"
    >
      <div className="relative flex max-lg:bg-[#11519A] flex-col justify-center items-center h-77 gap-6">
        <div
          className="lg:hidden absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/assets/terms-and-conditions/circle-bg.png)`,
          }}
        />
        <div
          className="max-lg:hidden absolute inset-0 -z-10 bg-center w-full bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(/assets/terms-and-conditions/circle-bg-web.png)`,
          }}
        />
        <motion.h1
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[2rem] sm:text-[2.5rem] text-white font-semibold text-center"
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="text-base text-white text-center"
        >
          Explore answers to common questions about your results, features, and how Clinsights
          supports your care
        </motion.p>
        <motion.p
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="text-base text-white"
        >
          Last Updated, May 2026
        </motion.p>
      </div>
    </motion.main>
  );
}

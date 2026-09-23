'use client';

import { BUSINESS_REACH } from '@/lib/constants';
import { motion, type Variants } from 'motion/react';
import Image from 'next/image';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function ContactDetails() {
  return (
    <motion.div
      className="space-y-8 md:w-[40%]"
      initial={{ opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="border border-outline-border p-5 space-y-3.75 rounded-[12px] bg-white">
        <h2 className="font-semibold text-header-text md:text-xl">Reach us directly</h2>

        {/* Reach infos */}
        <motion.div
          className="flex flex-col gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {BUSINESS_REACH.map((info, idx) => (
            <motion.div key={idx} variants={itemVariants} className="flex items-start gap-3.75">
              <div className="p-2.5 rounded-[8px] justify-center flex items-center bg-primary-subtle">
                <Image src={info.icon} alt={info.type} quality={75} width={17} height={17} />
              </div>

              <div className="space-y-1.25">
                <p className="text-text-disabled text-sm leading-[150%] tracking-[-1%]">
                  {info.type}
                </p>

                <div>
                  <p className="text-text-secondary text-sm leading-[150%] tracking-[-1%]">
                    {info.info}
                  </p>
                  {info.info2 && (
                    <p className="text-text-secondary text-sm leading-[150%] tracking-[-1%]">
                      {info.info2}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="p-5 rounded-[12px] space-y-3.75 bg-primary-subtle md:space-y-5"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.35 }}
      >
        <Image
          src="/assets/contact-assets/medical-emergency.png"
          alt="emergency icon"
          height={50}
          width={50}
          className="block h-12.5 w-12.5"
          unoptimized
          priority
        />

        <h3 className="font-semibold text-header-text md:text-xl">Medical Emergency?</h3>

        <p className="leading-[150%] tracking-[-1%] text-sm text-text-disabled md:text-base">
          Clinsight is not for emergencies. Call 911 or use your local emergency number immediately
          if you need urgent care.
        </p>
      </motion.div>
    </motion.div>
  );
}

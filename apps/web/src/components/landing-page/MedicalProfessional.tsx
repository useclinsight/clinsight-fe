'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
};

export function MedicalProfessional() {
  return (
    <section className="bg-[#E8F0F9] py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div
          className="flex flex-col gap-12 lg:gap-16 lg:flex-row lg:items-center 
        lg:justify-between relative z-10"
        >
          {/* Left Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="flex flex-[1.2] flex flex-col items-start gap-6 lg:gap-8 text-left"
          >
            {/* Bulb Icon */}
            <motion.div
              variants={fadeInUp}
              className="relative h-12 w-12 lg:h-16 lg:w-16 overflow-hidden rounded-full"
            >
              <Image
                src="/assets/landing-page-assets/bulb.svg"
                alt="Innovation icon"
                fill
                className="object-contain"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-4">
              <h2
                className="max-w-2xl text-[28px] lg:text-[40px] font-bold leading-[1.3] 
              tracking-[-0.02em] text-[#1B1B1B]"
              >
                Join Clinsight as a <br className="hidden lg:block" />
                <span className="text-[#1565C0]">Verified Medical Professional</span>
              </h2>
              <p
                className="max-w-2xl text-[16px] lg:text-[18px] font-normal 
              leading-[1.5] tracking-[-0.01em] text-[#5E5E5E]"
              >
                Be part of a trusted network helping patients understand their lab results while
                delivering accurate, data-driven care through a modern, structured platform
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/waitlist">
                <Button
                  className="w-fit h-[42px] lg:h-[48px] rounded-[12px] 
              bg-[#1565C0] px-4 lg:px-6 py-2 lg:py-3 text-[13px] lg:text-sm font-bold 
              text-white hover:bg-[#1565C0]/90 transition-all shadow-lg"
                >
                  Get Started as a Doctor
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual (side-image) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-1 items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-[500px]  lg:scale-110">
              {/* Desktop Image */}
              <Image
                src="/assets/landing-page-assets/join.svg"
                alt="Medical professional visual"
                width={500}
                height={400}
                className="hidden lg:block w-full h-auto"
                priority
              />
              {/* Mobile Image */}
              <Image
                src="/assets/landing-page-assets/join-mobile.svg"
                alt="Medical professional visual"
                width={500}
                height={400}
                className="block lg:hidden w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

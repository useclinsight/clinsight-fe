'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { motion, Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-[1.4] flex flex-col items-start gap-6"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-2 rounded-full bg-[#F5F5F5] p-1 pr-4"
            >
              <div className="flex -space-x-2 overflow-hidden">
                <div className="relative h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/handsome-man1.jpg"
                    alt="User"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <div className="relative h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/successful-entrepreneur1.jpg"
                    alt="User"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
                <div className="relative h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/curly-haired-woman1.jpg"
                    alt="User"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-[9px] lg:text-[11px] font-bold text-brand-blue whitespace-nowrap">
                Join 1,000+ users already using Clinsight
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-[28px] lg:text-[56px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1B1B1B] w-full text-center lg:text-left"
            >
              Understand Your Lab Results
              <span className="lg:hidden"> Now</span>
              <br className="hidden lg:block" />
              <br className="block lg:hidden" />
              <span className="inline-flex items-center gap-x-3 mt-2 lg:mt-4">
                <span className="hidden lg:inline">Now </span>
                <span className="relative inline-flex items-center px-4 py-1 text-white">
                  <span className="absolute inset-0 -skew-x-2 rounded-lg bg-[#1565C0]" />
                  <span className="relative">No Waiting!</span>
                </span>
              </span>
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="max-w-md text-[16px] lg:text-[18px] font-normal leading-[1.5] tracking-[-0.01em] text-[#5E5E5E] flex flex-col gap-4 w-full text-center lg:text-left"
            >
              <p>Upload your laboratory results and get a clear interpretation in minutes.</p>
              <p className="italic text-[14px]">
                AI-assisted interpretation, not a medical diagnosis.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <div className="relative w-full flex-1 min-h-[400px] lg:min-h-[600px] flex items-center justify-end -mr-6 lg:mr-0 -mt-8 lg:mt-0">
            {/* Circle Wrapper */}
            <div className="relative h-[320px] w-[320px] lg:h-[600px] lg:w-[600px] flex items-center justify-center scale-90 sm:scale-100 lg:scale-100 translate-x-6 lg:translate-x-0">
              {/* Background Circle Asset */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none"
              >
                <motion.div
                  animate={{
                    rotate: [0, 3, 0, -3, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: 'easeInOut',
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/assets/landing-page-assets/outer-inner-circle.svg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 600px, 320px"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Floating File Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute -bottom-10 -right-2 lg:bottom-[8%] lg:right-[5%] z-20 w-12 h-12 lg:w-20 lg:h-20 flex items-center justify-center"
              >
                <div className="relative w-full h-full p-2 bg-white rounded-full shadow-md border border-slate-100 lg:shadow-none lg:border-none flex items-center justify-center">
                  <Image
                    src="/assets/landing-page-assets/docs.svg"
                    alt="Note icon"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              {/* User Reports Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                className="absolute left-[-50px] lg:left-[10px] top-[50%] -translate-y-1/2 lg:translate-y-0 lg:top-[20%] z-30 flex
              w-[50px] lg:w-[84px] h-[210px] lg:h-[320px] flex-col gap-1.5 lg:gap-2 rounded-lg lg:rounded-xl
              bg-white p-1 lg:p-2 shadow-lg ring-1 ring-slate-100"
              >
                {[
                  '/assets/landing-page-assets/woman-with-laptop1.jpg',
                  '/assets/landing-page-assets/successful-entrepreneur1.jpg',
                  '/assets/landing-page-assets/african-american-student1.jpg',
                ].map((src, i) => (
                  <div
                    key={i}
                    className="relative flex-1 w-full overflow-hidden rounded-md lg:rounded-lg"
                  >
                    <Image
                      src={src}
                      alt="User"
                      fill
                      sizes="(min-width: 1024px) 68px, 42px"
                      className="object-cover"
                    />
                  </div>
                ))}
                <div
                  className="flex flex-1 w-full flex-col items-center justify-center
                rounded-md lg:rounded-lg bg-[#E8F0F9] text-center text-[8px] lg:text-[14px]
                font-medium leading-tight text-brand-blue"
                >
                  User
                  <br />
                  Reports
                </div>
              </motion.div>

              {/* Dashboard Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="absolute left-1/2 -translate-x-1/2 top-[50%] -translate-y-1/2 lg:top-[20%] lg:translate-y-0 z-10 w-full max-w-[240px] lg:max-w-[380px] flex flex-col items-center"
              >
                {/* Dashboard Card */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 w-full"
                >
                  <div
                    className="rounded-t-[16px] lg:rounded-t-[24px] border-2 border-t-[#1565C0] border-x-[#1565C0] border-b-[#F2F2F2]
                  bg-gradient-to-b from-white via-white to-transparent
                  p-2 lg:p-8 pb-4 lg:pb-12 flex flex-col gap-2 lg:gap-8
                  h-[210px] lg:h-[310px] overflow-hidden"
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="flex h-5 w-5 lg:h-10 lg:w-10 shrink-0 items-center justify-center">
                        <Image
                          src="/assets/landing-page-assets/ai-scan.svg"
                          alt="AI Scan"
                          width={20}
                          height={20}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="text-[8px] lg:text-sm font-medium text-[#494949] leading-tight">
                        Advanced Intelligent Analysis
                      </span>
                    </div>

                    <div className="space-y-1.5 lg:space-y-3">
                      <div className="flex gap-2 lg:gap-3">
                        <div className="h-1.5 lg:h-4 w-[70px] lg:w-[180px] rounded-full bg-[#E8F0F9]" />
                        <div className="h-1.5 lg:h-4 w-[30px] lg:w-[110px] rounded-full bg-[#E8F0F9]" />
                      </div>
                      <div className="flex gap-2 lg:gap-3">
                        <div className="h-1.5 lg:h-4 w-[30px] lg:w-[110px] rounded-full bg-[#E8F0F9]" />
                        <div className="h-1.5 lg:h-4 w-[30px] lg:w-[110px] rounded-full bg-[#E8F0F9]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 rounded-2xl border-[#1B1B1B14] border-b-2 bg-[#FFFFFE33] px-5 py-4 lg:py-3">
                        <Image
                          src="/assets/landing-page-assets/key.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="lg:w-6 lg:h-6"
                        />
                        <span className="text-[14px] lg:text-[16px] font-bold text-[#F59E0B] capitalize tracking-wide">
                          Key Findings
                        </span>
                      </div>
                      <div className="flex items-center gap-4 rounded-2xl border-[#1B1B1B14] border-b-2 bg-[#FFFFFE33] px-5 py-4 lg:py-3">
                        <Image
                          src="/assets/landing-page-assets/recommendation.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="lg:w-6 lg:h-6"
                        />
                        <span className="text-[14px] lg:text-[16px] font-bold text-[#10B981] capitalize tracking-wide">
                          Recommendations
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <div className="z-20 mt-0 lg:mt-1 w-full">
                  <Link href="/waitlist">
                    <Button
                      variant="brand"
                      className="w-full rounded-lg lg:rounded-xl py-3 lg:py-7 text-[9px]
                    lg:text-sm font-bold shadow-lg transition-all bg-[#1565C0] text-white
                    hover:bg-[#1565C0]/90"
                    >
                      Get Started
                      <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="ml-1 lg:ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

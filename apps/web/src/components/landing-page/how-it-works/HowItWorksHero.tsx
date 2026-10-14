'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { triggerComingSoonModal } from '@/components/coming-soon';
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

export function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-[1.4] flex flex-col items-center lg:items-start gap-6 text-center lg:text-left"
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
                    className="object-cover"
                  />
                </div>
                <div className="relative h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/successful-entrepreneur1.jpg"
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-6 w-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/curly-haired-woman1.jpg"
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-bold text-brand-blue">
                Join 1,000+ users already using Clinsight
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-3">
              <h1 className="text-[28px] lg:text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1B1B1B] w-full lg:max-w-none">
                From Upload to Insight
              </h1>
              <h1 className="text-[28px] lg:text-[48px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1B1B1B]">
                <span className="relative inline-block px-3 text-white">
                  <span className="absolute inset-0 -skew-x-2 rounded bg-[#1565C0]" />
                  <span className="relative">Here&apos;s How</span>
                </span>
              </h1>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="max-w-md text-[16px] lg:text-[18px] font-normal leading-[1.5] tracking-[-0.01em] text-[#5E5E5E] flex flex-col gap-4"
            >
              <p>
                Clinsight helps you turns complex medical reports into clear, simple explanations
                using AI-assisted interpretation.
              </p>
            </motion.div>
          </motion.div>

          <div className="relative w-full flex-1 min-h-[400px] lg:min-h-[600px] flex items-center justify-end -mr-6 lg:mr-0 -mt-8 lg:mt-0">
            {/* Circle Wrapper */}
            <div className="relative h-[320px] w-[320px] lg:h-[600px] lg:w-[600px] flex items-center justify-center scale-90 sm:scale-100 lg:scale-100 translate-x-6 lg:translate-x-0">
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
                    <Image src={src} alt="User" fill className="object-cover" />
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
                      <span className="text-[8px] lg:text-sm font-bold text-slate-900 leading-tight">
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

                    <div
                      className="flex items-center gap-2 lg:gap-4 rounded-xl lg:rounded-[16px]
                    bg-[#FFFFFE33] px-2 h-[32px] lg:h-[60px] border-b-2 border-[#1B1B1B14]
                    text-[#F59E0B] w-full max-w-[352px]"
                    >
                      <Image
                        src="/assets/landing-page-assets/key.svg"
                        alt="Key icon"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 lg:w-6 lg:h-6 shrink-0"
                      />
                      <span className="text-[7px] lg:text-[12px] font-bold capitalize tracking-[0.15em] lg:tracking-[0.2em]">
                        Key Findings
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 lg:gap-4 rounded-xl lg:rounded-[16px]
                    bg-[#FFFFFE33] px-2 h-[32px] lg:h-[60px] border-b-2 border-[#1B1B1B14]
                    text-emerald-500 w-full max-w-[352px]"
                    >
                      <Image
                        src="/assets/landing-page-assets/recommendation.svg"
                        alt="Recommendation icon"
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 lg:w-6 lg:h-6 shrink-0"
                      />
                      <span className="text-[7px] lg:text-[12px] font-bold capitalize tracking-[0.15em] lg:tracking-[0.2em]">
                        Recommendations
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <div className="z-20 mt-0 lg:mt-1 w-full">
                  <Button
                    type="button"
                    variant="brand"
                    onClick={() => triggerComingSoonModal()}
                    className="w-full rounded-lg lg:rounded-xl py-3 lg:py-7 text-[9px]
                    lg:text-sm font-bold shadow-lg transition-all bg-[#1565C0] text-white
                    hover:bg-[#1565C0]/90 flex items-center justify-center"
                  >
                    Get Started
                    <Image
                      src="/assets/how-it-works/arrow_forward.svg"
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      className="ml-1.5 lg:ml-2 w-3 h-3 lg:w-4 lg:h-4"
                    />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

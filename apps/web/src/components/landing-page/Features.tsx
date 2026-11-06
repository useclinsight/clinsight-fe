'use client';

import Image from 'next/image';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'AI Analysis',
    description:
      'Advanced intelligent models analyze your lab data with precision, identifying patterns, flagging abnormalities,' +
      ' and breaking down complex values into clear, structured insights you can easily understand.',
    icon: '/assets/landing-page-assets/ai-scan-blue.svg',
    bgColor: 'bg-[#E8F0F9]',
    iconColor: 'text-[#1565C0]',
  },
  {
    title: 'Medical Expert Support',
    description:
      'Get guidance from qualified healthcare professionals who help interpret your results, answer your questions, ' +
      'and provide clarity so you can make informed health decisions with confidence.',
    icon: '/assets/landing-page-assets/analytics-up.svg',
    bgColor: 'bg-[#FEF0DA]',
    iconColor: 'text-[#F59E0B]',
  },
  {
    title: 'Actionable Insights',
    description:
      'Move beyond confusing laboratory data with insights specifically tailored to your results. ' +
      'This would include what each value means, what requires attention, and practical next steps to support your health journey.',
    icon: '/assets/landing-page-assets/notepad.svg',
    bgColor: 'bg-[#DEF6E7]',
    iconColor: 'text-[#10B981]',
  },
];

import { motion, Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
};

export function Features() {
  return (
    <section className="bg-[#FAFAFA] py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-12 lg:mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-start gap-4 lg:gap-6">
            <div
              className="flex w-fit items-center gap-2 rounded-full bg-[#FFFFFE] 
            px-4 py-2 border border-slate-50"
            >
              <span className="h-2 w-2 bg-[#F59E0B]" />
              <span className="text-xs font-bold text-[#F59E0B] capitalize tracking-wider">
                Clarity, simplified
              </span>
            </div>
            {/* Allow natural two-line wrap on mobile; keep single/tight on desktop */}
            <h2
              className="text-[24px] lg:text-[40px] font-bold leading-[1.1] tracking-tight 
            text-[#1B1B1B] text-left max-w-[260px] lg:max-w-none"
            >
              Structured <span className="text-brand-blue">Insights</span> for Every Lab Result
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 lg:gap-4 items-start lg:justify-between"
          >
            <p
              className="text-[16px] lg:text-[18px] font-normal leading-[1.5] 
            tracking-[-0.01em] text-[#5E5E5E] text-left"
            >
              Clinsight transforms complex laboratory data into structured, easy-to-understand
              insights using AI.
            </p>

            <div className="flex items-center justify-start gap-3 w-full lg:justify-start">
              {/* App Store Button */}
              <Link href="/waitlist">
                <button
                  type="button"
                  className="flex flex-1 lg:flex-none lg:w-[180px] h-[50px] lg:h-[55px] 
              items-center gap-2 rounded-[12px] bg-[#1B1B1B] px-4 lg:px-6 py-2 text-white 
              transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/assets/header-assets/apple-app-store.svg"
                    alt="App Store"
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                  <div className="flex flex-col items-start leading-none gap-1 min-w-0">
                    <span className="text-[8px] lg:text-[10px] opacity-70 whitespace-nowrap">
                      Available on the
                    </span>
                    <span className="text-xs lg:text-sm font-bold whitespace-nowrap">
                      App Store
                    </span>
                  </div>
                </button>
              </Link>
              {/* Google Play Button */}
              <Link href="/waitlist">
                <button
                  type="button"
                  className="flex flex-1 lg:flex-none lg:w-[180px] h-[50px] lg:h-[55px] 
              items-center gap-2 rounded-[12px] bg-[#1B1B1B] px-4 lg:px-6 py-2 text-white 
              transition-opacity hover:opacity-80"
                >
                  <Image
                    src="/assets/header-assets/google-play-icon.svg"
                    alt="Google Play"
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                  <div className="flex flex-col items-start leading-none gap-1 min-w-0">
                    <span className="text-[8px] lg:text-[10px] opacity-70 whitespace-nowrap">
                      Get it on
                    </span>
                    <span className="text-xs lg:text-sm font-bold whitespace-nowrap">
                      Google Play
                    </span>
                  </div>
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="flex flex-col gap-6 rounded-[24px] border border-slate-50 bg-white 
              p-4 shadow-sm transition-shadow hover:shadow-md h-auto lg:h-[375px]"
            >
              <div
                className={`flex h-[148px] w-full items-center justify-center 
                  rounded-2xl ${feature.bgColor} p-8`}
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <Image src={feature.icon} alt={feature.title} fill className="object-contain" />
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:gap-6 px-4 pb-4">
                <h3 className="text-xl font-bold text-[#1B1B1B]">{feature.title}</h3>
                <p className="text-[14px] leading-relaxed text-[#5E5E5E]">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

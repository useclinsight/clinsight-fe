'use client';

import Image from 'next/image';

const GRID_FEATURES = [
  {
    title: 'Simple Summaries',
    description: 'Get the bottom line in one sentence',
    icon: '/assets/landing-page-assets/note.svg',
  },
  {
    title: 'Next Steps You Can Act On',
    description: 'Know exactly whether to make lifestyle changes or monitor at home.',
    icon: '/assets/landing-page-assets/step-into-rounded.svg',
  },
  {
    title: 'Context-Aware Analysis',
    description:
      'Your results are interpreted with additional context to provide more meaningful insights.',
    icon: '/assets/landing-page-assets/content-generator.svg',
  },
  {
    title: 'Smarter Over Time',
    description:
      'The AI learns from real doctor corrections, so future interpretations become more accurate.',
    icon: '/assets/landing-page-assets/level.svg',
  },
  {
    title: 'Detailed Explanation (no jargon)',
    description: 'Understand what each abnormal value means for your body, without medical school.',
    icon: '/assets/landing-page-assets/alert.svg',
  },
  {
    title: 'Risk Level Indicators',
    description:
      'See clearly if your result is Low, Moderate, or High risk – with green, yellow, and red visuals.',
    icon: '/assets/landing-page-assets/level-indicator.svg',
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

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden bg-[#11519A] py-16 lg:py-24 text-white">
      {/* Background Design SVG - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 pointer-events-none z-0 opacity-50 lg:opacity-100"
      >
        <Image
          src="/assets/landing-page-assets/section-design.svg"
          alt=""
          width={400}
          height={500}
          className="w-[200px] lg:w-[400px]"
        />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-12 lg:mb-20 flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-6 lg:mb-10 flex w-fit h-auto items-center justify-center gap-2 rounded-[64px] bg-[#FFFFFE14] px-4 py-2 text-white"
          >
            <span className="h-2 w-2 bg-white" />
            <span className="text-[10px] lg:text-xs font-bold capitalize tracking-wider">
              Clarity, End to End
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mb-4 lg:mb-6 max-w-[380px] lg:max-w-[560px] text-[26px] lg:text-[48px] font-bold leading-tight tracking-tight"
          >
            Everything You Need to <span className="text-[#F59E0B]">Understand</span> Your Results
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="max-w-2xl text-[16px] lg:text-[18px] font-normal leading-[1.5] tracking-[-0.01em] text-[#FFFFFE]"
          >
            Clinsight transforms complex laboratory data into structured, easy-to-understand
            insights using AI, with optional doctor validation for added confidence.
          </motion.p>
        </motion.div>

        {/* Features Grid - 6 individual cards with #1B1B1B52 bg and left border */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {GRID_FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="flex h-auto min-h-[180px] lg:h-[231px] flex-col gap-4 lg:gap-5 border-l-2 border-[#FFFFFE] bg-[#1B1B1B52] p-6 lg:p-8"
            >
              <div className="flex h-6 w-6 items-center justify-center">
                <Image src={feature.icon} alt={feature.title} width={24} height={24} />
              </div>
              <div className="flex flex-col gap-2 lg:gap-3">
                <h3 className="text-lg lg:text-xl font-bold">{feature.title}</h3>
                <p className="text-[13px] lg:text-sm leading-relaxed opacity-70">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

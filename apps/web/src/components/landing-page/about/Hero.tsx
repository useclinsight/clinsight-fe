'use client';

import Image from 'next/image';

const ResponsiveStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600;700&display=swap');

    .about-hero-section { font-family: 'Source Sans 3', sans-serif; }
    `}</style>
);

import { motion, Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
      duration: 0.8,
      ease: [0.21, 1.02, 0.73, 1],
    },
  },
};

export default function AboutHero() {
  return (
    <div className="about-hero-section w-full flex flex-col items-center justify-center font-sans overflow-hidden">
      <ResponsiveStyle />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-6 lg:px-12 text-center flex items-center justify-center flex-col py-12 lg:py-24 max-w-[900px] gap-8 lg:gap-12"
      >
        {/* heroTop */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-center flex-col relative gap-2 w-full"
        >
          {/* heroHeading */}
          <h1 className="font-bold flex items-start justify-center max-sm:flex-col max-sm:items-center text-[#1B1B1B] relative text-[32px] lg:text-[64px] leading-[120%] tracking-tight gap-x-3.25 gap-y-3 wrap-break-word">
            <span className="relative inline-block pb-4 lg:pb-8">
              Making lab results
              <div className="absolute -bottom-5 lg:-bottom-10 left-0 w-full">
                <Image
                  src="/assets/about-page-assets/hero-icon.svg"
                  alt=""
                  width={542}
                  height={50}
                  className="w-full"
                  style={{ display: 'block' }}
                />
              </div>
            </span>
            <span className="bg-[#1565C0] text-white inline-block px-4 lg:px-6 rounded-lg lg:rounded-xl shrink-0">
              Human.
            </span>
          </h1>
        </motion.div>

        {/* heroSubtext */}
        <motion.p
          variants={fadeInUp}
          className="text-[#5E5E5E] font-normal max-w-[780px] mx-auto text-sm lg:text-[20px] leading-[1.6] tracking-tight"
        >
          Clinsight simplifies complex lab results, so you can focus on your health. Clinsight was
          built to bridge the gap between complex medical reports and the people who deserve to
          understand them - with clarity, empathy, and clinical rigor.
        </motion.p>
      </motion.section>
    </div>
  );
}

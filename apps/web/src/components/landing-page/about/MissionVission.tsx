'use client';

import React from 'react';
import Image from 'next/image';

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

export default function AboutMissionVision() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-24 flex flex-col gap-24 lg:gap-32 overflow-hidden">
      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="flex flex-col lg:flex-row-reverse items-center justify-between gap-12 lg:gap-20"
      >
        {/* middleContent */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 flex items-start justify-center flex-col gap-5 lg:gap-6 order-1 lg:order-none"
        >
          {/* middleIconWrap */}
          <div className="flex items-center justify-center bg-[#E8F0F9] w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-full">
            <Image
              src={`/assets/about-page-assets/spiral-icon.svg`}
              alt="Spiral icon"
              width={24}
              height={24}
              className="lg:w-7 lg:h-7"
            />
          </div>

          {/* middleTagSmall */}
          <p className="font-bold text-[#5E5E5E] uppercase tracking-wider text-sm lg:text-base leading-none">
            OUR MISSION
          </p>

          {/* middleHeading */}
          <h2 className="font-bold text-[#1B1B1B] text-3xl lg:text-[40px] leading-[120%] tracking-tight break-words w-full">
            Clarity for every patient.
          </h2>

          {/* middleBody */}
          <p className="font-normal text-[#5E5E5E] text-base lg:text-lg leading-relaxed tracking-normal">
            We turn AI lab reports into plain-language summaries so that anyone regardless of
            medical background can confidently understand what their results mean.
          </p>
        </motion.div>

        {/* middleImageBox */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 w-full relative aspect-square lg:aspect-auto lg:h-[500px] rounded-[32px] lg:rounded-[48px] overflow-hidden order-2 lg:order-none max-w-full"
        >
          <Image
            src="/assets/about-page-assets/mission-image.svg"
            alt="Our Mission"
            fill
            className="object-cover lg:object-contain"
          />
        </motion.div>
      </motion.section>

      {/* ── Vision ───────────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20"
      >
        {/* middleContent */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 flex items-start justify-center flex-col gap-5 lg:gap-6 order-1 lg:order-none"
        >
          {/* middleIconWrap */}
          <div className="flex items-center justify-center bg-[#DEF6E7] w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-full">
            <Image
              src={`/assets/about-page-assets/eye-icon.svg`}
              alt="Eye icon"
              width={24}
              height={24}
              className="lg:w-7 lg:h-7"
            />
          </div>

          {/* middleTagSmall */}
          <p className="font-bold text-[#5E5E5E] uppercase tracking-wider text-sm lg:text-base leading-none">
            OUR VISION
          </p>

          {/* middleHeading */}
          <h2 className="font-bold text-[#1B1B1B] text-3xl lg:text-[40px] leading-[120%] tracking-tight break-words w-full">
            A world without medical confusion.
          </h2>

          {/* middleBody */}
          <p className="font-normal text-[#5E5E5E] text-base lg:text-lg leading-relaxed tracking-normal">
            We imagine a future where every test result is paired with an explanation so patients
            actually understand, and a clinician they can reach in minutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 w-full relative aspect-square lg:aspect-auto lg:h-[500px] rounded-[32px] lg:rounded-[48px] overflow-hidden order-2 lg:order-none max-w-full"
        >
          <Image
            src="/assets/about-page-assets/vission-image.svg"
            alt="Our Vision"
            fill
            className="object-cover lg:object-contain"
          />
        </motion.div>
      </motion.section>
    </div>
  );
}

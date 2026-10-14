'use client';

import React from 'react';
import Image from 'next/image';

const team = [
  {
    name: 'Dr. Amara Okafor',
    role: 'Chief Medical Officer',
    pic: `/assets/about-page-assets/team-image1.svg`,
  },
  {
    name: 'Dr. Sandra Jordan',
    role: 'CEO & Co-founder',
    pic: `/assets/about-page-assets/team-image2.png`,
  },
  {
    name: 'Dr. John Fidelis',
    role: 'Head of Engineering',
    pic: `/assets/about-page-assets/team-image3.png`,
  },
  { name: 'Sadiq Usman', role: 'Head of Design', pic: `/assets/about-page-assets/team-image4.png` },
  {
    name: 'Dr. Farouk Sadiq',
    role: 'Clinical Lead',
    pic: `/assets/about-page-assets/team-image5.png`,
  },
  { name: 'Fatima Gowon', role: 'Head of AI', pic: `/assets/about-page-assets/team-image6.png` },
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

export default function AboutTeam() {
  return (
    <section className="py-12 lg:py-24 w-full bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-start lg:items-center gap-12 lg:gap-16">
        {/* sectionTag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center text-[#F59E0B] font-bold uppercase tracking-wider gap-2.5 text-sm lg:text-base leading-none"
        >
          <span className="bg-[#F59E0B] shrink-0 w-3 h-3 rounded-none" />
          THE TEAM
        </motion.div>

        {/* teamMain */}
        <div className="flex flex-col items-center w-full gap-10 lg:gap-14">
          {/* teamHeading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-bold text-[#1B1B1B] text-center text-2xl lg:text-5xl leading-[120%] tracking-tight break-words w-full"
          >
            People behind the platform
          </motion.h2>

          {/* teamGrid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20 w-full"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white border border-[#F0F0F0] overflow-hidden rounded-2xl flex flex-col shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full aspect-[3/4] lg:h-[400px] overflow-hidden">
                  <Image
                    src={member.pic}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-300"
                  />
                </div>

                {/* teamInfo */}
                <div className="flex flex-col items-center lg:items-start gap-1 p-6 lg:p-8">
                  {/* teamName */}
                  <p className="font-bold text-[#1B1B1B] text-lg lg:text-2xl leading-tight">
                    {member.name}
                  </p>

                  {/* teamRole */}
                  <p className="text-[#135BAD] font-medium text-sm lg:text-lg leading-relaxed">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

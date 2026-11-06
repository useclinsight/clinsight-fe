'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/faqs';

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

export function FAQ() {
  return (
    <section className="bg-[#FFFFFE] py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-12 lg:mb-16 flex flex-col items-center text-center gap-4 lg:gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="flex w-fit h-auto items-center justify-center gap-2 rounded-full bg-[#E8F0F9] px-4 py-2 border border-slate-50"
          >
            <span className="h-2 w-2 bg-[#1565C0]" />
            <span className="text-[10px] lg:text-xs font-bold text-[#1565C0] capitalize tracking-wider">
              FAQs
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="mb-4 lg:mb-6 text-[22px] lg:text-[40px] font-bold leading-tight tracking-tight text-[#1B1B1B] text-center"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="max-w-2xl text-[14px] lg:text-[18px] font-normal leading-relaxed text-[#5E5E5E] text-center"
          >
            Explore answers to common questions about your results, features, and how Clinsight
            supports your care
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mx-auto w-full max-w-2xl"
        >
          <Accordion type="single" collapsible className="w-full space-y-4 border-none">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <AccordionItem
                  value={`item-${index}`}
                  className="rounded-[16px] border border-[#D0D0D0] bg-white transition-all data-[state=open]:bg-white data-[state=open]:shadow-sm overflow-hidden"
                >
                  <AccordionTrigger className="py-5 px-5 hover:no-underline focus:ring-0 focus:outline-none text-[16px] lg:text-[18px] font-bold text-[#1B1B1B] text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-[14px] lg:text-[16px] font-normal leading-relaxed text-[#5E5E5E]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

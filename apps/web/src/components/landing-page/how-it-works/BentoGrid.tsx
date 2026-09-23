'use client';
import { motion, Variants } from 'motion/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 1.02, 0.73, 1] },
  },
};

export function BentoGrid() {
  return (
    <section className="bg-[#FAFAFA] py-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-start gap-6 mb-12 lg:mb-16 text-left"
        >
          <div className="flex w-fit items-center gap-2 rounded-full bg-[#FFFFFE] px-4 py-2 border border-slate-50">
            <div className="h-2 w-2 bg-[#F59E0B]" />
            <span className="text-xl font-medium font-['Inter'] leading-6 text-[#F59E0B] tracking-wider capitalize">
              Clarity, simplified
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between w-full gap-6 lg:gap-40">
            <h2 className="text-[32px] lg:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1B1B1B] lg:max-w-none whitespace-nowrap">
              How <span className="text-[#1565C0]">Clinsight</span> Works
            </h2>
            <p className="max-w-xl lg:max-w-2xl text-[16px] lg:text-[18px] font-normal leading-[1.5] tracking-[-0.01em] text-[#5E5E5E]">
              Through intelligent analysis and expert validation, Clinsight turns complex data into
              structured insights you can understand and act on.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Card 1 — Upload */}
          <motion.div
            variants={itemVariants}
            className="md:row-span-2 bg-white rounded-3xl border border-[#1B1B1B14] shadow-sm overflow-hidden flex flex-col group"
          >
            <div className="relative w-full flex-1 min-h-[300px] overflow-hidden">
              <Image
                src="/assets/how-it-works/Rectangle 34624420.png"
                alt="Upload Step"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/how-it-works/mynaui_one-waves-solid.svg"
                  alt="1"
                  width={36}
                  height={36}
                />
                <h3 className="text-xl font-bold text-[#1B1B1B]">Upload your lab result</h3>
              </div>
              <p className="text-[#5E5E5E] leading-relaxed text-sm">
                Easily upload your hard-to-understand report as a PDF or image in seconds.
              </p>

              <Link href="/waitlist">
                <Button
                  type="button"
                  className="w-full rounded-2xl py-6 bg-[#1565C0] hover:bg-[#1255A8] font-bold text-base mt-2 transition-all active:scale-[0.98]"
                >
                  Get Started on Clinsight
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-[#1B1B1B14] shadow-sm overflow-hidden flex flex-col"
          >
            <div className="bg-[#F8FAFC] px-6 pt-6 pb-0 flex items-end justify-center overflow-hidden h-[220px]">
              <div className="w-full h-full bg-white rounded-t-2xl border-t-2 border-l-2 border-r-2 border-[#1565C0] p-5 relative shadow-[0px_-6px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Image
                        src="/assets/how-it-works/ai-scan.svg"
                        alt="AI"
                        width={20}
                        height={20}
                      />
                    </motion.div>
                    <span className="text-[#1B1B1B] text-sm font-semibold">Advanced Analysis</span>
                  </div>

                  <div className="relative w-max">
                    <div className="bg-[#FEF9E6] rounded-xl px-3 py-2 flex items-center gap-2 border-b border-[#E5E7EB] shadow-sm">
                      <div className="p-1.5 bg-[#F59E0B] rounded-lg">
                        <Image
                          src="/assets/how-it-works/note.svg"
                          alt="Note"
                          width={16}
                          height={16}
                          className="invert brightness-200"
                        />
                      </div>
                      <span className="text-[#F59E0B] text-sm font-semibold pr-3">
                        Analyze Lab Result
                      </span>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0], y: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="absolute -right-4 -bottom-5 w-9 h-9 z-20"
                    >
                      <Image
                        src="/assets/how-it-works/Vector.svg"
                        alt="Cursor"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[0.9, 0.7, 0.5].map((w, i) => (
                      <div
                        key={i}
                        className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden relative"
                      >
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1565C0]/5 to-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/how-it-works/mynaui_two-waves-solid.svg"
                  alt="2"
                  width={32}
                  height={32}
                />
                <h3 className="text-lg font-bold text-[#1B1B1B]">AI analyzes your data</h3>
              </div>
              <p className="text-[#5E5E5E] text-sm leading-relaxed">
                Our system extracts and interprets your lab values instantly.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-[#1B1B1B14] shadow-sm overflow-hidden flex flex-col group"
          >
            <div className="relative w-full h-[220px] overflow-hidden">
              <Image
                src="/assets/how-it-works/Rectangle 34624421.png"
                alt="Insights"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/how-it-works/mynaui_three-waves-solid.svg"
                  alt="3"
                  width={32}
                  height={32}
                />
                <h3 className="text-lg font-bold text-[#1B1B1B]">Get clear explanations</h3>
              </div>
              <p className="text-[#5E5E5E] text-sm leading-relaxed">
                See a simple, structured breakdown of what your results mean.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-2 relative flex flex-col md:block rounded-3xl overflow-hidden border border-[#1B1B1B14] bg-white md:bg-transparent md:h-72 group"
          >
            <div className="hidden md:block">
              <Image
                src="/assets/how-it-works/Frame 2147230221.png"
                alt="Consultation"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </div>

            <div className="md:hidden p-4">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#F1F5F9]">
                <Image
                  src="/assets/how-it-works/Rectangle 34624423.png"
                  alt="Mobile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="relative md:absolute md:bottom-0 md:left-0 md:right-0 p-6 md:p-8 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 shrink-0 text-[#935F07] md:text-[#FEF0DA]"
                  style={{
                    maskImage: 'url("/assets/how-it-works/mynaui_four-waves-solid.svg")',
                    WebkitMaskImage: 'url("/assets/how-it-works/mynaui_four-waves-solid.svg")',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    backgroundColor: 'currentColor',
                  }}
                />
                <h3 className="text-xl md:text-[24px] font-bold text-[#1B1B1B] md:text-white">
                  Ask follow up <span>questions</span>
                </h3>
              </div>
              <p className="text-[#5E5E5E] md:text-slate-200 text-[15px] md:text-base leading-relaxed ml-12">
                AI provides suggested follow up questions to give you insights on your results.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

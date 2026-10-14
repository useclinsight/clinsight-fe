'use client';
import { motion } from 'motion/react';
import { StepCard } from './StepCard';

const steps = [
  {
    n: '01',
    t: 'Upload Results',
    d: 'Simply drag and drop your lab results whether it’s a PDF or a clear image and we’ll securely take it from there.',
  },
  {
    n: '02',
    t: 'We Extract Your Data',
    d: 'Our system carefully reads your report and pulls out the key health markers, organising everything clearly so nothing important is missed.',
  },
  {
    n: '03',
    t: 'View Your Insights',
    d: 'We turn complex medical data into simple, easy to understand insights highlighting what’s normal, what needs attention, and what it means for you.',
  },
  {
    n: '04',
    t: 'We Give Recommendations',
    d: 'Our system provides a detailed recommendation based on the results uploaded. This is a guide and not a medical diagnosis.',
  },
  {
    n: '05',
    t: 'Choose & Complete Your Request',
    d: 'Get matched with an available doctor or choose one yourself, then complete your request securely to receive expert feedback on your results.',
  },
];

const cardPositions = [
  'top-[0%] left-[75%] lg:left-[78%] -translate-x-1/2',
  'top-[20%] left-[25%] lg:left-[22%] -translate-x-1/2',
  'top-[40%] left-[75%] lg:left-[78%] -translate-x-1/2',
  'top-[60%] left-[25%] lg:left-[22%] -translate-x-1/2',
  'top-[80%] left-[75%] lg:left-[78%] -translate-x-1/2',
];

export function ProcessPath() {
  return (
    <section className="relative py-16 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6 relative max-w-[1200px] flex justify-center">
        <div className="relative h-[900px] sm:h-[1000px] lg:h-[2500px] w-full mt-10">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id="reveal-clip">
                <motion.rect
                  x="0"
                  y="0"
                  width="100%"
                  initial={{ height: '0%' }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 3.5, ease: 'easeInOut' }}
                />
              </clipPath>
            </defs>

            <path
              className="lg:hidden"
              d="M 75 0 C 75 10, 25 10, 25 20 C 25 30, 75 30, 75 40 C 75 50, 25 50, 25 60 C 25 70, 75 70, 75 80"
              fill="none"
              stroke="#1565C0"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              clipPath="url(#reveal-clip)"
            />

            <path
              className="hidden lg:block"
              d="M 78 0 C 78 10, 22 10, 22 20 C 22 30, 78 30, 78 40 C 78 50, 22 50, 22 60 C 22 70, 78 70, 78 80"
              fill="none"
              stroke="#1565C0"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              clipPath="url(#reveal-clip)"
            />
          </svg>

          {steps.map((step, idx) => {
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className={`
                  absolute z-10 
                  w-[160px] sm:w-[260px] lg:max-w-none lg:w-[400px] 
                  ${cardPositions[idx]}
                `}
              >
                <StepCard index={idx} number={step.n} title={step.t} description={step.d} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

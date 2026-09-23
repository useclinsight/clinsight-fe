'use client';

import { motion } from 'motion/react';
import { terms } from './terms';

export default function TermsContent() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col"
    >
      <div className="relative flex max-lg:bg-[#11519A] flex-col justify-center items-center h-77 gap-6">
        <div
          className="lg:hidden absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/assets/terms-and-conditions/circle-bg.png)`,
          }}
        />
        <div
          className="max-lg:hidden absolute inset-0 -z-10 bg-center w-full bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(/assets/terms-and-conditions/circle-bg-web.png)`,
          }}
        />
        <motion.h1
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[2rem] sm:text-[2.5rem] text-white font-semibold"
        >
          Terms and Conditions
        </motion.h1>
        <motion.p
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="text-base text-white"
        >
          Last Updated, May 2026
        </motion.p>
      </div>

      <div className="flex bg-[#FAFAFA] py-14 md:py-20 justify-center items-center">
        <div className="flex bg-[#FFFFFE] py-6 px-5 rounded-[12px] w-9/10 flex-col items-center gap-8">
          {terms.map((term, index) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="w-full flex flex-col gap-6 border-b border-[#E0E0E0] last:border-0 pb-8"
            >
              <h2 className="text-2xl font-semibold">{term.title}</h2>
              <div>
                <p className="text-[#5E5E5E]">{term.content}</p>
                {term.subcontent && <p className="text-[#5E5E5E]">{term.subcontent}</p>}
                {term.bulletTop && <p className="text-[#5E5E5E]">{term.bulletTop}</p>}
              </div>
              {term.bullets && (
                <ul className="list-inside list-disc">
                  {term.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="text-[#5E5E5E]">
                      {typeof bullet === 'string' ? (
                        bullet
                      ) : (
                        <>
                          {bullet.label}:{' '}
                          <span className="font-semibold text-[#1B1B1B]">{bullet.value}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

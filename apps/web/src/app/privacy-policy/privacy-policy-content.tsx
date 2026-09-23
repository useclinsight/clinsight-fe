'use client';

import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  CONTACT_US,
  COOKIES,
  DATA_COLLECTED,
  DATA_USE,
  INTRODUCTION,
  YOUR_RIGHTS,
} from '@/lib/privacy-policy-constants';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

function AnimatedSection({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-6%' }}
      className="border-b border-border pb-8 last:border-0 last:pb-0"
    >
      <h2 className="mb-3 text-base font-semibold text-foreground">
        {index}. {title}
      </h2>
      {children}
    </motion.section>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <motion.ul
      className="mt-2 space-y-1"
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-6%' }}
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={listItemVariants}
          className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
        >
          <span className="mt-2.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
          <span>{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default function PrivacyPolicyContent() {
  return (
    <main className="flex-1">
      {/* Blue hero header */}
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
          Privacy Policy
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

      {/* Content card */}
      <div className="bg-[#FAFAFA] flex py-14 md:py-20 justify-center items-center">
        <div className="flex bg-[#FEFEFE] py-6 px-5 rounded-[12px] w-85/100 flex-col items-center gap-8">
          <motion.article
            className="w-full flex flex-col gap-6 border-b border-border last:border-0 pb-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            {/* 1. Introduction */}
            <AnimatedSection index={1} title={INTRODUCTION.title}>
              <BodyText>{INTRODUCTION.content}</BodyText>
              {INTRODUCTION.footerContent && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {INTRODUCTION.footerContent}
                </p>
              )}
            </AnimatedSection>

            {/* 2. Data Collection */}
            <AnimatedSection index={2} title={DATA_COLLECTED.title}>
              <BodyText>{DATA_COLLECTED.content}</BodyText>
              <div className="mt-3 space-y-4">
                {DATA_COLLECTED.dataCollectedType.map((dataType) => (
                  <div key={dataType.title}>
                    <p className="text-sm font-semibold text-foreground">{dataType.title}</p>
                    <BulletList items={dataType.content} />
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* 3. Uses of Data */}
            <AnimatedSection index={3} title={DATA_USE.title}>
              <BodyText>{DATA_USE.content}</BodyText>
              <BulletList items={DATA_USE.uses} />
              {DATA_USE.footerContent && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {DATA_USE.footerContent}
                </p>
              )}
            </AnimatedSection>

            {/* 4. Cookies */}
            <AnimatedSection index={4} title={COOKIES.title}>
              <BodyText>{COOKIES.content}</BodyText>
              <BulletList items={COOKIES.uses} />
              {COOKIES.footerContent && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {COOKIES.footerContent}
                </p>
              )}
            </AnimatedSection>

            {/* 5. Your Rights */}
            <AnimatedSection index={5} title={YOUR_RIGHTS.title}>
              <BodyText>{YOUR_RIGHTS.content}</BodyText>
              <BulletList items={YOUR_RIGHTS.rights} />
              {YOUR_RIGHTS.footerContent && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {YOUR_RIGHTS.footerContent}
                </p>
              )}
            </AnimatedSection>

            {/* 6. Contact Us */}
            <AnimatedSection index={6} title={CONTACT_US.title}>
              {CONTACT_US.content && <BodyText>{CONTACT_US.content}</BodyText>}
              <motion.ul
                className="mt-2 space-y-1"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-6%' }}
              >
                {CONTACT_US.contactInfo
                  .filter((item) => item.value.trim().length > 0)
                  .map((item) => (
                    <motion.li
                      key={item.label}
                      variants={listItemVariants}
                      className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                      <span>
                        <span className="text-muted-foreground">{item.label}:</span>{' '}
                        {item.label.toLowerCase() === 'email' ? (
                          <a
                            href={`mailto:${item.value}`}
                            className="font-semibold text-foreground underline-offset-2 hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : item.label.toLowerCase() === 'phone' ? (
                          <span className="font-semibold text-foreground">{item.value}</span>
                        ) : (
                          item.value
                        )}
                      </span>
                    </motion.li>
                  ))}
              </motion.ul>
            </AnimatedSection>
          </motion.article>
        </div>
      </div>
    </main>
  );
}

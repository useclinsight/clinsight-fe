'use client';

import { Button } from '@clinsight/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PatientLegalLinks } from './PatientLegalLinks';

const slides = [
  {
    title: 'Understand your lab results',
    description: 'Upload your lab report and get a clear, simple explanation in seconds',
    image: 'assessment-cards.png',
  },
  {
    title: 'No more guessing your results',
    description:
      "Get clear explanations for every value and understand what's happening in your body",
    image: 'before-after.png',
  },
  {
    title: "Get a doctor's second opinion",
    description: 'You can request a verified doctor to review your results for an additional fee.',
    image: 'doctor-orbit.png',
  },
];

export function PatientWelcome({ guestEnabled }: { guestEnabled: boolean }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const { title, description, image } = slides[activeSlide];

  return (
    <main className="min-h-dvh bg-white px-5 py-7 sm:px-10 lg:px-16 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <Image
          src="/assets/header-assets/clinsight-logo.svg"
          alt="Clinsight"
          width={148}
          height={39}
        />
        <section className="mt-5 grid items-center gap-7 md:mt-10 md:grid-cols-[1.15fr_1fr] md:gap-10 lg:gap-16">
          <div className="relative mx-auto h-[clamp(13rem,35dvh,25rem)] w-full rounded-3xl bg-[#eff5fc] md:h-[min(65dvh,36rem)]">
            <Image
              src={'/assets/onboarding/' + image}
              alt=""
              fill
              sizes="(min-width: 768px) 52vw, 90vw"
              className="object-contain p-6 md:p-12"
              loading={activeSlide === 0 ? 'eager' : 'lazy'}
            />
          </div>
          <div className="mx-auto w-full max-w-105 text-center md:text-left">
            <div aria-live="polite" aria-atomic="true">
              <h1 className="text-[clamp(1.65rem,4.2vw,3.25rem)] leading-tight font-semibold tracking-tight text-gray-900">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {description}
              </p>
            </div>
            <div
              className="mt-3 flex justify-center md:justify-start"
              role="group"
              aria-label="Onboarding slides"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  className="grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-primary-blue"
                  aria-label={slide.title}
                  aria-pressed={index === activeSlide}
                  onClick={() => setActiveSlide(index)}
                >
                  <span
                    aria-hidden="true"
                    className={
                      'h-2.5 rounded-full ' +
                      (index === activeSlide ? 'w-6 bg-primary-blue' : 'w-2.5 bg-slate-400')
                    }
                  />
                </button>
              ))}
            </div>
            <div className="mt-2 grid gap-3">
              <Button asChild variant="brand" className="h-12 rounded-xl text-base">
                <Link href="/signup">Get started</Link>
              </Button>
              {guestEnabled && (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border-gray-300 bg-white text-base text-gray-800"
                >
                  <Link href="/guest/upload">Continue as guest</Link>
                </Button>
              )}
            </div>
            <p className="mt-4 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary-blue underline underline-offset-2"
              >
                Login
              </Link>
            </p>
            <PatientLegalLinks />
          </div>
        </section>
      </div>
    </main>
  );
}

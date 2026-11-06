import type { ReactNode } from 'react';
import { BookCover } from './BookCover';
import { LeadForm } from './LeadForm';

type SqueezeHeroProps = {
  title?: ReactNode;
  description?: string;
};

export function SqueezeHero({ title, description }: SqueezeHeroProps) {
  return (
    <section className="container mx-auto px-6 pt-8 pb-12 lg:px-12 lg:pt-16 lg:pb-20">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Copy + form */}
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <h1 className="text-3xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {title ?? (
              <>
                <span className="text-primary-blue">FIVE</span> LAB VALUES EVERY NIGERIAN SHOULD{' '}
                <span className="text-primary-blue">UNDERSTAND</span>
              </>
            )}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 lg:text-base">
            {description ??
              'You just got your lab results, but what do they actually mean? Stop copy-pasting confusing acronyms into Google panic spirals. Download this simple guide to decode your numbers before your next doctor visit.'}
          </p>

          <div className="mt-6 flex w-full justify-center lg:mt-8 lg:justify-start">
            <LeadForm />
          </div>
        </div>

        {/* Book visual */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="flex w-full max-w-md items-center justify-center rounded-3xl bg-[#EAF1FB] px-8 py-12 lg:px-12 lg:py-16">
            <BookCover />
          </div>
        </div>
      </div>
    </section>
  );
}

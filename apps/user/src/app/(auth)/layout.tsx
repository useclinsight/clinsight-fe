import Image from 'next/image';
import { PatientLegalLinks } from '@/components/PatientLegalLinks';

export default function PatientAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-white lg:grid lg:grid-cols-[45%_1fr]">
      <div className="sticky top-0 hidden h-dvh overflow-hidden bg-slate-100 lg:block">
        <Image
          src="/assets/login-page-assets/patient-reviewing-results.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 1px"
          className="object-cover object-center"
        />
        <Image
          src="/assets/header-assets/clinsight-logo.svg"
          alt="Clinsight"
          width={154}
          height={40}
          className="absolute top-10 left-10 h-auto"
        />
      </div>
      <div className="px-5 pt-[30px] pb-12 sm:px-8 lg:flex lg:items-center lg:justify-center lg:py-10">
        <div className="mx-auto w-full max-w-105">
          <Image
            src="/assets/header-assets/clinsight-logo.svg"
            alt="Clinsight"
            width={132}
            height={34}
            className="mb-9 h-auto lg:hidden"
          />
          {children}
          <PatientLegalLinks />
        </div>
      </div>
    </main>
  );
}

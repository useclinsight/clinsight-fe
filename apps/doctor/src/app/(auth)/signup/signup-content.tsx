import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { SignupForm } from '@/components/auth/SignupForm';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '400' });

export default function SignupContent() {
  return (
    <main className="min-h-dvh w-full bg-[#fffffe] lg:bg-white">
      <div className="grid min-h-dvh w-full lg:grid-cols-[minmax(0,698fr)_minmax(0,702fr)] lg:py-10 lg:pl-10">
        <aside
          className="relative hidden min-h-[620px] overflow-hidden rounded-[20px] select-none lg:block"
          aria-label="Clinsight doctors"
        >
          <Image
            src="/assets/signup-design/doctor.png"
            alt="Doctor wearing a surgical mask and stethoscope"
            fill
            sizes="(min-width: 1440px) 698px, 50vw"
            className="object-cover object-center [@media(max-height:900px)]:object-[center_40%]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,23,46,0)_14.792%,rgba(6,10,16,0.8)_96.085%)]" />
          <div className="absolute left-9 top-9 flex items-center gap-[4.087px] text-white">
            <Image src="/assets/signup-design/logo-mark.svg" alt="" width={33.0375} height={41} />
            <span className="text-[20.436px] leading-none tracking-[-0.4087px]">Clinsight</span>
          </div>
          <figure className="absolute top-[60.5%] right-9 flex w-[300px] origin-top-right flex-col gap-4 rounded-[14px] bg-white px-[18px] py-4 shadow-[0_10px_28px_rgba(13,20,31,0.18)] [@media(max-width:1199px)]:scale-[0.86] [@media(max-height:820px)]:scale-[0.86]">
            <blockquote className="flex flex-col gap-1">
              <span
                aria-hidden="true"
                className={`${playfair.className} h-[13px] text-[34px] leading-6 text-primary-blue`}
              >
                “
              </span>
              <p className="text-[13px] leading-[19px] text-[#334155]">
                I review cases between clinics. It fits my schedule instead of the other way round.
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-2.5">
              <div className="relative size-[30px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/assets/signup-design/avatar.png"
                  alt=""
                  width={45}
                  height={30}
                  className="absolute -top-[0.423px] -left-[7.941px] h-[30px] w-[45px] max-w-none"
                />
              </div>
              <div className="flex flex-col gap-px">
                <p className="text-[12.5px] font-semibold leading-[17px] text-text-primary">
                  Dr. Amaka Obi
                </p>
                <p className="text-[10.5px] leading-[15px] text-[#64748b]">Haematologist · Lagos</p>
              </div>
            </figcaption>
          </figure>
          <div className="absolute bottom-[60px] left-[41px] right-6 text-white">
            <h2 className={`${playfair.className} text-[38px] leading-[46px]`}>
              Your expertise,
              <br />
              where it’s needed.
            </h2>
            <p className="mt-2 text-[15px] leading-[normal] text-white/85">
              Review real patient cases on your own schedule.
            </p>
          </div>
        </aside>
        <section className="flex min-w-0 items-start justify-center px-4 pb-10 pt-[78px] lg:items-center lg:px-6 lg:py-4">
          <div className="w-full max-w-[520px]">
            <SignupForm />
          </div>
        </section>
      </div>
    </main>
  );
}

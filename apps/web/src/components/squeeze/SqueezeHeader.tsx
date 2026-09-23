import Image from 'next/image';
import Link from 'next/link';

/**
 * Minimal header for the squeeze (lead-magnet) page — just the brand mark and a
 * localisation tagline. The global site <Header> is hidden on this route.
 */
export function SqueezeHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#F5F5F5] bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:h-20 lg:px-12">
        <Link href="/" className="flex items-center" aria-label="Clinsight home">
          <span className="relative block h-7 w-28 lg:h-9 lg:w-32">
            <Image
              src="/assets/header-assets/clinsight-logo.svg"
              alt="Clinsight"
              fill
              sizes="(max-width: 1024px) 112px, 128px"
              className="object-contain object-left"
              priority
            />
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Image
            src="/assets/squeeze/nigeria_flag.png"
            alt="Nigerian flag"
            width={18}
            height={12}
            className="h-3 w-auto rounded-xs ring-1 ring-black/5"
          />
          <span className="text-[11px] font-medium text-slate-700 sm:text-sm">
            Built for Nigerians, by Nigerians.
          </span>
        </div>
      </div>
    </header>
  );
}

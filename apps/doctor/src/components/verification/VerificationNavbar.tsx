'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function VerificationNavbar() {
  return (
    <div className="flex items-center justify-between w-full lg:hidden">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <div className="relative w-[140px] h-[36px]">
          <Image
            src="/assets/header-assets/clinsight-logo.svg"
            alt="Clinsight Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const FOOTER_LINKS = {
  platform: [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Join Waitlist', href: '/waitlist' },
    { name: 'FAQs', href: '/faqs' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms and Conditions', href: '/terms-and-conditions' },
    { name: 'Delete Account', href: '/delete-account' },
  ],
};

export function Footer() {
  const pathname = usePathname();

  const hideOnRoutes = [
    '/waitlist',
    '/signup',
    '/login',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
    '/payment',
    '/verification/professional-info',
    '/verification/credentials-verification',
    '/verification/verification-complete',
  ];
  if (
    hideOnRoutes.includes(pathname) ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/verification')
  ) {
    return null;
  }
  return (
    <footer className="relative overflow-hidden bg-[#11519A] pt-12 pb-10 text-white">
      {/* Background Image Asset - Responsive Positioning */}
      <div className="absolute top-0 left-0 lg:left-auto lg:right-0 h-full w-full lg:w-1/2 pointer-events-none z-0 opacity-40 lg:opacity-100">
        <Image
          src="/assets/header-assets/footer-bg-image.svg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-left lg:object-right"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Tier 1: Logo only */}
        <div className="mb-8 flex justify-start">
          <div className="relative h-8 w-30 lg:h-10 lg:w-35">
            <Image
              src="/assets/header-assets/clinsight-logo.svg"
              alt="Clinsight Logo"
              fill
              sizes="(max-width: 1024px) 120px, 140px"
              className="object-contain object-left brightness-0 invert"
            />
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/10 w-full mb-8 lg:mb-12" />

        {/* Tier 2: Text on Left, 3 Columns of Links on Right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between items-start text-left">
          {/* Left: Brand Description */}
          <div className="flex flex-col gap-6 max-w-sm">
            <p className="text-[14px] leading-relaxed opacity-80">
              Clinsight helps you turn complex medical reports into clear, simple explanations you
              can actually understand.
            </p>
          </div>

          {/* Mobile Separator between Description and Links */}
          <div className="border-t border-white/10 w-full lg:hidden" />

          {/* Right: Links Grid (3 Columns) - 40px gap */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-10 w-full lg:w-auto">
            <div className="flex flex-col gap-4 lg:gap-6">
              <h4 className="text-sm font-bold uppercase tracking-wider">Platform</h4>
              <ul className="flex flex-col gap-3 lg:gap-6">
                {FOOTER_LINKS.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <h4 className="text-sm font-bold uppercase tracking-wider">Company</h4>
              <ul className="flex flex-col gap-3 lg:gap-6">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 lg:gap-6">
              <h4 className="text-sm font-bold uppercase tracking-wider">Legal</h4>
              <ul className="flex flex-col gap-3 lg:gap-6">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/10 w-full mt-12 lg:mt-20 mb-8" />

        {/* Tier 3: All rights reserved - Left aligned with dynamic year */}
        <div className="flex items-center justify-start">
          <p className="text-[10px] lg:text-xs opacity-50">
            ©{new Date().getFullYear()}. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

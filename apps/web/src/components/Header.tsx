'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'motion/react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'How It Works', href: '/how-it-works' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const hideOnRoutes = [
    '/waitlist',
    '/squeeze',
    '/resources/5-lab-values-every-nigerian-should-understand',
    '/delete-account',
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
    pathname.startsWith('/resources/') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/verification')
  ) {
    return null;
  }

  const handleDownload = () => {
    router.push('/waitlist');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F5F5F5] bg-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="relative h-8 w-30 lg:h-10 lg:w-35">
            <Image
              src="/assets/header-assets/clinsight-logo.svg"
              alt="Clinsight Logo"
              fill
              sizes="(max-width: 1024px) 120px, 140px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-brand-blue cursor-pointer ${
                  isActive ? 'text-brand-blue' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            type="button"
            onClick={handleDownload}
            className="flex w-56.5 h-[46.1px] items-center justify-center gap-4 rounded-[12px] border border-[#D0D0D0] bg-[#FFFFFE] px-4 py-3 text-xs font-bold text-slate-900 transition-all hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/assets/header-assets/google-play-icon.svg"
                alt=""
                width={18}
                height={18}
              />
              <Image
                src="/assets/header-assets/apple-app-store.svg"
                alt=""
                width={18}
                height={18}
              />
            </div>
            <span>Download Clinsight</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex lg:hidden items-center justify-center p-2 text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <HugeiconsIcon icon={Cancel01Icon} size={24} />
          ) : (
            <div className="flex flex-col items-start gap-1.5">
              <span className="h-0.5 w-6 rounded-full bg-slate-900" />
              <span className="h-0.5 w-4 rounded-full bg-slate-900" />
            </div>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 right-0 z-40 border-b 
            border-[#F5F5F5] bg-white p-6 shadow-xl lg:hidden"
          >
            <nav className="flex flex-col gap-10">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-medium transition-colors ${
                      isActive ? 'text-brand-blue' : 'text-slate-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-4 rounded-[12px] border border-[#D0D0D0] bg-[#FFFFFE] px-4 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/header-assets/google-play-icon.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                  <Image
                    src="/assets/header-assets/apple-app-store.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
                <span>Download Clinsight</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

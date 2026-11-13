import { Header } from '@/components/Header';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Footer } from '@/components/Footer';
import { ComingSoonProvider } from '@/components/coming-soon';
import { Toaster } from '@/components/ui/sonner';
import { AnalyticsProvider } from '@/providers/AnalyticsProvider';
import { getPublicSiteUrl } from '@/lib/site-url';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const appUrl = getPublicSiteUrl();
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Clinsight';
const siteTitle = 'Clinsight | Understand Your Lab Results in Minutes';
const siteDescription =
  'Clinsight uses AI to explain complex lab results in plain language, helping you better understand your health before speaking with your doctor.';
const facebookDomainVerification = process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  title: {
    default: siteTitle,
    template: `%s · ${appName}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    siteName: appName,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Clinsight' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  other: facebookDomainVerification
    ? { 'facebook-domain-verification': facebookDomainVerification }
    : undefined,
  icons: {
    icon: '/clinsight-favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', inter.variable, 'font-sans')}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-neutral-50" suppressHydrationWarning>
        {metaPixelId && (
          <Script id="meta-pixel-base" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`}
          </Script>
        )}
        {gaMeasurementId && (
          <>
            <Script id="ga4-base" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaMeasurementId)});`}
            </Script>
            <Script
              id="ga4-library"
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
              strategy="afterInteractive"
            />
          </>
        )}
        <AnalyticsProvider>
          <ComingSoonProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </ComingSoonProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}

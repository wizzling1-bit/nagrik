import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader, Outfit, Caveat } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serifFont = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false,
});

const displayFont = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const scriptFont = Caveat({
  subsets: ['latin'],
  variable: '--font-script',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'नागरिक (Naagrik) - India’s Premier Hyperlocal Civic Journalism Platform',
  description: 'Instant local updates, verified ground reports, and short-form civic news. Real voices, real stories, real accountability.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nagrik.news'),
  openGraph: {
    title: 'नागरिक (Naagrik) - India’s Premier Hyperlocal Civic Journalism Platform',
    description: 'Instant local updates, verified ground reports, and short-form civic news directly from your neighborhood.',
    url: 'https://nagrik.news',
    siteName: 'Naagrik News',
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'नागरिक (Naagrik) - Hyperlocal Civic Journalism Platform',
    description: 'Instant local updates, verified ground reports, and short-form civic news.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${sansFont.variable} ${serifFont.variable} ${displayFont.variable} ${scriptFont.variable}`}>
      <body className="text-content font-sans antialiased selection:bg-[#DE5227] selection:text-white min-h-screen flex flex-col transition-colors duration-200">
        <Providers>
          <Navbar />
          <div className="flex-1 relative z-10">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

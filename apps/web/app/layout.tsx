import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
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
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false,
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
    <html lang="hi" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body className="bg-newspaper-100 text-newspaper-900 dark:bg-ink-950 dark:text-ink-100 font-sans antialiased selection:bg-brand-500 selection:text-white min-h-screen flex flex-col transition-colors duration-200">
        <Providers>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

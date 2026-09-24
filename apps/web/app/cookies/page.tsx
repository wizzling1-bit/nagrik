import type { Metadata } from 'next';
import { CookiesView } from '@/views/CookiesView';

export const metadata: Metadata = {
  title: 'Cookie & Local Storage Policy | नागरिक (Nagrik)',
  description:
    'Learn how Nagrik uses essential session tokens, functional locality preferences, and dwell-time telemetry without cross-site tracking.',
  alternates: {
    canonical: 'https://nagrik.news/cookies',
  },
  openGraph: {
    title: 'Cookie & Local Storage Policy | नागरिक (Nagrik)',
    description:
      'Transparency in local storage and cookies for India’s citizen journalism platform.',
    url: 'https://nagrik.news/cookies',
    type: 'website',
  },
};

export default function CookiesPage() {
  return <CookiesView />;
}

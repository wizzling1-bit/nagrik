import type { Metadata } from 'next';
import { AdvertisingView } from '@/views/AdvertisingView';

export const metadata: Metadata = {
  title: 'Advertising & Sponsored Content Policy | नागरिक (Nagrik)',
  description:
    'Our commercial advertising policy. Learn how Nagrik enforces strict separation between editorial journalism and advertising, and our rules on sponsored content.',
  alternates: {
    canonical: 'https://nagrik.news/advertising',
  },
  openGraph: {
    title: 'Advertising & Sponsored Content Policy | नागरिक (Nagrik)',
    description:
      'Clear rules on sponsored content labeling, AdMob UMP consent, and editorial independence on Nagrik.',
    url: 'https://nagrik.news/advertising',
    type: 'website',
  },
};

export default function AdvertisingPage() {
  return <AdvertisingView />;
}

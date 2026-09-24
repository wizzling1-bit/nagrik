import type { Metadata } from 'next';
import { AboutView } from '@/views/AboutView';

export const metadata: Metadata = {
  title: 'About Us & The Citizen Journalism Manifesto | नागरिक (Nagrik)',
  description:
    'Discover Nagrik: India’s decentralized hyperlocal citizen journalism platform. Learn about our 5km Wire network, 3-tier truth verification protocol, and creator economic model.',
  alternates: {
    canonical: 'https://nagrik.news/about',
  },
  openGraph: {
    title: 'About Us & The Citizen Journalism Manifesto | नागरिक (Nagrik)',
    description:
      'Re-centering Indian journalism around ground reality. Real voices, real stories, real accountability.',
    url: 'https://nagrik.news/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutView />;
}

import type { Metadata } from 'next';
import { TransparencyView } from '@/views/TransparencyView';

export const metadata: Metadata = {
  title: 'Transparency & Sourcing Disclosure | नागरिक (Nagrik)',
  description:
    'How news is published, categorized, and sourced on Nagrik. Understand our 7 content streams from original ground reporting to government bulletins.',
  alternates: {
    canonical: 'https://nagrik.news/transparency',
  },
  openGraph: {
    title: 'Transparency & Sourcing Disclosure | नागरिक (Nagrik)',
    description:
      'Transparent disclosure of our hyperlocal journalism model, source attribution, and editorial oversight.',
    url: 'https://nagrik.news/transparency',
    type: 'website',
  },
};

export default function TransparencyPage() {
  return <TransparencyView />;
}

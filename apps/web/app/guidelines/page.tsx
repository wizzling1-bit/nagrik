import type { Metadata } from 'next';
import { EditorialGuidelinesView } from '@/views/EditorialGuidelinesView';

export const metadata: Metadata = {
  title: 'Editorial Standards & Guidelines | नागरिक (Nagrik)',
  description:
    'Comprehensive editorial standards, citizen reporter code of conduct, synthetic media & deepfake rules, fact-checking requirements, and corrections protocol for Nagrik.',
  alternates: {
    canonical: 'https://nagrik.news/editorial-guidelines',
  },
  openGraph: {
    title: 'Editorial Standards & Guidelines | नागरिक (Nagrik)',
    description:
      'Integrity charter for decentralized citizen journalism across India. Zero tolerance for hate speech, deepfakes, or unverified claims.',
    url: 'https://nagrik.news/editorial-guidelines',
    type: 'website',
  },
};

export default function GuidelinesPage() {
  return <EditorialGuidelinesView />;
}

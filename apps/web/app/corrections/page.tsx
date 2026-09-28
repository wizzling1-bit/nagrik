import type { Metadata } from 'next';
import { CorrectionsView } from '@/views/CorrectionsView';

export const metadata: Metadata = {
  title: 'Corrections & Retractions Policy | नागरिक (Nagrik)',
  description:
    'Our public commitment to accuracy. Learn how to report an error, how substantive corrections are appended, and how retractions are handled on Nagrik.',
  alternates: {
    canonical: 'https://nagrik.news/corrections',
  },
  openGraph: {
    title: 'Corrections & Retractions Policy | नागरिक (Nagrik)',
    description:
      'Transparent procedures for reporting factual errors, updating timestamps, and publishing correction notes on Nagrik.',
    url: 'https://nagrik.news/corrections',
    type: 'website',
  },
};

export default function CorrectionsPage() {
  return <CorrectionsView />;
}

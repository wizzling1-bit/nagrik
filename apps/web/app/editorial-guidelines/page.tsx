import type { Metadata } from 'next';
import { EditorialGuidelinesView } from '@/views/EditorialGuidelinesView';

export const metadata: Metadata = {
  title: 'Editorial Guidelines & Standards | नागरिक (Nagrik)',
  description:
    'The 32-point editorial principles governing accuracy, verification, sourcing, corrections, crime reporting, and child safety across the Nagrik hyperlocal news network.',
  alternates: {
    canonical: 'https://nagrik.news/editorial-guidelines',
  },
  openGraph: {
    title: 'Editorial Guidelines & Standards | नागरिक (Nagrik)',
    description:
      'Rigorous principles of accuracy, sourcing, and ethical responsibility guiding hyperlocal citizen journalism in India.',
    url: 'https://nagrik.news/editorial-guidelines',
    type: 'website',
  },
};

export default function EditorialGuidelinesPage() {
  return <EditorialGuidelinesView />;
}

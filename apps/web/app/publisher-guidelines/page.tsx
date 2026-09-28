import type { Metadata } from 'next';
import { PublisherGuidelinesView } from '@/views/PublisherGuidelinesView';

export const metadata: Metadata = {
  title: 'Publisher & Creator Guidelines | नागरिक (Nagrik)',
  description:
    'Operational, ethical, and legal guidelines for citizen journalists, local stringers, and independent publishers publishing on the Nagrik platform.',
  alternates: {
    canonical: 'https://nagrik.news/publisher-guidelines',
  },
  openGraph: {
    title: 'Publisher & Creator Guidelines | नागरिक (Nagrik)',
    description:
      'Clear rules on ground accuracy, IP ownership, video rights, and anti-fraud policies for Nagrik contributors.',
    url: 'https://nagrik.news/publisher-guidelines',
    type: 'website',
  },
};

export default function PublisherGuidelinesPage() {
  return <PublisherGuidelinesView />;
}

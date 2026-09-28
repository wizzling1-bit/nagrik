import type { Metadata } from 'next';
import { CommunityGuidelinesView } from '@/views/CommunityGuidelinesView';

export const metadata: Metadata = {
  title: 'Community Guidelines | नागरिक (Nagrik)',
  description:
    'Guidelines for civic interaction, respectful reading, and reporting inappropriate content on the Nagrik platform.',
  alternates: {
    canonical: 'https://nagrik.news/community-guidelines',
  },
  openGraph: {
    title: 'Community Guidelines | नागरिक (Nagrik)',
    description:
      'Standards for civic conduct, reader participation, and community reporting on Nagrik.',
    url: 'https://nagrik.news/community-guidelines',
    type: 'website',
  },
};

export default function CommunityGuidelinesPage() {
  return <CommunityGuidelinesView />;
}

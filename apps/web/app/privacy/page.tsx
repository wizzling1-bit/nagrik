import type { Metadata } from 'next';
import { PrivacyView } from '@/views/PrivacyView';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection Charter | नागरिक (Nagrik)',
  description:
    'Official Privacy Policy compliant with India’s Digital Personal Data Protection (DPDP) Act, 2023, IT Rules, 2021, and Google Play Store User Data Safety guidelines.',
  alternates: {
    canonical: 'https://nagrik.news/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & Data Protection Charter | नागरिक (Nagrik)',
    description:
      'How Wizzling Pvt Ltd safeguards your personal identity, GPS geofence data, and banking metadata under the DPDP Act 2023.',
    url: 'https://nagrik.news/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyView />;
}

import type { Metadata } from 'next';
import { AccessibilityView } from '@/views/AccessibilityView';

export const metadata: Metadata = {
  title: 'Accessibility Statement | नागरिक (Nagrik)',
  description:
    'Our commitment to digital inclusion, readable typography, high-contrast themes, screen-reader compatibility, and barrier-free civic news access.',
  alternates: {
    canonical: 'https://nagrik.news/accessibility',
  },
  openGraph: {
    title: 'Accessibility Statement | नागरिक (Nagrik)',
    description:
      'Making hyperlocal journalism accessible, readable, and inclusive for all citizens across India.',
    url: 'https://nagrik.news/accessibility',
    type: 'website',
  },
};

export default function AccessibilityPage() {
  return <AccessibilityView />;
}

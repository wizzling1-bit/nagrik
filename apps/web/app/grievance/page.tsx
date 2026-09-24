import type { Metadata } from 'next';
import { GrievanceView } from '@/views/GrievanceView';

export const metadata: Metadata = {
  title: 'Statutory Grievance Redressal Officer | नागरिक (Nagrik)',
  description:
    'Designated Resident Grievance Officer details under Rule 11 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. 24h statutory acknowledgment and 15-day resolution.',
  alternates: {
    canonical: 'https://nagrik.news/grievance',
  },
  openGraph: {
    title: 'Statutory Grievance Redressal Mechanism | नागरिक (Nagrik)',
    description:
      'File an official complaint or content concern with Nagrik’s Resident Grievance Officer under Indian IT Rules 2021.',
    url: 'https://nagrik.news/grievance',
    type: 'website',
  },
};

export default function GrievancePage() {
  return <GrievanceView />;
}

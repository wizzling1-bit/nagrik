import type { Metadata } from 'next';
import { GrievanceView } from '@/views/GrievanceView';

export const metadata: Metadata = {
  title: 'Statutory Grievance Redressal Officer | Wizzling Pvt Ltd',
  description:
    'Official Resident Grievance Officer details for Nagrik under Indian Information Technology Rules 2021. Fast statutory grievance redressal, email, phone, and office address.',
  alternates: {
    canonical: 'https://nagrik.news/grievance-redressal',
  },
  openGraph: {
    title: 'Statutory Grievance Redressal Mechanism | Wizzling Pvt Ltd',
    description:
      'Official Resident Grievance Officer details and filing procedure for Nagrik.',
    url: 'https://nagrik.news/grievance-redressal',
    type: 'website',
  },
};

export default function GrievanceRedressalPage() {
  return <GrievanceView />;
}

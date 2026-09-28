import type { Metadata } from 'next';
import { ReportContentView } from '@/views/ReportContentView';

export const metadata: Metadata = {
  title: 'Report Content or Inaccuracies | नागरिक (Nagrik)',
  description:
    'Report factual inaccuracies, copyright violations, misleading headlines, or safety concerns directly to the Nagrik editorial and moderation desk.',
  alternates: {
    canonical: 'https://nagrik.news/report',
  },
  openGraph: {
    title: 'Report Content or Inaccuracies | नागरिक (Nagrik)',
    description:
      'Direct reporting desk for readers to flag errors, copyright issues, or policy breaches on Nagrik.',
    url: 'https://nagrik.news/report',
    type: 'website',
  },
};

export default function ReportPage() {
  return <ReportContentView />;
}

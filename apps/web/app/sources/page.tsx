import type { Metadata } from 'next';
import { SourcesView } from '@/views/SourcesView';

export const metadata: Metadata = {
  title: 'Sources & Attribution Policy | नागरिक (Nagrik)',
  description:
    'Our rules for clear news attribution. Learn how Nagrik identifies original field reporting, wire services, government bulletins, and community dispatches.',
  alternates: {
    canonical: 'https://nagrik.news/sources',
  },
  openGraph: {
    title: 'Sources & Attribution Policy | नागरिक (Nagrik)',
    description:
      'Clear provenance and attribution rules for every story, video, and photograph on Nagrik.',
    url: 'https://nagrik.news/sources',
    type: 'website',
  },
};

export default function SourcesPage() {
  return <SourcesView />;
}

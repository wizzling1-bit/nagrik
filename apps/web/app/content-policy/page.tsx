import type { Metadata } from 'next';
import { ContentPolicyView } from '@/views/ContentPolicyView';

export const metadata: Metadata = {
  title: 'Content Policy & Moderation Rules | नागरिक (Nagrik)',
  description:
    'Comprehensive safety and moderation rules defining allowed and prohibited content across Nagrik articles, videos, citizen dispatches, and publisher studio.',
  alternates: {
    canonical: 'https://nagrik.news/content-policy',
  },
  openGraph: {
    title: 'Content Policy & Moderation Rules | नागरिक (Nagrik)',
    description:
      'Clear prohibitions on hate speech, deepfakes, violence, doxxing, and disinformation on Nagrik.',
    url: 'https://nagrik.news/content-policy',
    type: 'website',
  },
};

export default function ContentPolicyPage() {
  return <ContentPolicyView />;
}

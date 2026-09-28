import type { Metadata } from 'next';
import { CopyrightView } from '@/views/CopyrightView';

export const metadata: Metadata = {
  title: 'Copyright & Intellectual Property Policy | नागरिक (Nagrik)',
  description:
    'Our intellectual property charter under the Indian Copyright Act, 1957. Learn how to submit a copyright notice or counter-notice on Nagrik.',
  alternates: {
    canonical: 'https://nagrik.news/copyright',
  },
  openGraph: {
    title: 'Copyright & Intellectual Property Policy | नागरिक (Nagrik)',
    description:
      'Author-first licensing, copyright takedowns, and IP protections for Nagrik creators and third parties.',
    url: 'https://nagrik.news/copyright',
    type: 'website',
  },
};

export default function CopyrightPage() {
  return <CopyrightView />;
}

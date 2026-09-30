import React from 'react';
import type { Metadata } from 'next';
import { GovernmentDisclaimerView } from '@/views/GovernmentDisclaimerView';

export const metadata: Metadata = {
  title: 'Government Information Disclaimer | Nagrik News',
  description:
    'Statutory non-government-affiliation disclaimer clarifying that Nagrik is an independent digital news and civic journalism platform operated by Wizzling Pvt Ltd.',
  openGraph: {
    title: 'Government Information Disclaimer | Nagrik News',
    description:
      'Nagrik is an independent digital news platform operated by Wizzling Pvt Ltd and is not affiliated with any government authority.',
    url: 'https://nagrik.news/government-disclaimer',
    siteName: 'Nagrik News'
  }
};

export default function GovernmentDisclaimerPage() {
  return <GovernmentDisclaimerView />;
}

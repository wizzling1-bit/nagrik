import type { Metadata } from 'next';
import { PaymentProofView } from '@/views/PaymentProofView';

export const metadata: Metadata = {
  title: 'Payment Proof — Verified Creator Payouts | नागरिक (Nagrik)',
  description:
    'Transparent, publicly-logged proof that Nagrik pays its citizen journalists. View real payout records — amounts, cities, dates, and transaction references.',
  alternates: {
    canonical: 'https://nagrik.news/payment-proof',
  },
  openGraph: {
    title: 'Payment Proof — Verified Creator Payouts | Nagrik',
    description:
      'We actually pay. Every verified payout on Nagrik is publicly logged. No promises — just proof.',
    url: 'https://nagrik.news/payment-proof',
    type: 'website',
  },
};

export default function PaymentProofPage() {
  return <PaymentProofView />;
}

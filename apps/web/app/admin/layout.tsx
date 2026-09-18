import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'नागरिक (Naagrik) — Unified Admin Operations Portal',
  description: 'Enterprise Hyperlocal Operations, Content Moderation, Creator Management, and Financial Clearances for Nagrik Platform.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal-root min-h-screen w-full bg-slate-900 text-slate-100 overflow-hidden">
      {children}
    </div>
  );
}

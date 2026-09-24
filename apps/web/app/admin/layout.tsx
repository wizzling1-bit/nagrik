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
    <div className="admin-portal-root min-h-screen w-full bg-[#EAE2D5] dark:bg-[#070A11] text-slate-900 dark:text-slate-100">
      {children}
    </div>
  );
}

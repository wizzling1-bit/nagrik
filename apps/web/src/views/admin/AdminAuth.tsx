'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthProps {
  apiBase?: string;
  onBackToHome?: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signin?redirect=/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] flex flex-col justify-center items-center p-6">
      <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold font-serif text-slate-800 dark:text-slate-200">
        Opening Sovereign Sign In...
      </p>
    </div>
  );
};

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreatorLayout } from '@/views/creator/CreatorLayout';

export default function CreatorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <CreatorLayout onBackToHome={() => router.push('/')} />
    </div>
  );
}

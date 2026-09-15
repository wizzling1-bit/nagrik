'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreatorLayout } from '@/views/creator/CreatorLayout';

export default function CreatorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <CreatorLayout onBackToHome={() => router.push('/')} />
    </div>
  );
}

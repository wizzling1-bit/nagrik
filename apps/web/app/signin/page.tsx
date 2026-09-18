'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreatorAuth } from '@/views/creator/CreatorAuth';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/creator';

  return (
    <CreatorAuth
      initialMode="signin"
      redirectUrl={redirectUrl}
      onBackToHome={() => router.push('/')}
    />
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#070A12] flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white">
          <div className="w-10 h-10 border-3 border-[#DE5227]/30 border-t-[#DE5227] rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold font-serif">Loading Sign In...</p>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

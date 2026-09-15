'use client';

import React, { Suspense } from 'react';
import { TermsView } from '@/views/TermsView';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] transition-colors duration-200">
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-xs font-semibold text-slate-500">Loading terms & policies...</div>}>
        <TermsView />
      </Suspense>
    </div>
  );
}

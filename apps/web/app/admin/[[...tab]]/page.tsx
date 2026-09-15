'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/views/admin/AdminLayout';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <AdminLayout onBackToHome={() => router.push('/')} />
    </div>
  );
}

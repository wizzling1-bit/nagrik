'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/views/admin/AdminLayout';

export default function AdminPage() {
  const router = useRouter();

  return (
    <main className="w-full min-h-screen">
      <AdminLayout onBackToHome={() => router.push('/')} />
    </main>
  );
}

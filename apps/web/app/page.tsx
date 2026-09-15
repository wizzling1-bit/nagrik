'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HomeView } from '@/views/HomeView';

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = (view: 'home' | 'creator' | 'admin') => {
    if (view === 'creator') {
      router.push('/creator');
    } else if (view === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return <HomeView onNavigate={handleNavigate} />;
}

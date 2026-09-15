'use client';

import React from 'react';
import { ContactView } from '@/views/ContactView';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] transition-colors duration-200">
      <ContactView />
    </div>
  );
}

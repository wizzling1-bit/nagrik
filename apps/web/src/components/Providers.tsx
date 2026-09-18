'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { WaterRippleGeometry } from './WaterRippleGeometry';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <WaterRippleGeometry />
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

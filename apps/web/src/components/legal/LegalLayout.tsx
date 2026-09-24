'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  Cookie,
  Info,
  Printer,
  ChevronRight,
  Clock,
  ExternalLink,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface TocItem {
  id: string;
  label: string;
}

export interface LegalLayoutProps {
  title: string;
  hindiTitle?: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  version?: string;
  activeSlug: 'privacy' | 'terms' | 'about' | 'guidelines' | 'grievance' | 'cookies';
  tocItems?: TocItem[];
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  hindiTitle,
  subtitle,
  category,
  lastUpdated,
  version = '2026.1',
  activeSlug,
  tocItems = [],
  children
}) => {
  const { language, toggleLanguage } = useLanguage();

  const navLinks = [
    { slug: 'privacy', href: '/privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति', icon: Lock },
    { slug: 'terms', href: '/terms', labelEn: 'Terms of Service', labelHi: 'सेवा की शर्तें', icon: FileText },
    { slug: 'about', href: '/about', labelEn: 'About & Manifesto', labelHi: 'हमारे बारे में', icon: Info },
    { slug: 'guidelines', href: '/guidelines', labelEn: 'Editorial Standards', labelHi: 'संपादकीय दिशा-निर्देश', icon: ShieldCheck },
    { slug: 'grievance', href: '/grievance', labelEn: 'Grievance Officer', labelHi: 'शिकायत निवारण', icon: Scale },
    { slug: 'cookies', href: '/cookies', labelEn: 'Cookie Policy', labelHi: 'कुकी नीति', icon: Cookie }
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 selection:bg-[#DE5227] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

        {/* ── BREADCRUMBS & TOP UTILITY BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#DE5227] transition-colors">
              Nagrik
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300">
              {category}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">
              {title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-[#DE5227] transition-colors font-bold cursor-pointer"
              title="Toggle Hindi/English Language"
            >
              {language === 'hi' ? 'Read in English' : 'हिन्दी में पढ़ें'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-[#DE5227] transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3 h-3" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-[#DE5227]/25 text-[#DE5227] dark:text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#DE5227]" />
            <span>2026 Statutory Compliance & Platform Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white leading-tight">
            {language === 'hi' && hindiTitle ? (
              hindiTitle
            ) : (
              title
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated: {lastUpdated}</span>
            </span>
            <span>•</span>
            <span>Charter Version: v{version}</span>
          </div>
        </div>

        {/* ── QUICK SWITCHER DOCK (STICKY ON DESKTOP) ── */}
        <div className="sticky top-20 z-30 py-2 backdrop-blur-md bg-[#F4EFE6]/80 dark:bg-[#0A0E17]/80 rounded-2xl">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSlug === tab.slug;
              const label = language === 'hi' ? tab.labelHi : tab.labelEn;
              return (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#DE5227] text-white shadow-md shadow-orange-500/25 ring-2 ring-[#DE5227]/30'
                      : 'bg-[#FAF8F5] dark:bg-[#111827] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-[#F2ECE1] dark:hover:bg-slate-800 border border-stone-200/90 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT GRID (TOC + ARTICLE) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table of Contents Column (Desktop Sidebar) */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-36 space-y-4">
              <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-2xs space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-stone-200/60 dark:border-slate-800">
                  <FileText className="w-3.5 h-3.5 text-[#DE5227]" />
                  <span>On This Page</span>
                </div>
                <nav className="space-y-1.5 text-xs">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block py-1 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#DE5227] dark:hover:text-orange-400 hover:bg-[#F2ECE1] dark:hover:bg-slate-800/60 transition-colors leading-snug"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Fast Support Card */}
              <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-3xl p-5 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                  Need Legal or Compliance Help?
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our compliance desk and Grievance Officer respond to all statutory inquiries within 24 hours.
                </p>
                <Link
                  href="/grievance"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#DE5227] dark:text-orange-400 hover:underline pt-1"
                >
                  <span>Grievance Desk</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </aside>
          )}

          {/* Document Content Canvas */}
          <main className={`${tocItems.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left leading-relaxed text-xs sm:text-sm text-slate-700 dark:text-slate-300`}>
            {children}
          </main>

        </div>

        {/* ── FOOTER TRUST SIGNATURE ── */}
        <div className="pt-6 border-t border-stone-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1">
          <div>
            Nagrik Media Trust • Incorporated under Indian Trusts Act, 1882 • Reg. Bihar News Media Bureau
          </div>
          <div>
            Statutory Compliance with Digital Personal Data Protection Act, 2023 & IT Rules, 2021 (as amended 2026)
          </div>
        </div>

      </div>
    </div>
  );
};

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
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  Megaphone,
  BookOpen,
  Award,
  Layers,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface TocItem {
  id: string;
  label: string;
}

export type LegalSlug =
  | 'privacy'
  | 'terms'
  | 'about'
  | 'editorial-guidelines'
  | 'guidelines'
  | 'content-policy'
  | 'corrections'
  | 'sources'
  | 'government-disclaimer'
  | 'publisher-guidelines'
  | 'community-guidelines'
  | 'copyright'
  | 'advertising'
  | 'transparency'
  | 'accessibility'
  | 'contact'
  | 'report'
  | 'grievance'
  | 'cookies';

export interface LegalLayoutProps {
  title: string;
  hindiTitle?: string;
  subtitle: string;
  category: string;
  lastUpdated: string;
  version?: string;
  activeSlug: LegalSlug;
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

  // Navigation Links organized into 4 clear editorial/governance groups
  const navGroups = [
    {
      groupEn: 'Company',
      groupHi: 'संस्थान',
      items: [
        { slug: 'about', href: '/about', labelEn: 'About Nagrik', labelHi: 'नागरिक परिचय' },
        { slug: 'contact', href: '/contact', labelEn: 'Contact Desk', labelHi: 'संपर्क केंद्र' },
        { slug: 'report', href: '/report', labelEn: 'Report Content', labelHi: 'सामग्री रिपोर्ट करें' }
      ]
    },
    {
      groupEn: 'Editorial',
      groupHi: 'संपादकीय',
      items: [
        { slug: 'editorial-guidelines', href: '/editorial-guidelines', labelEn: 'Editorial Guidelines', labelHi: 'संपादकीय सिद्धांत' },
        { slug: 'corrections', href: '/corrections', labelEn: 'Corrections Policy', labelHi: 'त्रुटि सुधार नीति' },
        { slug: 'sources', href: '/sources', labelEn: 'Sources & Attribution', labelHi: 'स्रोत एवं श्रेय' },
        { slug: 'transparency', href: '/transparency', labelEn: 'Transparency', labelHi: 'पारदर्शिता' }
      ]
    },
    {
      groupEn: 'Policies',
      groupHi: 'नीतियां',
      items: [
        { slug: 'content-policy', href: '/content-policy', labelEn: 'Content Policy', labelHi: 'सामग्री नीति' },
        { slug: 'community-guidelines', href: '/community-guidelines', labelEn: 'Community Guidelines', labelHi: 'सामुदायिक नियम' },
        { slug: 'publisher-guidelines', href: '/publisher-guidelines', labelEn: 'Publisher Guidelines', labelHi: 'प्रकाशक मार्गदर्शिका' },
        { slug: 'advertising', href: '/advertising', labelEn: 'Advertising Policy', labelHi: 'विज्ञापन नीति' },
        { slug: 'copyright', href: '/copyright', labelEn: 'Copyright & IP', labelHi: 'कॉपीराइट एवं बौद्धिक संपदा' }
      ]
    },
    {
      groupEn: 'Legal & Compliance',
      groupHi: 'कानूनी एवं अनुपालन',
      items: [
        { slug: 'government-disclaimer', href: '/government-disclaimer', labelEn: 'Govt Disclaimer', labelHi: 'सरकारी अस्वीकरण' },
        { slug: 'privacy', href: '/privacy', labelEn: 'Privacy Policy', labelHi: 'गोपनीयता नीति' },
        { slug: 'terms', href: '/terms', labelEn: 'Terms of Service', labelHi: 'सेवा की शर्तें' },
        { slug: 'accessibility', href: '/accessibility', labelEn: 'Accessibility', labelHi: 'सुगमता (Accessibility)' },
        { slug: 'grievance', href: '/grievance', labelEn: 'Grievance Officer', labelHi: 'शिकायत निवारण' }
      ]
    }
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isItemActive = (slug: string) => {
    if (activeSlug === slug) return true;
    if (activeSlug === 'guidelines' && slug === 'editorial-guidelines') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 selection:bg-[#DE5227] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

        {/* ── BREADCRUMBS & TOP UTILITY BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#DE5227] transition-colors font-medium">
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
            <span>Statutory Compliance & Editorial Governance</span>
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
              <span>Effective / Updated: {lastUpdated}</span>
            </span>
            <span>•</span>
            <span>Charter Version: v{version}</span>
          </div>
        </div>

        {/* ── MULTI-CATEGORY POLICY SWITCHER ── */}
        <div className="space-y-2 backdrop-blur-md bg-[#FAF8F5]/80 dark:bg-[#111827]/80 border border-stone-200/90 dark:border-slate-800 rounded-2xl p-3 shadow-2xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 pb-1">
            {language === 'hi' ? 'नागरिक नीति एवं अनुपालन अनुक्रमणिका' : 'Nagrik Policy & Governance Index'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {navGroups.map((group) => {
              return group.items.map((tab) => {
                const active = isItemActive(tab.slug);
                const label = language === 'hi' ? tab.labelHi : tab.labelEn;
                return (
                  <Link
                    key={tab.slug}
                    href={tab.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#DE5227] text-white font-bold shadow-md shadow-orange-500/20 ring-2 ring-[#DE5227]/30'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 border border-stone-200/90 dark:border-slate-800'
                    }`}
                  >
                    <span>{label}</span>
                  </Link>
                );
              });
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT GRID (TOC + ARTICLE) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table of Contents Column (Desktop Sidebar) */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
              <div className="bg-[#FAF8F5] dark:bg-[#111827] border border-stone-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-2xs space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-stone-200/60 dark:border-slate-800">
                  <FileText className="w-3.5 h-3.5 text-[#DE5227]" />
                  <span>On This Page</span>
                </div>
                <nav className="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
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

              {/* Fast Report & Assistance Card */}
              <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-3xl p-5 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white font-serif">
                  Report Content or Inaccuracies
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Notice an error, ethical violation, or intellectual property issue? File a verified report directly with our editorial desk.
                </p>
                <div className="flex flex-col gap-1.5 pt-1">
                  <Link
                    href="/report"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#DE5227] dark:text-orange-400 hover:underline"
                  >
                    <span>Submit Content Report</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/grievance"
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    <span>Resident Grievance Officer</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
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
            Wizzling Pvt Ltd • Koilwar, Arrah, Bhojpur, Bihar – 802163
          </div>
          <div>
            Statutory Alignment: Digital Personal Data Protection Act, 2023 &amp; Information Technology Rules, 2021
          </div>
        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Smartphone,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedCity, setSelectedCity] = useState('Patna');

  useEffect(() => {
    const sections = [
      { id: 'story', threshold: 0.2 },
      { id: 'why', threshold: 0.2 },
      { id: 'ecosystem', threshold: 0.2 },
      { id: 'earnings', threshold: 0.2 },
      { id: 'trust', threshold: 0.2 },
      { id: 'faq', threshold: 0.2 }
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 24);

      // Calculate document scroll reading progress (0 - 100%)
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalDocScroll = docHeight - winHeight;
      if (totalDocScroll > 0) {
        const currentProgress = (scrollY / totalDocScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Active Section Scroll Spy
      const triggerY = scrollY + winHeight * 0.35;
      let current = 'hero';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (triggerY >= top && triggerY < top + height) {
            current = sec.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide public navbar inside dedicated Publisher Studio and Admin Console
  if (pathname?.startsWith('/creator') || pathname?.startsWith('/admin')) {
    return null;
  }

  const cities = ['Patna', 'Varanasi', 'Lucknow', 'Bengaluru', 'Delhi NCR', 'Mumbai', 'Pune', 'Kolkata'];

  const navLinks = [
    { label: language === 'hi' ? 'प्लेटफ़ॉर्म' : 'Platform', href: '/#story', sectionId: 'story' },
    { label: language === 'hi' ? 'सुविधाएं' : 'Why Nagrik', href: '/#why', sectionId: 'why' },
    { label: language === 'hi' ? 'नेटवर्क' : 'Ecosystem', href: '/#ecosystem', sectionId: 'ecosystem' },
    { label: language === 'hi' ? 'कमाई' : 'Earnings', href: '/#earnings', sectionId: 'earnings' },
    { label: language === 'hi' ? 'एफएक्यू' : 'FAQ', href: '/#faq', sectionId: 'faq' }
  ];

  return (
    <>
      {/* Fixed Morphing Shell */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out pointer-events-none ${
          scrolled
            ? 'py-2.5 sm:py-3.5 px-3 sm:px-6'
            : 'py-0 px-0'
        }`}
      >
        <div
          className={`mx-auto pointer-events-auto transition-all duration-300 ease-out relative ${
            scrolled
              ? 'max-w-[1060px] bg-[#FAF7F2]/96 dark:bg-[#0E1422]/96 backdrop-blur-2xl rounded-full border border-stone-300/90 dark:border-slate-700/90 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.7)] px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between'
              : 'max-w-[1380px] bg-[#F4EFE6]/80 dark:bg-[#0B0F17]/80 backdrop-blur-md border-b border-stone-300/40 dark:border-slate-800/50 px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between'
          }`}
        >
          {/* Brand Logo & Compact Morphing Subtitle */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] rounded-full py-0.5 px-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DE5227] text-white font-sans font-black text-xl sm:text-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              N
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#DE5227] transition-colors leading-none">
                {language === 'hi' ? 'नागरिक' : 'Nagrik'}
              </span>
              <div
                className={`transition-all duration-200 overflow-hidden ${
                  scrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-6 opacity-100 mt-1'
                }`}
              >
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap block leading-tight">
                  {language === 'hi' ? 'आपके पड़ोस की ख़बर' : 'News by your neighborhood'}
                </span>
              </div>
            </div>
          </Link>

          {/* Primary Editorial Navigation with Active Section Spy Indicator */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm tracking-tight transition-all duration-200 rounded-full px-3.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] ${
                    isActive
                      ? 'bg-orange-500/15 dark:bg-orange-500/25 text-[#DE5227] dark:text-orange-400 font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#DE5227] dark:hover:text-white font-medium hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar: Theme, Language & Primary CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90 flex items-center justify-center cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] group"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              <span className="transition-transform duration-300 group-hover:rotate-45 group-active:scale-75 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-all duration-300 animate-in spin-in-180" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 dark:text-slate-200 transition-all duration-300 animate-in spin-in-180" />
                )}
              </span>
            </button>

            {/* Language Toggle Pill with Globe */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
              title="Change Language / भाषा बदलें"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Prominent Primary CTA */}
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 bg-[#DE5227] hover:bg-[#C84318] active:scale-98 text-white text-xs sm:text-sm font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-orange-500/20 focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
            >
              <span>{language === 'hi' ? 'रिपोर्टिंग शुरू करें' : 'Start Reporting'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Dark mode */}
            <button
              onClick={toggleTheme}
              className="p-2 text-xs rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 active:scale-90 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              aria-label="Toggle language"
            >
              {language === 'hi' ? 'EN' : 'हिन्दी'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 rounded-full transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Micro Reading Progress Bar (Subtle 2px line along bottom edge in scrolled state) */}
          {scrolled && (
            <div className="absolute bottom-0 inset-x-6 h-[2px] overflow-hidden rounded-full pointer-events-none opacity-90">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-[#DE5227] to-amber-500 transition-all duration-150 ease-out rounded-full"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pointer-events-auto mx-auto max-w-[1080px] mt-2 rounded-2xl border border-stone-300 dark:border-slate-800 bg-[#FAF7F2]/95 dark:bg-[#0F1420]/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200">
            {/* City Selector in Mobile */}
            <div className="p-3 bg-white dark:bg-[#151D2C] rounded-xl border border-slate-200/80 dark:border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-2">
                {t.selectCity}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {cities.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                      selectedCity === city
                        ? 'bg-[#DE5227] text-white font-medium shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    activeSection === item.sectionId
                      ? 'bg-orange-500/10 text-[#DE5227] font-bold'
                      : 'text-slate-900 dark:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
              <Link
                href="/creator"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-sm transition shadow-sm"
              >
                {language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}
              </Link>
              <Link
                href="/#story"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
              >
                {language === 'hi' ? 'देखें यह कैसे काम करता है' : 'Explore How It Works'}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

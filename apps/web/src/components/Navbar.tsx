'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [isOverDark, setIsOverDark] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedCity, setSelectedCity] = useState('Patna');

  const scrolledRef = useRef(false);
  const isOverDarkRef = useRef(false);
  const activeSectionRef = useRef('hero');
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const sections = ['story', 'why', 'ecosystem', 'earnings', 'trust', 'faq'];

    const handleScroll = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const isScrolled = scrollY > 24;

        if (isScrolled !== scrolledRef.current) {
          scrolledRef.current = isScrolled;
          setScrolled(isScrolled);
        }

        const winHeight = window.innerHeight;

        // Dynamic Dark Section Detection for seamless transparent navigation
        const darkElements = document.querySelectorAll('[data-navbar-theme="dark"], footer');
        let overDark = false;
        for (let i = 0; i < darkElements.length; i++) {
          const rect = darkElements[i].getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 10) {
            overDark = true;
            break;
          }
        }
        if (overDark !== isOverDarkRef.current) {
          isOverDarkRef.current = overDark;
          setIsOverDark(overDark);
        }

        // Direct hardware-accelerated progress bar update with 0 React re-renders & 0 reflow
        if (progressBarRef.current) {
          const docHeight = document.documentElement.scrollHeight;
          const maxScroll = docHeight - winHeight;
          if (maxScroll > 0) {
            const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            progressBarRef.current.style.transform = `scaleX(${progress})`;
          }
        }

        // Active Section Scroll Spy with zero forced reflow
        const triggerY = winHeight * 0.35;
        let current = 'hero';

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= triggerY && rect.bottom >= triggerY) {
              current = id;
              break;
            }
          }
        }

        if (current !== activeSectionRef.current) {
          activeSectionRef.current = current;
          setActiveSection(current);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide public navbar inside dedicated Publisher Studio, Admin Console, and Authentication pages
  if (pathname?.startsWith('/creator') || pathname?.startsWith('/admin') || pathname === '/signin' || pathname === '/signup' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isDarkTone = theme === 'dark' || isOverDark;

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
            ? 'py-2 sm:py-3.5 px-2.5 sm:px-6'
            : 'py-0 px-0'
        }`}
      >
        <div
          className={`mx-auto w-full pointer-events-auto transition-all duration-300 ease-out relative overflow-hidden ${
            scrolled
              ? isDarkTone
                ? 'max-w-[1060px] bg-[#0C1018]/85 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between'
                : 'max-w-[1060px] bg-[#F9F6F1]/90 backdrop-blur-xl rounded-full border border-stone-300/80 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between'
              : isDarkTone
                ? 'max-w-[1380px] bg-[#0C1018]/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-10 lg:px-12 h-16 sm:h-20 flex items-center justify-between'
                : 'max-w-[1380px] bg-[#F5F0E8]/85 backdrop-blur-md border-b border-stone-300/50 px-4 sm:px-10 lg:px-12 h-16 sm:h-20 flex items-center justify-between'
          }`}
        >
          {/* Brand Logo & Compact Morphing Subtitle */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] rounded-full py-0.5 px-1 shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#DE5227] text-white font-sans font-black text-lg sm:text-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              N
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className={`font-sans text-lg sm:text-2xl font-bold tracking-tight transition-colors leading-none ${
                isDarkTone ? 'text-white group-hover:text-[#DE5227]' : 'text-slate-900 group-hover:text-[#DE5227]'
              }`}>
                {language === 'hi' ? 'नागरिक' : 'Nagrik'}
              </span>
              {!scrolled && (
                <div className="hidden sm:block mt-1 overflow-hidden">
                  <span className={`text-xs font-sans font-normal whitespace-nowrap block leading-tight ${
                    isDarkTone ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {language === 'hi' ? 'आपके पड़ोस की ख़बर' : 'News by your neighborhood'}
                  </span>
                </div>
              )}
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
                      ? isDarkTone
                        ? 'bg-orange-500/25 text-orange-400 font-bold shadow-xs'
                        : 'bg-orange-500/15 text-[#DE5227] font-bold shadow-xs'
                      : isDarkTone
                        ? 'text-slate-200 hover:text-white font-medium hover:bg-white/10'
                        : 'text-slate-700 hover:text-[#DE5227] font-medium hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar: Theme, Language & Primary CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button with Smooth Rotating Morph */}
            <button
              onClick={(e) => toggleTheme(e)}
              className={`w-9 h-9 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] group relative overflow-hidden ${
                isDarkTone
                  ? 'bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border border-slate-700 hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                  : 'bg-surface-card hover:bg-surface-muted text-slate-700 border border-stone-300/80 hover:border-[#DE5227]/40 hover:shadow-[0_0_12px_rgba(222,82,39,0.15)]'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
                {/* Sun Icon (Rotates and scales in dark mode) */}
                <Sun
                  className={`w-4 h-4 text-amber-400 absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    theme === 'dark'
                      ? 'rotate-0 scale-100 opacity-100 group-hover:rotate-45'
                      : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                {/* Moon Icon (Rotates and scales in light mode) */}
                <Moon
                  className={`w-4 h-4 absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isDarkTone ? 'text-slate-200' : 'text-slate-700'
                  } ${
                    theme === 'dark'
                      ? '-rotate-90 scale-0 opacity-0'
                      : 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12'
                  }`}
                />
              </div>
            </button>

            {/* Language Toggle Pill with Globe */}
            <button
              onClick={toggleLanguage}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 active:scale-95 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] ${
                isDarkTone
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-surface-card hover:bg-surface-muted text-slate-700 border border-stone-300/80'
              }`}
              title="Change Language / भाषा बदलें"
              aria-label="Toggle language"
            >
              <Globe className={`w-3.5 h-3.5 ${isDarkTone ? 'text-slate-300' : 'text-slate-600'}`} />
              <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Prominent Primary CTA */}
            <Link
              href="/creator"
              className="inline-flex items-center gap-2 bg-[#C84318] hover:bg-[#A83410] active:scale-98 text-white text-xs sm:text-sm font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md hover:shadow-orange-500/20 focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
            >
              <span>{language === 'hi' ? 'रिपोर्टिंग शुरू करें' : 'Start Reporting'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:hidden shrink-0">
            {/* Dark mode */}
            <button
              onClick={(e) => toggleTheme(e)}
              className={`w-8 h-8 rounded-full active:scale-90 transition-all flex items-center justify-center cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] relative overflow-hidden ${
                isDarkTone ? 'text-slate-200 hover:bg-slate-800/60' : 'text-slate-700 hover:bg-stone-200/60'
              }`}
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
                <Sun
                  className={`w-4 h-4 text-amber-400 absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isDarkTone ? 'text-slate-200' : 'text-slate-700'
                  } ${
                    theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                  }`}
                />
              </div>
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className={`px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-full border transition cursor-pointer shrink-0 ${
                isDarkTone
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                  : 'bg-surface-card border-stone-300 text-slate-700'
              }`}
              aria-label="Toggle language"
            >
              {language === 'hi' ? 'EN' : 'हिन्दी'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] shrink-0 ${
                isDarkTone ? 'text-slate-200 hover:bg-slate-800/60' : 'text-slate-700 hover:bg-stone-200/60'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          {/* Micro Reading Progress Bar (Hardware-accelerated scaleX along bottom edge in scrolled state) */}
          {scrolled && (
            <div className="absolute bottom-0 inset-x-4 sm:inset-x-6 h-[2px] overflow-hidden rounded-full pointer-events-none opacity-90">
              <div
                ref={progressBarRef}
                className="h-full w-full bg-gradient-to-r from-orange-400 via-[#DE5227] to-amber-500 origin-left transition-transform duration-75 ease-out rounded-full will-change-transform"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          )}
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden pointer-events-auto mx-auto max-w-[1080px] mt-2 rounded-2xl border backdrop-blur-2xl px-5 pt-4 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200 ${
            isDarkTone
              ? 'border-slate-800 bg-[#131A2A]/95 text-white'
              : 'border-stone-300 bg-[#F9F6F1]/95 text-slate-900'
          }`}>
            {/* City Selector in Mobile */}
            <div className={`p-3 rounded-xl border ${
              isDarkTone ? 'bg-[#1A2236] border-slate-800' : 'bg-surface-card border-stone-300/80'
            }`}>
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
                        : isDarkTone
                          ? 'bg-slate-900 text-slate-300 border border-slate-800'
                          : 'bg-slate-50 text-slate-700 border border-slate-200/60'
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
                      : isDarkTone
                        ? 'text-white hover:bg-slate-800/50'
                        : 'text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className={`pt-3 border-t flex flex-col gap-2.5 ${isDarkTone ? 'border-slate-800' : 'border-slate-200'}`}>
              <Link
                href="/creator"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#C84318] hover:bg-[#A83410] text-white font-bold text-sm transition shadow-sm"
              >
                {language === 'hi' ? 'रिपोर्टिंग शुरू करें — निःशुल्क' : 'Start Reporting — Free'}
              </Link>
              <Link
                href="/#story"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center py-2.5 rounded-full font-semibold text-xs transition ${
                  isDarkTone
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-surface-card hover:bg-surface-muted text-slate-800 border border-stone-300/80'
                }`}
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

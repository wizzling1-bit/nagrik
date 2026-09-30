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
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const isScrolled = scrollY > 20;

          if (isScrolled !== scrolledRef.current) {
            scrolledRef.current = isScrolled;
            setScrolled(isScrolled);
          }

          if (progressBarRef.current) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
              const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
              progressBarRef.current.style.transform = `scaleX(${progress})`;
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for active section spy (zero layout thrashing)
    const sections = ['story', 'why', 'ecosystem', 'earnings', 'trust', 'faq'];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id && id !== activeSectionRef.current) {
              activeSectionRef.current = id;
              setActiveSection(id);
            }
          }
        });
      },
      {
        rootMargin: '-15% 0px -60% 0px',
        threshold: 0.05,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // IntersectionObserver for dark elements over navbar
    const darkObserver = new IntersectionObserver(
      (entries) => {
        const isAnyDark = entries.some((e) => e.isIntersecting);
        if (isAnyDark !== isOverDarkRef.current) {
          isOverDarkRef.current = isAnyDark;
          setIsOverDark(isAnyDark);
        }
      },
      {
        rootMargin: '0px 0px -90% 0px',
        threshold: 0,
      }
    );

    const darkElements = document.querySelectorAll('[data-navbar-theme="dark"], footer');
    darkElements.forEach((el) => darkObserver.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
      darkObserver.disconnect();
    };
  }, [pathname]);

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
    { label: language === 'hi' ? 'एफएक्यू' : 'FAQ', href: '/#faq', sectionId: 'faq' },
    { label: language === 'hi' ? 'संपर्क' : 'Contact', href: '/contact', sectionId: 'contact' }
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
                ? 'max-w-[1060px] bg-[#0A0E17]/85 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between'
                : 'max-w-[1060px] bg-[#F9F6F1]/90 backdrop-blur-xl rounded-full border border-stone-300/80 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between'
              : isDarkTone
                ? 'max-w-[1380px] bg-[#080B10]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-10 lg:px-12 h-16 sm:h-20 flex items-center justify-between'
                : 'max-w-[1380px] bg-[#F5F0E8]/85 backdrop-blur-md border-b border-stone-300/50 px-4 sm:px-10 lg:px-12 h-16 sm:h-20 flex items-center justify-between'
          }`}
        >
          {/* Brand Logo & Compact Morphing Subtitle */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] rounded-full py-0.5 px-1 shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/nagrik-logo.png"
                alt="Nagrik Logo"
                className="w-full h-full object-contain rounded-xl sm:rounded-2xl"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className={`font-sans text-lg sm:text-2xl font-bold tracking-tight transition-colors leading-none ${
                isDarkTone ? 'text-white group-hover:text-[#FF5A26]' : 'text-slate-900 group-hover:text-[#DE5227]'
              }`}>
                {language === 'hi' ? 'नागरिक' : 'Nagrik'}
              </span>
              {!scrolled && (
                <div className="hidden sm:block mt-1 overflow-hidden">
                  <span className={`text-xs font-sans font-normal whitespace-nowrap block leading-tight ${
                    isDarkTone ? 'text-slate-400' : 'text-slate-600'
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
                        ? 'bg-[#FF5A26]/15 text-[#FF6B3D] font-bold shadow-[0_0_12px_rgba(255,90,38,0.2)] border border-[#FF5A26]/30'
                        : 'bg-orange-500/15 text-[#DE5227] font-bold shadow-xs'
                      : isDarkTone
                        ? 'text-slate-300 hover:text-white font-medium hover:bg-white/[0.08]'
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
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] group relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/25 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                  : 'bg-surface-card hover:bg-stone-200/80 text-slate-700 border border-stone-300/80 hover:border-slate-400/60 shadow-xs'
              }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <div className="relative w-4.5 h-4.5 flex items-center justify-center pointer-events-none">
                {/* Sun Icon (Rotates and scales in dark mode) */}
                <Sun
                  className={`w-4.5 h-4.5 text-amber-400 absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    theme === 'dark'
                      ? 'rotate-0 scale-100 opacity-100 group-hover:rotate-45'
                      : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                {/* Moon Icon (Rotates and scales in light mode) */}
                <Moon
                  className={`w-4.5 h-4.5 absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10'
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
          <div className="flex items-center gap-1.5 md:hidden shrink-0">
            {/* Dark mode */}
            <button
              onClick={(e) => toggleTheme(e)}
              className={`w-8.5 h-8.5 rounded-full active:scale-90 transition-all flex items-center justify-center cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/25'
                  : 'bg-surface-card text-slate-700 border border-stone-300/80 hover:bg-stone-200/60'
              }`}
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
                <Sun
                  className={`w-4 h-4 text-amber-400 absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              ? 'border-white/10 bg-[#0F141F]/98 backdrop-blur-2xl text-white shadow-2xl shadow-black/80'
              : 'border-stone-300 bg-[#F9F6F1]/95 text-slate-900'
          }`}>
            {/* City Selector in Mobile */}
            <div className={`p-3 rounded-xl border ${
              isDarkTone ? 'bg-[#161D2B] border-white/10' : 'bg-surface-card border-stone-300/80'
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
                          ? 'bg-white/[0.06] text-slate-300 border border-white/10 hover:bg-white/[0.1]'
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
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center py-2.5 rounded-full font-semibold text-xs transition border ${
                  isDarkTone
                    ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : 'bg-orange-500/10 hover:bg-orange-500/20 text-[#DE5227] border-orange-500/30'
                }`}
              >
                {language === 'hi' ? 'संपर्क एवं सहायता (Contact Desk)' : 'Contact Us & Newsroom Desk'}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

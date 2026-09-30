'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, ArrowRight, Headphones, ShieldAlert, Sparkles } from 'lucide-react';
import { IndianSkylineSvg } from './IndianSkylineSvg';

/* ─────────────────────────────────────────────────────────────────────
   EDITORIAL FOOTER WITH INDIAN CIVIC SKYLINE
   - Handcrafted panoramic silhouette with domes, temple shikharas,
     chhatris, minarets, coconut palms, and banyan trees
   - Luminous dual-mode sun/moon glow (apricot in light, amber in dark)
   - Seamless twilight sky gradient in dark mode ensuring figures pop
   - Deep midnight navy 5-column balanced footer architecture
   ───────────────────────────────────────────────────────────────────── */

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Scroll-reveal observer
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Parallax offset for skyline
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '80px' }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Subtle parallax on desktop for skyline
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (footerRef.current) {
            const rect = footerRef.current.getBoundingClientRect();
            const viewH = window.innerHeight;
            if (rect.top < viewH && rect.bottom > 0) {
              const progress = (viewH - rect.top) / (viewH + rect.height);
              setParallaxOffset(progress * 10);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide footer inside dedicated Publisher Studio, Admin Console, and Auth routes
  if (
    pathname?.startsWith('/creator') ||
    pathname?.startsWith('/admin') ||
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  const revealBase = 'transition-all duration-500 ease-out';
  const revealHidden = 'opacity-100 translate-y-0';
  const revealVisible = 'opacity-100 translate-y-0';

  return (
    <footer
      ref={footerRef}
      className="relative z-20 w-full font-sans overflow-hidden"
      data-navbar-theme="dark"
    >
      {/* ════════════════════════════════════════════════════════════════════
          01. INTRICATE INDIAN CIVIC SKYLINE SILHOUETTE
          (Light Mode: Seamless warm atmospheric glow, Dark Mode: Seamless illuminated twilight sky)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full bg-gradient-to-b from-transparent via-amber-500/[0.04] to-orange-500/[0.08] dark:from-transparent dark:via-[#080B10]/60 dark:to-[#080B10] overflow-hidden select-none pointer-events-none -mb-px transition-colors duration-200">
        {/* Soft Setting Sun Ambient Glow */}
        <div className="absolute left-[54%] sm:left-[55%] -translate-x-1/2 bottom-4 sm:bottom-8 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-t from-orange-400/35 via-amber-200/25 to-transparent dark:from-amber-500/20 dark:via-orange-400/10 dark:to-transparent blur-3xl pointer-events-none" />

        {/* Handwritten "India lives here." script */}
        <div
          className={`absolute right-6 sm:right-12 lg:right-24 top-3 sm:top-5 z-10 select-none ${revealBase} ${
            isVisible ? revealVisible : revealHidden
          }`}
          style={{ transitionDelay: isVisible ? '150ms' : '0ms' }}
        >
          <span className="font-script text-slate-700/90 dark:text-amber-200/95 text-xl sm:text-2xl lg:text-[30px] leading-tight block -rotate-3 font-semibold dark:drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
            India
            <br />
            lives here.
          </span>
        </div>

        {/* Handcrafted Indian Skyline Panorama SVG */}
        <IndianSkylineSvg
          className="text-[#080B10] dark:text-[#080B10] dark:drop-shadow-[0_-1.5px_3px_rgba(251,191,36,0.3)]"
          parallaxOffset={parallaxOffset}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          02. DARK EDITORIAL FOOTER BODY — Balanced 5-Column Grid (4 + 2 + 2 + 2 + 2 = 12)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#080B10] text-slate-300 relative pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-black/10 dark:border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-6 gap-y-10 sm:gap-8 lg:gap-8 items-start text-left ${revealBase} ${
              isVisible ? revealVisible : revealHidden
            }`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            {/* ── COL 1: BRAND / MISSION & PROMINENT CONTACT DESK (lg:col-span-4) ── */}
            <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 group focus:outline-hidden"
                aria-label="Nagrik homepage"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <span className="text-white font-black text-xl leading-none">
                    N
                  </span>
                </div>
                <span className="font-black tracking-tight text-xl text-white">
                  nagrik<span className="text-[#DE5227]">.news</span>
                </span>
              </Link>

              <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed font-normal max-w-sm">
                Hyperlocal journalism for a more informed India. Independent digital platform operated by{' '}
                <span className="text-slate-200 font-medium">Wizzling Pvt Ltd</span>.
              </p>

              {/* Social Icons */}
              <div className="pt-0.5 flex items-center gap-2.5">
                {[
                  {
                    label: 'Instagram',
                    href: 'https://instagram.com',
                    icon: (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'X (Twitter)',
                    href: 'https://x.com',
                    icon: (
                      <span className="font-mono text-[11px] font-bold leading-none">
                        𝕏
                      </span>
                    ),
                  },
                  {
                    label: 'YouTube',
                    href: 'https://youtube.com',
                    icon: (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    ),
                  },
                  {
                    label: 'LinkedIn',
                    href: 'https://linkedin.com',
                    icon: (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 hover:border-[#FF5A26] hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FF5A26]"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* 🌟 HIGHLY ATTRACTIVE, DEDICATED CONTACT & HELP DESK CARD 🌟 */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-orange-500/[0.14] via-amber-500/[0.06] to-[#101522] border border-orange-500/30 shadow-[0_8px_30px_rgba(234,88,12,0.15)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/20 transition-all duration-300" />
                
                <div className="flex items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-bold text-orange-400 tracking-wider font-mono uppercase">
                      Newsroom & Support Desk
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                    24/7 Active
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed relative z-10">
                  Direct support, news tips, and statutory grievance officer desk operated by <span className="text-white font-medium">Wizzling Pvt Ltd</span>.
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2.5 relative z-10">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white text-xs font-bold shadow-lg shadow-orange-950/60 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 group/btn focus:outline-hidden focus:ring-2 focus:ring-orange-400"
                  >
                    <Headphones className="w-3.5 h-3.5 text-white" />
                    <span>Contact Us</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="tel:+918890043675"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white text-xs font-medium border border-white/15 hover:border-white/30 transition-all duration-200"
                    title="Call Helpline"
                  >
                    <Phone className="w-3 h-3 text-orange-400" />
                    <span className="font-mono">+91 8890043675</span>
                  </a>
                </div>
              </div>

              {/* Brand Hashtag */}
              <div className="pt-1 text-xs font-mono text-slate-500 font-medium tracking-wide">
                #RealStoriesRealChange
              </div>
            </div>

            {/* ── COL 2: COMPANY (lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[12px] font-bold text-white tracking-wider font-mono uppercase flex items-center gap-1.5">
                <span>Company</span>
              </h3>
              <nav aria-label="Company navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  <li>
                    <Link
                      href="/about"
                      className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                    >
                      <span className="relative">
                        About Nagrik
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#FF5A26] transition-all duration-300 group-hover/link:w-full" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    {/* Highlighted Contact Us link in list */}
                    <Link
                      href="/contact"
                      className="group/link inline-flex items-center gap-1.5 text-orange-400 font-semibold hover:text-orange-300 transition-colors duration-200"
                    >
                      <span className="relative">
                        Contact Us
                        <span className="absolute -bottom-0.5 left-0 w-full h-px bg-orange-400/60" />
                      </span>
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded">
                        Help
                      </span>
                    </Link>
                  </li>
                  {[
                    { label: 'Publisher Studio', href: '/creator' },
                    { label: 'Payment Proof', href: '/payment-proof' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#FF5A26] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 3: EDITORIAL (lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[12px] font-bold text-white tracking-wider font-mono uppercase">
                Editorial
              </h3>
              <nav aria-label="Editorial navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'Editorial Guidelines', href: '/editorial-guidelines' },
                    { label: 'Corrections Policy', href: '/corrections' },
                    { label: 'Sources & Attribution', href: '/sources' },
                    { label: 'Transparency', href: '/transparency' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#FF5A26] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 4: POLICIES (lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[12px] font-bold text-white tracking-wider font-mono uppercase">
                Policies
              </h3>
              <nav aria-label="Policies navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'Content Policy', href: '/content-policy' },
                    { label: 'Community Guidelines', href: '/community-guidelines' },
                    { label: 'Publisher Guidelines', href: '/publisher-guidelines' },
                    { label: 'Advertising Policy', href: '/advertising' },
                    { label: 'Copyright & IP', href: '/copyright' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#FF5A26] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 5: LEGAL & COMPLIANCE (lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[12px] font-bold text-white tracking-wider font-mono uppercase">
                Legal
              </h3>
              <nav aria-label="Legal navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'Govt Disclaimer', href: '/government-disclaimer' },
                    { label: 'Grievance Desk', href: '/grievance-redressal' },
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Accessibility', href: '/accessibility' },
                    { label: 'Report Content', href: '/report' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#FF5A26] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              03. BOTTOM UTILITY BAR — streamlined with Contact Us
              ════════════════════════════════════════════════════════════════════ */}
          <div className="mt-12 sm:mt-14 pt-7 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-sans">
            <div className="text-center sm:text-left flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span>© {new Date().getFullYear()} Wizzling Pvt Ltd. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <Link
                href="/contact"
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
              >
                Contact Us
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/government-disclaimer"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Govt Disclaimer
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/privacy"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Privacy
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/terms"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Terms
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/grievance-redressal"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Grievance
              </Link>
            </div>

            <div className="text-center sm:text-right text-slate-400 font-medium">
              Made in India <span className="text-[#DE5227]">❤️</span> For a
              more informed tomorrow.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

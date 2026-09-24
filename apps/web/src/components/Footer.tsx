'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { IndianSkylineSvg } from './IndianSkylineSvg';

/* ─────────────────────────────────────────────────────────────────────
   EDITORIAL FOOTER WITH INDIAN CIVIC SKYLINE
   - Handcrafted panoramic silhouette with domes, temple shikharas,
     chhatris, minarets, coconut palms, and banyan trees
   - Luminous dual-mode sun/moon glow (apricot in light, amber in dark)
   - Seamless twilight sky gradient in dark mode ensuring figures pop
   - Deep midnight navy 5-column footer architecture
   ───────────────────────────────────────────────────────────────────── */

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    }, 600);
  };

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
      <div className="relative w-full bg-gradient-to-b from-transparent via-amber-500/[0.04] to-orange-500/[0.08] dark:from-transparent dark:via-[#141F33]/30 dark:to-[#1F2D48]/50 overflow-hidden select-none pointer-events-none -mb-px transition-colors duration-200">
        {/* Soft Setting Sun Ambient Glow */}
        <div className="absolute left-[54%] sm:left-[55%] -translate-x-1/2 bottom-4 sm:bottom-8 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-t from-orange-400/35 via-amber-200/25 to-transparent dark:from-amber-500/30 dark:via-orange-500/20 blur-2xl pointer-events-none" />

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
          className="text-[#080E1A] dark:text-[#080E1A] dark:drop-shadow-[0_-1.5px_3px_rgba(251,191,36,0.3)]"
          parallaxOffset={parallaxOffset}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          02. DARK EDITORIAL FOOTER BODY — 5-column grid
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#080E1A] text-slate-300 relative pt-14 sm:pt-16 pb-10 sm:pb-12">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
          <div
            className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 sm:gap-10 lg:gap-8 items-start text-left ${revealBase} ${
              isVisible ? revealVisible : revealHidden
            }`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            {/* ── COL 1: BRAND / MISSION (col-span-2 lg:col-span-3) ── */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-3 space-y-4">
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

              <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed font-normal max-w-[280px]">
                Hyperlocal journalism for a more informed India. By the people,
                for the people.
              </p>

              {/* Social Icons */}
              <div className="pt-1.5 flex items-center gap-2.5">
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
                    label: 'Facebook',
                    href: 'https://facebook.com',
                    icon: (
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
                    className="w-8 h-8 rounded-full bg-[#111A29] border border-[#1C2840] hover:border-[#DE5227] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DE5227]"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              {/* Brand Hashtag */}
              <div className="pt-1 text-xs font-mono text-slate-500 font-medium tracking-wide">
                #RealStoriesRealChange
              </div>
            </div>

            {/* ── COL 2: EXPLORE (col-span-1 lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[13px] font-bold text-white tracking-tight font-sans uppercase">
                Explore
              </h3>
              <nav aria-label="Explore navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'Latest News', href: '/#story' },
                    { label: 'Civic Issues', href: '/#why' },
                    { label: 'Local Reports', href: '/creator' },
                    { label: 'Investigations', href: '/#ecosystem' },
                    { label: "People's Stories", href: '/publishers' },
                    { label: 'Top Cities', href: '/#story' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#DE5227] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 3: COMPANY (col-span-1 lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[13px] font-bold text-white tracking-tight font-sans uppercase">
                Company
              </h3>
              <nav aria-label="Company navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'About Us', href: '/#why' },
                    { label: 'Our Mission', href: '/#why' },
                    { label: 'For Publishers', href: '/creator' },
                    { label: 'Careers', href: '/contact' },
                    { label: 'Contact Us', href: '/contact' },
                    { label: 'Press', href: '/terms?tab=creator' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#DE5227] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 4: SUPPORT (col-span-1 lg:col-span-2) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5 sm:space-y-4">
              <h3 className="text-[13px] font-bold text-white tracking-tight font-sans uppercase">
                Support
              </h3>
              <nav aria-label="Support navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'Help Center', href: '/#faq' },
                    {
                      label: 'Community Guidelines',
                      href: '/terms?tab=guidelines',
                    },
                    { label: 'Editorial Standards', href: '/terms?tab=guidelines' },
                    { label: 'Report an Issue', href: '/contact' },
                    { label: 'Feedback', href: '/contact' },
                    { label: 'FAQ', href: '/#faq' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#DE5227] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 4B: LEGAL & TRUST (col-span-1 sm:col-span-1 lg:hidden) ── */}
            <div className="col-span-1 sm:col-span-1 lg:hidden space-y-3.5 sm:space-y-4">
              <h3 className="text-[13px] font-bold text-white tracking-tight font-sans uppercase">
                Legal & Trust
              </h3>
              <nav aria-label="Legal navigation">
                <ul className="space-y-2.5 text-[13px] text-slate-400 font-normal">
                  {[
                    { label: 'Privacy Policy', href: '/terms?tab=privacy' },
                    { label: 'Terms of Service', href: '/terms?tab=terms' },
                    { label: 'Contributor Policy', href: '/terms?tab=creator' },
                    { label: 'DMCA Notice', href: '/terms?tab=dmca' },
                    { label: 'Direct UPI Terms', href: '/#earnings' },
                    { label: '100% IP Rights', href: '/#story' },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-1 hover:text-white transition-colors duration-200"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#DE5227] transition-all duration-300 group-hover/link:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* ── COL 5: NEWSLETTER / CTA (col-span-2 lg:col-span-3) ── */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-3 space-y-3.5">
              <h3 className="text-base sm:text-[17px] font-bold text-white tracking-tight font-serif">
                Get the latest from your city
              </h3>

              <p className="text-[13px] text-slate-400 leading-relaxed font-normal max-w-sm">
                Subscribe to our newsletter for important stories, community
                updates, and more.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={status === 'loading' || status === 'success'}
                      className="w-full bg-[#101826] border border-slate-700/80 focus:border-[#DE5227] focus:ring-1 focus:ring-[#DE5227]/40 rounded-full px-4 py-2.5 text-[13px] text-white placeholder:text-slate-500 transition-all duration-200 outline-hidden font-sans disabled:opacity-60"
                    />
                  </div>

                  {/* Terracotta Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-10 h-10 rounded-full bg-[#DE5227] hover:bg-[#C84318] active:scale-95 text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-orange-900/20 cursor-pointer disabled:opacity-60 shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#DE5227]"
                    aria-label="Subscribe"
                  >
                    {status === 'loading' ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : status === 'success' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {status === 'success' && (
                  <div className="text-[12px] font-mono text-emerald-400 flex items-center gap-1.5 animate-in zoom-in-95">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      Subscribed! You&apos;re on the priority dispatch list.
                    </span>
                  </div>
                )}

                {/* Privacy Reassurance */}
                <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5 font-sans">
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>We respect your privacy. No spam, ever.</span>
                </div>
              </form>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              03. BOTTOM UTILITY BAR
              ════════════════════════════════════════════════════════════════════ */}
          <div className="mt-12 sm:mt-14 pt-7 border-t border-[#141F32] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-sans">
            <div className="text-center sm:text-left flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>© 2026 Nagrik Media Trust. All rights reserved.</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <Link
                href="/terms?tab=privacy"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Privacy
              </Link>
              <span className="text-slate-700">·</span>
              <Link
                href="/terms?tab=terms"
                className="hover:text-slate-300 transition-colors duration-200"
              >
                Terms
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

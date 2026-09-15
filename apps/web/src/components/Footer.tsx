'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { NagrikLogo } from './NagrikLogo';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  // Hide footer inside dedicated Publisher Studio and Admin Console
  if (pathname?.startsWith('/creator') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0B0F17] text-slate-400 border-t border-slate-800/80 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">
          
          {/* Brand & Statement (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <NagrikLogo size="sm" variant="icon" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-black text-white tracking-tight">
                  {language === 'hi' ? 'नागरिक' : 'Nagrik'}
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                  Creator Studio
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              {language === 'hi'
                ? 'सशक्त समुदायों के लिए नागरिक पत्रकारिता। भारत का पहला GPS-सत्यापित हाइपरलोकल रिपोर्टिंग व कंट्रीब्यूटर मोनेटाइजेशन नेटवर्क।'
                : 'Citizen journalism for stronger communities. India’s premier GPS-verified hyperlocal reporting and contributor monetization network.'}
            </p>

            <div className="text-xs font-mono text-slate-400 pt-1 flex items-center gap-1.5">
              <span>Made with integrity in India</span>
              <span>🇮🇳</span>
            </div>
          </div>

          {/* Col 1: Platform (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/creator" className="hover:text-white transition">
                  Creator Studio
                </Link>
              </li>
              <li>
                <a href="/#workflow" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#earnings" className="hover:text-white transition">
                  Earnings
                </a>
              </li>
              <li>
                <a href="/#why" className="hover:text-white transition">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Resources (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/terms?tab=guidelines" className="hover:text-white transition">
                  Content Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/terms?tab=privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms?tab=terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/terms?tab=creator" className="hover:text-white transition">
                  Contributor Policy
                </Link>
              </li>
              <li>
                <Link href="/terms?tab=dmca" className="hover:text-white transition">
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer App (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">
              Consumer App
            </h4>
            <div className="space-y-2">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-[11px] text-slate-300 font-mono"
              >
                Google Play →
              </a>
              <a
                href="https://apple.com"
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-[11px] text-slate-300 font-mono"
              >
                App Store →
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Principles */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Nagrik News Media Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Direct UPI Payouts</span>
            <span>·</span>
            <span>100% IP Ownership</span>
            <span>·</span>
            <span>Verified Ground Truth</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

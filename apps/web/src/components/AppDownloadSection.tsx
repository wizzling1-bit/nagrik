'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  Check,
  Share2,
  QrCode
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AppDownloadSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowQrModal(false);
    };
    if (showQrModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQrModal]);

  return (
    <section id="download" className="py-16 sm:py-24 bg-transparent transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dominant Dark High-Contrast Container */}
        <div className="bg-[#131A2A] border border-slate-800/90 rounded-3xl p-8 sm:p-12 lg:p-14 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Value Proposition & Store Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-brand-400 uppercase">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t.downloadBadge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white leading-tight">
                {t.downloadTitle}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                {t.downloadSubtitle}
              </p>

              {/* Core Consumer Value Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  t.downloadFeature1,
                  t.downloadFeature2,
                  t.downloadFeature3,
                  t.downloadFeature4
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Download Buttons Bar with Shimmer & Hover Lift */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                {/* Google Play Button */}
                <a
                  href="#download-android"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowQrModal(true);
                  }}
                  className="btn-shimmer flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.288-.231-.46-.583-.46-.976V2.79c0-.393.172-.745.459-.976zm11.233 11.234l2.58 2.58-10.45 6.035 7.87-8.615zm0-2.096L6.972 2.337l10.45 6.035-2.58 2.58zm1.472 1.048l3.414 1.971c.88.508.88 1.336 0 1.844l-3.414 1.971-2.146-2.893 2.146-2.893z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-medium leading-none">GET IT ON</div>
                    <div className="text-xs font-bold tracking-wide leading-tight">Google Play</div>
                  </div>
                </a>

                {/* Apple App Store Button */}
                <a
                  href="#download-ios"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowQrModal(true);
                  }}
                  className="btn-shimmer flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black hover:bg-slate-900 border border-slate-700 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-500 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.64-.78 1.08-1.86.96-2.95-1 .04-2.16.66-2.84 1.44-.59.68-1.11 1.77-.97 2.83 1.11.09 2.21-.54 2.85-1.32z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-medium leading-none">Download on the</div>
                    <div className="text-xs font-bold tracking-wide leading-tight">App Store</div>
                  </div>
                </a>

                {/* Copy Share Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:border-slate-600 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? t.downloadLinkCopied : t.downloadCopyLink}</span>
                </button>
                <span className="font-script text-emerald-400 text-xl font-semibold rotate-2 select-none pointer-events-none animate-scribble-float-1 hidden sm:inline-block ml-2">
                  ~ works on 2G & 4G, zero signups ✨
                </span>
              </div>
            </div>

            {/* Right Column: Clean QR Code Card with Laser Scan Animation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="card-hover-effect bg-[#0C1018] p-7 rounded-2xl border border-slate-700/80 hover:border-brand-500/50 shadow-xl max-w-xs w-full text-center space-y-4 relative group">
                
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {t.downloadScanCamera}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.downloadScanHelp}
                  </p>
                </div>

                {/* High-Resolution SVG QR Code with Laser Scan Sweep */}
                <div className="bg-white p-3 rounded-xl inline-block shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  {/* Laser Beam Scanner Effect */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-scan-beam pointer-events-none opacity-80" />
                  
                  <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                    {/* Outer corner anchors */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#0F172A" />
                    <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
                    <rect x="15" y="15" width="8" height="8" rx="1" fill="#B45334" />

                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#0F172A" />
                    <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
                    <rect x="77" y="15" width="8" height="8" rx="1" fill="#B45334" />

                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#0F172A" />
                    <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
                    <rect x="15" y="77" width="8" height="8" rx="1" fill="#B45334" />

                    {/* QR Data Matrix simulation */}
                    <rect x="38" y="10" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="50" y="10" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="42" y="24" width="6" height="6" rx="1" fill="#0F172A" />
                    <rect x="52" y="24" width="8" height="8" rx="1" fill="#0F172A" />
                    
                    <rect x="10" y="42" width="6" height="6" rx="1" fill="#0F172A" />
                    <rect x="22" y="42" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="36" y="38" width="12" height="12" rx="2" fill="#B45334" />
                    <rect x="52" y="42" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="68" y="42" width="6" height="6" rx="1" fill="#0F172A" />
                    <rect x="82" y="42" width="8" height="8" rx="1" fill="#0F172A" />

                    <rect x="38" y="58" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="52" y="58" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="42" y="72" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="68" y="68" width="8" height="8" rx="1" fill="#0F172A" />
                    <rect x="80" y="76" width="10" height="10" rx="1" fill="#0F172A" />
                  </svg>
                </div>

                <div className="text-xs font-mono text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>No Login Required • Direct Access</span>
                </div>
              </div>
              <span className="font-script text-orange-400 text-2xl font-bold -rotate-6 select-none pointer-events-none animate-scribble-sway block mt-3">
                ⤹ point your phone camera here! 📸
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* QR Modal when clicking download buttons */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 transition-all"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-surface-card rounded-2xl p-6 sm:p-7 max-w-sm w-full space-y-4 text-center shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-serif">
              {language === 'hi' ? 'नागरिक ऐप डाउनलोड' : 'Download Nagrik App'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'hi'
                ? 'अपने फोन के कैमरे से इस क्यूआर कोड को स्कैन करें और 100% निःशुल्क ऐप इंस्टॉल करें।'
                : 'Scan this QR code with your mobile camera to install the 100% free consumer app.'}
            </p>

            {/* Embedded QR Code */}
            <div className="bg-white p-3 rounded-xl inline-block shadow-sm border border-stone-200/80 relative overflow-hidden">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-scan-beam pointer-events-none opacity-80" />
              <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none">
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#0F172A" />
                <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
                <rect x="15" y="15" width="8" height="8" rx="1" fill="#DE5227" />

                <rect x="67" y="5" width="28" height="28" rx="4" fill="#0F172A" />
                <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
                <rect x="77" y="15" width="8" height="8" rx="1" fill="#DE5227" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="#0F172A" />
                <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
                <rect x="15" y="77" width="8" height="8" rx="1" fill="#DE5227" />

                <rect x="38" y="10" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="50" y="10" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="42" y="24" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="52" y="24" width="8" height="8" rx="1" fill="#0F172A" />
                
                <rect x="10" y="42" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="22" y="42" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="36" y="38" width="12" height="12" rx="2" fill="#DE5227" />
                <rect x="52" y="42" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="68" y="42" width="6" height="6" rx="1" fill="#0F172A" />
                <rect x="82" y="42" width="8" height="8" rx="1" fill="#0F172A" />

                <rect x="38" y="58" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="52" y="58" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="42" y="72" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="68" y="68" width="8" height="8" rx="1" fill="#0F172A" />
                <rect x="80" y="76" width="10" height="10" rx="1" fill="#0F172A" />
              </svg>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-surface-muted rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                v1.2.0 Production Release
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Direct APK • Google Play • App Store
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Eye,
  Share2,
  ShieldCheck,
  Smartphone,
  ChevronLeft,
  ArrowRight,
  Play,
  Award,
  Clock,
  User,
  CheckCircle2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { NagrikLogo } from '@/components/NagrikLogo';
import { supabase } from '@/lib/supabase';

interface NewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getContent(id: string) {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*, creator:creators(*, user:users(*)), category:categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      const creatorObj = data.creator || {};
      const userObj = creatorObj.user || {};
      return {
        ...data,
        _id: data.id,
        creator: {
          id: creatorObj.id,
          _id: creatorObj.id,
          name: userObj.name || 'Citizen Journalist',
          bio: creatorObj.bio,
          profileImage: userObj.profile_image,
          verificationStatus: creatorObj.verification_status || 'VERIFIED'
        }
      };
    }
  } catch (supaErr) {
    console.warn(`[NewsPage] Supabase query notice for ${id}:`, supaErr);
  }
  return null;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { id } = await params;
  const content = await getContent(id);

  if (!content) {
    return {
      title: 'नागरिक समाचार (Story Not Found) | Naagrik News',
      description: 'The requested local report is not available.'
    };
  }

  const imageUrl = content.thumbnailUrl || content.mediaUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';
  const description = content.description ? content.description.slice(0, 160) : 'Ground verified hyperlocal news on Naagrik.';

  return {
    title: `${content.title} | नागरिक (Naagrik)`,
    description,
    openGraph: {
      title: content.title,
      description,
      url: `https://nagrik.news/news/${content.id}`,
      siteName: 'Naagrik News',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: content.title
        }
      ],
      type: 'article',
      publishedTime: content.createdAt,
      authors: [content.creatorName || 'Citizen Journalist']
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { id } = await params;
  const content = await getContent(id);

  if (!content) {
    return (
      <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-[#FAF8F5] dark:bg-[#111827] p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
            समाचार उपलब्ध नहीं है
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            यह समाचार समीक्षा में हो सकता है या हटा दिया गया है। नवीनतम स्थानीय समाचार देखने के लिए मुख्य पृष्ठ पर जाएं।
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-orange-500/20"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>मुख्य पृष्ठ पर वापस जाएं</span>
          </Link>
        </div>
      </div>
    );
  }

  const locationStr = content.location
    ? [content.location.area, content.location.city, content.location.state].filter(Boolean).join(', ')
    : 'Patna, Bihar';

  const publishedRaw = content.created_at || content.createdAt;
  const updatedRaw = content.updated_at || content.updatedAt;

  const formattedPublished = publishedRaw
    ? new Date(publishedRaw).toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'आज (Today)';

  const isUpdated = updatedRaw && publishedRaw && (new Date(updatedRaw).getTime() - new Date(publishedRaw).getTime() > 120000);
  const formattedUpdated = isUpdated
    ? new Date(updatedRaw).toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  const authorName = content.author_name || content.creatorName || content.creator?.name || 'नागरिक ग्राउंड रिपोर्टर';
  const isOriginalReporting = content.is_original !== false;
  const sourceName = content.source_name || (isOriginalReporting ? 'नागरिक मूल रिपोर्टिंग (Original Nagrik Reporting)' : 'स्थानीय स्रोत / लोकल वायर');
  const sourceUrl = content.source_url;
  const mediaAttribution = content.media_attribution;
  const correctionStatus = content.correction_status || 'NONE';
  const correctionNote = content.correction_note;

  // Calculate estimated reading time (~200 words per minute)
  const wordCount = (content.description || '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: content.title,
    description: content.description,
    image: [content.thumbnailUrl || content.mediaUrl],
    datePublished: publishedRaw,
    dateModified: updatedRaw || publishedRaw,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nagrik Hyperlocal News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nagrik.news/branding/logo.png'
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />

      {/* Main Article Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-14 text-left">
        
        {/* Breadcrumb & Category Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>होम</span>
            </Link>
            <span>/</span>
            <span className="text-brand-600 dark:text-brand-400 bg-brand-500/10 dark:bg-brand-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold text-[10px] border border-brand-500/20">
              {content.category?.name || 'Civic Issues'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{readTimeMinutes} मिनट का पठन</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
          {content.title}
        </h1>

        {/* Correction Alert Callout if article was corrected or retracted */}
        {correctionStatus !== 'NONE' && correctionNote && (
          <div className={`p-4 mb-6 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
            correctionStatus === 'RETRACTED'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5 uppercase font-mono text-[11px] tracking-wider">
              <span className={`w-2 h-2 rounded-full ${correctionStatus === 'RETRACTED' ? 'bg-rose-600' : 'bg-amber-600'}`} />
              <span>{correctionStatus === 'RETRACTED' ? 'खंडन सूचना (Retraction Notice)' : 'संपादकीय त्रुटि सुधार (Editorial Correction)'}</span>
            </div>
            <p className="leading-relaxed">
              {correctionNote}
            </p>
          </div>
        )}

        {/* Comprehensive Transparency Metadata Bar */}
        <div className="py-3.5 border-y border-stone-200 dark:border-slate-800 mb-6 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <User className="w-3.5 h-3.5 text-[#DE5227]" />
                <span>By: {authorName}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{locationStr}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <Eye className="w-3.5 h-3.5" />
                <span>{(content.views || 1).toLocaleString('en-IN')} दृश्य</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-stone-200/80 dark:border-slate-700">
                {isOriginalReporting ? 'Original Reporting' : 'Syndicated Wire'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-stone-200/50 dark:border-slate-800/50">
            <div className="flex flex-wrap items-center gap-3">
              <span><strong>Published:</strong> {formattedPublished}</span>
              {formattedUpdated && (
                <>
                  <span>•</span>
                  <span className="text-[#DE5227] dark:text-orange-400 font-medium">
                    <strong>Updated:</strong> {formattedUpdated}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span><strong>Source:</strong></span>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#DE5227] hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  <span>{sourceName}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span>{sourceName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Media Block (Video / Image) */}
        <div className="mb-4 rounded-3xl overflow-hidden border border-stone-200 dark:border-slate-800 shadow-sm bg-slate-950">
          {content.type === 'VIDEO' ? (
            <div className="relative aspect-video flex items-center justify-center bg-black">
              <video
                controls
                playsInline
                preload="metadata"
                poster={content.thumbnailUrl}
                className="w-full h-full object-contain"
                src={content.mediaUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="relative aspect-video">
              <img
                src={content.mediaUrl || content.thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167'}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Media Attribution Caption if available */}
        {mediaAttribution && (
          <div className="mb-6 text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
            Media Credit / Attribution: {mediaAttribution}
          </div>
        )}

        {/* Ground Reporting & Sourcing Context Pill */}
        <div className="p-4 mb-8 bg-stone-100/80 dark:bg-slate-900/80 border border-stone-200 dark:border-slate-800 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#DE5227] flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">
              ग्राउंड रिपोर्टिंग एवं संपादकीय प्रकटीकरण (Field Reporting &amp; Editorial Sourcing)
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              यह समाचार स्थानीय स्तर पर संकलित किया गया है। नागरिक संपादकीय सिद्धांतों के तहत प्रत्येक समाचार में स्रोत और लेखक की पहचान स्पष्ट रूप से दर्ज की जाती है।
            </p>
          </div>
        </div>

        {/* Reporter Card */}
        <div className="p-4 mb-8 rounded-2xl bg-[#FAF8F5] dark:bg-slate-900 border border-stone-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{authorName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isOriginalReporting ? 'नागरिक स्थानीय संवाददाता' : 'सहयोगी संवाददाता'} • {locationStr}
              </div>
            </div>
          </div>

          <Link
            href="/creator"
            className="text-[11px] font-bold text-[#DE5227] hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>प्रकाशक स्टूडियो</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Story Description Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg mb-10 space-y-4 font-normal">
          {content.description ? (
            content.description.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>इस घटना की विस्तृत जानकारी एकत्र की जा रही है।</p>
          )}
        </div>

        {/* ── ARTICLE INTEGRITY & REPORTING FOOTER DESK ── */}
        <div className="p-5 mb-10 rounded-2xl bg-[#FAF8F5] dark:bg-slate-900/90 border border-stone-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-stone-200/60 dark:border-slate-800 pb-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white font-serif">
              Article Transparency &amp; Corrections
            </div>
            <Link
              href={`/report?contentId=${content.id}&title=${encodeURIComponent(content.title)}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#DE5227] hover:underline"
            >
              <span>Report an error in this story</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Link href="/editorial-guidelines" className="hover:text-slate-900 dark:hover:text-white underline">
              Editorial Guidelines
            </Link>
            <span>•</span>
            <Link href="/sources" className="hover:text-slate-900 dark:hover:text-white underline">
              Sources &amp; Attribution Policy
            </Link>
            <span>•</span>
            <Link href="/corrections" className="hover:text-slate-900 dark:hover:text-white underline">
              Corrections Procedure
            </Link>
            <span>•</span>
            <Link href="/grievance" className="hover:text-slate-900 dark:hover:text-white underline">
              Grievance Redressal
            </Link>
          </div>
        </div>

        {/* Consumer Mobile App Download Banner */}
        <div id="download" className="p-6 md:p-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-2xl space-y-4 border border-slate-800">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-400 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>100% निःशुल्क उपभोक्ता ऐप (Zero Auth Public App)</span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-snug">
              अपने वार्ड और मोहल्ले की हर हलचल पर रखें सीधी नजर
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              नागरिक मोबाइल ऐप में किसी लॉगिन या पासवर्ड की जरूरत नहीं है। केवल इंस्टॉल करें और अपने 5 किमी दायरे की खबरें, वीडियो रील्स और नागरिक सूचनाएं तुरंत प्राप्त करें।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-brand-500/30"
              >
                <span>डाउनलोड करें Android APK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-xl transition"
              >
                वेब पर अन्य खबरें पढ़ें
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface NewsPageProps {
  params: {
    id: string;
  };
}

async function getContent(id: string) {
  try {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.content : null;
  } catch (err) {
    console.error(`Failed to fetch content ${id}:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const content = await getContent(params.id);

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
  const content = await getContent(params.id);

  if (!content) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
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
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-brand-500/20"
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

  const formattedDate = content.createdAt
    ? new Date(content.createdAt).toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'आज (Today)';

  // Calculate estimated reading time (~200 words per minute)
  const wordCount = (content.description || '').split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: content.title,
    description: content.description,
    image: [content.thumbnailUrl || content.mediaUrl],
    datePublished: content.createdAt,
    dateModified: content.updatedAt || content.createdAt,
    author: {
      '@type': 'Person',
      name: content.creatorName || 'Citizen Journalist'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Naagrik Hyperlocal News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pub-r2.naagrik.news/media/branding/logo.png'
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              {content.category?.name || 'नागरिक मुद्दा'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>~{readTimeMinutes} मिनट का पठन</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
          {content.title}
        </h1>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-slate-200/80 dark:border-slate-800 mb-6 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
              <span>{locationStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
              <Eye className="w-3.5 h-3.5" />
              <span>{(content.views || 1).toLocaleString('en-IN')} दृश्य</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>सत्यापित</span>
            </div>
          </div>
        </div>

        {/* Media Block (Video / Image) */}
        <div className="mb-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-950">
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

        {/* Ground Verification Certificate Pill */}
        <div className="p-4 mb-8 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-emerald-950 dark:text-emerald-300">
              नागरिक GPS ग्राउंड सत्यापन (Verified Hyperlocal Incident)
            </p>
            <p className="text-emerald-800 dark:text-emerald-400 leading-relaxed">
              यह रिपोर्ट घटनास्थल से सत्यापित जीपीएस निर्देशांक (GPS Geofence: 5 किमी दायरा) के साथ दर्ज की गई है।
            </p>
          </div>
        </div>

        {/* Reporter Card */}
        <div className="p-4 mb-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{content.creatorName || 'नागरिक ग्राउंड रिपोर्टर'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                सत्यापित स्थानीय संवाददाता • {locationStr}
              </div>
            </div>
          </div>

          <Link
            href="/#creators"
            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>स्ट्रिंगर प्रोग्राम</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Story Description Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg mb-12 space-y-4 font-normal">
          {content.description ? (
            content.description.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>इस घटना की विस्तृत जानकारी एकत्र की जा रही है।</p>
          )}
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

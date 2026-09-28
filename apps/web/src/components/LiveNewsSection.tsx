'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Play,
  Eye,
  Clock,
  ShieldCheck,
  Share2,
  ArrowRight,
  Flame,
  Filter,
  Video,
  FileText,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  type: 'ARTICLE' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl: string;
  category?: { name: string } | string;
  location?: { area?: string; city?: string; state?: string };
  views?: number;
  creatorName?: string;
  createdAt?: string;
}

export const LiveNewsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'ARTICLE'>('ALL');

  const fallbackStories: NewsItem[] = [
    {
      id: 'patna-drainage-2026',
      title: language === 'hi'
        ? 'पटना कंकड़बाग में नए ड्रेनेज पंपिंग स्टेशन का सफल परीक्षण, 50,000 घरों को जलजमाव से राहत'
        : 'Patna Kankarbagh Drainage Pumping Station Completes Successful Trial Run',
      description: language === 'hi'
        ? 'कंकड़बाग वार्ड 14 में दो वर्षों से लंबित ड्रेनेज पम्पिंग स्टेशन का आज सफल ट्रायल रन पूरा किया गया। बारिश के दिनों में जलजमाव की समस्या से जूझ रहे स्थानीय निवासियों ने राहत की सांस ली।'
        : 'Kankarbagh Ward 14 completes successful trial run of the 250HP pumping facility. Over 50,000 households expected to benefit from flood-free monsoon roads.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      category: language === 'hi' ? 'नागरिक मुद्दा' : 'Civic Issues',
      location: { area: 'Kankarbagh (Ward 14)', city: 'Patna', state: 'Bihar' },
      views: 1840,
      creatorName: language === 'hi' ? 'राहुल शर्मा (ग्राउंड स्ट्रिंगर)' : 'Rahul Sharma (Stringer)',
      createdAt: '2 घंटे पहले'
    },
    {
      id: 'varanasi-traffic-2026',
      title: language === 'hi'
        ? 'वाराणसी गोदौलिया चौराहे पर स्मार्ट ट्रैफिक सिग्नल और हेरिटेज वॉकवे का जीर्णोद्धार पूरा'
        : 'Varanasi Godowlia Square Smart Traffic System & Heritage Walkway Completed',
      description: language === 'hi'
        ? 'दशाश्वमेध मार्ग पर नए स्मार्ट ट्रैफिक सिस्टम और हेरिटेज कॉरिडोर का कार्य संपन्न। ग्राउंड कैमरे से कैद की गई विशेष वीडियो बाइट में देखें कैसे अब पैदल यात्रियों को मिलेगी सुगम आवाजाही।'
        : 'New AI-monitored traffic signals and pedestrian-friendly walkways launched at the busiest crossing leading to Dashashwamedh Ghat.',
      type: 'VIDEO',
      mediaUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
      category: language === 'hi' ? 'अवसंरचना विकास' : 'Infrastructure',
      location: { area: 'Godowlia Crossing', city: 'Varanasi', state: 'Uttar Pradesh' },
      views: 3290,
      creatorName: language === 'hi' ? 'अमित कुमार (सिटी रिपोर्टर)' : 'Amit Kumar (City Reporter)',
      createdAt: '3 घंटे पहले'
    },
    {
      id: 'lucknow-water-repair',
      title: language === 'hi'
        ? 'लखनऊ गोमती नगर एक्सटेंशन में पेयजल पाइपलाइन लीकेज 4 घंटे में दुरुस्त, जलापूर्ति बहाल'
        : 'Lucknow Gomti Nagar Extension Water Pipeline Repaired within 4 Hours',
      description: language === 'hi'
        ? 'स्थानीय नागरिकों द्वारा नागरिक ऐप पर सूचना पोस्ट करने के उपरांत जल संस्थान ने त्वरित कार्रवाई की। दोपहर तक मुख्य पाइपलाइन बदलकर 8 सोसायटियों में पानी की आपूर्ति बहाल की गई।'
        : 'Prompt civic response after residents flagged a major water burst on the Nagrik app. Water supply restored to 8 residential societies.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
      category: language === 'hi' ? 'नागरिक समस्या समाधान' : 'Civic Resolution',
      location: { area: 'Sector 4, Gomti Nagar', city: 'Lucknow', state: 'Uttar Pradesh' },
      views: 2450,
      creatorName: language === 'hi' ? 'दीपक वर्मा (सिटिजन जर्नलिस्ट)' : 'Deepak Verma (Citizen Reporter)',
      createdAt: '4 घंटे पहले'
    },
    {
      id: 'bengaluru-cycle-track',
      title: language === 'hi'
        ? 'बेंगलुरु इंदिरानगर में नागरिक समूह ने शुरू किया 5km सुरक्षित साइकिल ट्रैक व हरियाली अभियान'
        : 'Bengaluru Indiranagar Citizens Launch 5km Safe Cycle Track Corridor Drive',
      description: language === 'hi'
        ? 'स्थानीय निवासियों और स्कूल छात्रों ने सुरक्षित साइकिल चालन के लिए अलग लेन की मांग को लेकर शांतिपूर्ण जागरूकता मार्च निकाला। 1,200 से अधिक नागरिकों ने हस्ताक्षरित ज्ञापन सौंपा।'
        : 'Neighborhood initiative with over 1,200 citizen signatures submitted to BBMP for dedicated school and office cycling corridors.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      category: language === 'hi' ? 'पर्यावरण व स्वास्थ्य' : 'Environment & Health',
      location: { area: '100ft Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka' },
      views: 1980,
      creatorName: language === 'hi' ? 'के. एस. राव' : 'K. S. Rao',
      createdAt: '6 घंटे पहले'
    },
    {
      id: 'delhi-dwarka-park',
      title: language === 'hi'
        ? 'द्वारका सेक्टर 12 में स्थानीय युवाओं ने श्रमदान कर संवारा उपेक्षित पार्क, बच्चों के खेलने लायक बना'
        : 'Dwarka Sector 12 Youth Transform Neglected Park through Community Shramdaan',
      description: language === 'hi'
        ? 'नागरिक ऐप पर उठी आवाज के बाद आरडब्ल्यूए और युवा मंडली ने मिलकर 2 एकड़ में फैली घास की सफाई की और 60 नए छायादार पौधे रोपे।'
        : 'Community clean-up drive restores 2-acre neighborhood park with 60 native trees planted and walking path cleared.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
      category: language === 'hi' ? 'सामुदायिक पहल' : 'Community Action',
      location: { area: 'Sector 12, Dwarka', city: 'Delhi NCR', state: 'Delhi' },
      views: 1540,
      creatorName: language === 'hi' ? 'रोहित गुप्ता' : 'Rohit Gupta',
      createdAt: '8 घंटे पहले'
    },
    {
      id: 'pune-metro-trial',
      title: language === 'hi'
        ? 'पुणे हिंजेवाड़ी से शिवाजी नगर मेट्रो कॉरिडोर पर स्पीड ट्रायल रन सफल, आईटी प्रोफेशनल्स को बड़ी राहत'
        : 'Pune Hinjewadi to Shivaji Nagar Metro Speed Trial Successful',
      description: language === 'hi'
        ? 'ट्रायल रन के दौरान ट्रेन ने निर्धारित गति सीमा पर सभी तकनीकी मानकों को पूरा किया। इस रूट के शुरू होने से 2 लाख दैनिक यात्रियों का ट्रैफिक जाम से बचने का सपना पूरा होगा।'
        : 'High-speed trial passes all technical parameters, promising major traffic relief for over 200,000 daily IT corridor commuters.',
      type: 'VIDEO',
      mediaUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e82a?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e82a?auto=format&fit=crop&w=600&q=80',
      category: language === 'hi' ? 'परिवहन व तकनीक' : 'Transit & Tech',
      location: { area: 'Phase 1, Hinjewadi', city: 'Pune', state: 'Maharashtra' },
      views: 3120,
      creatorName: language === 'hi' ? 'सचिन पाटिल' : 'Sachin Patil',
      createdAt: '10 घंटे पहले'
    }
  ];

  useEffect(() => {
    const fetchLiveFeed = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contents')
          .select('*, creator:creators(display_name), category:categories(name)')
          .eq('publication_status', 'PUBLISHED')
          .order('created_at', { ascending: false })
          .limit(12);

        if (!error && data && data.length > 0) {
          const liveItems: NewsItem[] = data.map((i: any) => ({
            id: i.id,
            title: i.title,
            description: i.description || '',
            type: (i.type as 'ARTICLE' | 'VIDEO') || 'ARTICLE',
            mediaUrl: i.media_url,
            thumbnailUrl: i.thumbnail_url || i.media_url,
            category: i.category?.name || 'Civic',
            location: {
              area: i.location_area || '',
              city: i.location_city || 'Patna',
              state: i.location_state || 'Bihar'
            },
            views: i.views || 0,
            creatorName: i.author_name || i.creator?.display_name || 'Sohan',
            createdAt: i.created_at
          }));
          setNews(liveItems);
        } else {
          setNews(fallbackStories);
        }
      } catch (err) {
        setNews(fallbackStories);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveFeed();
  }, [language]);

  const filteredNews = news.filter((item) => {
    if (filter === 'VIDEO') return item.type === 'VIDEO';
    if (filter === 'ARTICLE') return item.type === 'ARTICLE';
    return true;
  });

  return (
    <section id="live-feed" className="py-20 md:py-28 bg-[#FAF9F6] dark:bg-[#0B0F17] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold font-mono border border-brand-500/20">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>{t.newsSectionBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
              {t.newsSectionTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.newsSectionSubtitle}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-end">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.newsFilterAll}
            </button>
            <button
              onClick={() => setFilter('VIDEO')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                filter === 'VIDEO'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{t.newsFilterVideos}</span>
            </button>
            <button
              onClick={() => setFilter('ARTICLE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                filter === 'ARTICLE'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.newsFilterArticles}</span>
            </button>
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredNews.map((item) => {
            const locationText = item.location
              ? [item.location.area, item.location.city].filter(Boolean).join(', ')
              : 'Ward 14, Patna';

            const categoryName = typeof item.category === 'object' && item.category
              ? item.category.name
              : typeof item.category === 'string'
              ? item.category
              : 'नागरिक मुद्दा';

            return (
              <article
                key={item.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Media Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                        {item.type === 'VIDEO' ? (
                          <>
                            <Play className="w-3 h-3 text-brand-400 fill-brand-400" />
                            <span>4K REEL</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3 text-emerald-400" />
                            <span>REPORT</span>
                          </>
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{t.newsVerifiedBadge}</span>
                      </span>
                    </div>

                    {/* Bottom Metadata Bar on Image */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1 text-slate-200 truncate">
                        <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 shrink-0">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{item.views ? item.views.toLocaleString() : '1,200'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Category & Time */}
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        {categoryName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.createdAt || '2h ago'}</span>
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug line-clamp-2">
                      <Link href={`/news/${item.id}`}>
                        {item.title}
                      </Link>
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Author & Read CTA */}
                <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[160px]">
                    {item.creatorName || 'नागरिक रिपोर्टर'}
                  </span>
                  <Link
                    href={`/news/${item.id}`}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition"
                  >
                    <span>{item.type === 'VIDEO' ? t.newsWatchVideo : t.newsReadMore}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Ground Reporter Action Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-500/10 via-amber-500/5 to-transparent dark:from-brand-500/20 dark:via-slate-900 dark:to-slate-900 border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
              {t.newsReportIncidentBannerTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {t.newsReportIncidentBannerSub}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/#app-download"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.newsReportIncidentBtn}</span>
            </Link>
            <Link
              href="/creator"
              className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition flex items-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <span>{t.creatorCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

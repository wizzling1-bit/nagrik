'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Video,
  FileText
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

export const NewsSection: React.FC = () => {
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
        ? 'कंकड़बाग वार्ड 14 में दो वर्षों से लंबित ड्रेनेज पम्पिंग स्टेशन का ट्रायल रन पूरा हुआ। मानसून में सड़कों पर पानी जमा न होने की उम्मीद से स्थानीय निवासियों में संतोष।'
        : 'Ward 14 finished testing new water pumps. Over 50,000 neighbors will now have flood-free roads this monsoon.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
      category: language === 'hi' ? 'नागरिक अवसंरचना' : 'Infrastructure',
      location: { area: 'Kankarbagh Ward 14', city: 'Patna' },
      createdAt: language === 'hi' ? '20 मिनट पहले' : '20 min ago'
    },
    {
      id: 'varanasi-traffic-2026',
      title: language === 'hi'
        ? 'वाराणसी गोदौलिया चौराहे पर स्मार्ट ट्रैफिक सिग्नल व पैदल पथ का कार्य पूरा'
        : 'Varanasi Godowlia Square Smart Traffic System & Heritage Walkway Completed',
      description: language === 'hi'
        ? 'दशाश्वमेध मार्ग पर नए स्मार्ट ट्रैफिक सिस्टम का कार्य संपन्न। पैदल यात्रियों को अब मिलेगी सुगम आवाजाही।'
        : 'New AI-monitored traffic lights and pedestrian corridors launched near Dashashwamedh Ghat.',
      type: 'VIDEO',
      mediaUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      category: language === 'hi' ? 'यातायात व विकास' : 'Transit & Urban',
      location: { area: 'Godowlia Crossing', city: 'Varanasi' },
      createdAt: language === 'hi' ? '1 घंटा पहले' : '1 hour ago'
    },
    {
      id: 'lucknow-water-repair',
      title: language === 'hi'
        ? 'लखनऊ गोमती नगर एक्सटेंशन में पेयजल पाइपलाइन लीकेज 4 घंटे में दुरुस्त'
        : 'Lucknow Gomti Nagar Extension Water Pipeline Repaired within 4 Hours',
      description: language === 'hi'
        ? 'स्थानीय नागरिकों द्वारा सूचना पोस्ट करने के उपरांत जल संस्थान ने त्वरित कार्रवाई कर आपूर्ति बहाल की।'
        : 'Prompt civic response after residents flagged a major water burst on the Nagrik app.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
      category: language === 'hi' ? 'नागरिक सेवा' : 'Civic Utilities',
      location: { area: 'Sector 4, Gomti Nagar', city: 'Lucknow' },
      createdAt: language === 'hi' ? '3 घंटे पहले' : '3 hours ago'
    },
    {
      id: 'bengaluru-cycle-track',
      title: language === 'hi'
        ? 'बेंगलुरु इंदिरानगर में नागरिक समूह ने शुरू किया 5km सुरक्षित साइकिल ट्रैक अभियान'
        : 'Bengaluru Indiranagar Citizens Launch 5km Safe Cycle Track Corridor Drive',
      description: language === 'hi'
        ? 'स्थानीय निवासियों ने सुरक्षित साइकिल चालन के लिए अलग लेन की मांग को लेकर जागरूकता मार्च निकाला।'
        : 'Over 1,200 neighbors signed a petition asking the city for safe bike lanes near schools.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      category: language === 'hi' ? 'पर्यावरण' : 'Environment',
      location: { area: '100ft Road, Indiranagar', city: 'Bengaluru' },
      createdAt: language === 'hi' ? '5 घंटे पहले' : '5 hours ago'
    },
    {
      id: 'pune-metro-trial',
      title: language === 'hi'
        ? 'पुणे हिंजेवाड़ी से शिवाजी नगर मेट्रो कॉरिडोर पर स्पीड ट्रायल रन सफल'
        : 'Pune Hinjewadi to Shivaji Nagar Metro Speed Trial Successful',
      description: language === 'hi'
        ? 'ट्रायल रन के दौरान ट्रेन ने निर्धारित मानकों को पूरा किया। दैनिक आईटी यात्रियों को बड़ी राहत मिलेगी।'
        : 'The high-speed metro test passed every check, bringing traffic relief for over 200,000 daily riders.',
      type: 'VIDEO',
      mediaUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e82a?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e82a?auto=format&fit=crop&w=800&q=80',
      category: language === 'hi' ? 'यातायात' : 'Transit',
      location: { area: 'Phase 1, Hinjewadi', city: 'Pune' },
      createdAt: language === 'hi' ? '7 घंटे पहले' : '7 hours ago'
    },
    {
      id: 'delhi-dwarka-park',
      title: language === 'hi'
        ? 'द्वारका सेक्टर 12 में स्थानीय युवाओं ने श्रमदान कर संवारा उपेक्षित पार्क'
        : 'Dwarka Sector 12 Youth Transform Neglected Park through Community Effort',
      description: language === 'hi'
        ? 'आरडब्ल्यूए और युवा मंडली ने मिलकर 2 एकड़ पार्क की सफाई की और 60 नए पौधे रोपे।'
        : 'Community clean-up drive restores neighborhood green space with native saplings planted.',
      type: 'ARTICLE',
      mediaUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      category: language === 'hi' ? 'समुदाय' : 'Community',
      location: { area: 'Sector 12, Dwarka', city: 'Delhi NCR' },
      createdAt: language === 'hi' ? '9 घंटे पहले' : '9 hours ago'
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

  const leadStory = filteredNews[0] || fallbackStories[0];
  const secondaryStories = filteredNews.slice(1, 3);
  const supportingStories = filteredNews.slice(3, 6);

  return (
    <section id="news" className="py-16 sm:py-24 bg-transparent border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Left-Aligned Editorial Rhythm & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="text-xs font-mono font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400">
              {t.newsSectionBadge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
              {t.newsSectionTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {t.newsSectionSubtitle}
            </p>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#0B1728] rounded-xl border border-slate-200/80 dark:border-slate-800 self-start md:self-end">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{t.newsFilterAll}</span>
            </button>
            <button
              onClick={() => setFilter('VIDEO')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filter === 'VIDEO'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{t.newsFilterVideos}</span>
            </button>
            <button
              onClick={() => setFilter('ARTICLE')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filter === 'ARTICLE'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.newsFilterArticles}</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* EDITORIAL HIERARCHY: 1 Prominent Lead Story + 2 Secondary Stories */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8 text-left">
          
          {/* FEATURED LEAD STORY (7 Columns on Desktop) */}
          {leadStory && (
            <article className="lg:col-span-7 bg-white dark:bg-[#0B1728] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 flex flex-col justify-between group">
              <div>
                {/* Lead Image with 16:9 ratio */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={leadStory.thumbnailUrl || leadStory.mediaUrl}
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    loading="lazy"
                  />
                  {leadStory.type === 'VIDEO' && (
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-md">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-black/75 backdrop-blur-xs text-white border border-white/20">
                      {t.newsFeaturedTag}
                    </span>
                  </div>
                </div>

                {/* Lead Content */}
                <div className="p-6 sm:p-7 space-y-3">
                  {/* Category · Location · Time */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      {typeof leadStory.category === 'object' ? leadStory.category?.name : leadStory.category || 'CIVIC'}
                    </span>
                    <span>·</span>
                    <span>{leadStory.location?.city || 'Patna'}</span>
                    <span>·</span>
                    <span>{leadStory.createdAt || 'Just now'}</span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    <Link href={`/news/${leadStory.id}`}>
                      {leadStory.title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {leadStory.description}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 sm:px-7 py-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {leadStory.location?.area || 'Ground Report'}
                </span>
                <Link
                  href={`/news/${leadStory.id}`}
                  className="font-semibold text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition"
                >
                  <span>{leadStory.type === 'VIDEO' ? t.newsWatchVideo : t.newsReadStory}</span>
                </Link>
              </div>
            </article>
          )}

          {/* SECONDARY STORIES (5 Columns on Desktop: 2 Cards Stacked) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryStories.map((story) => (
              <article
                key={story.id}
                className="bg-white dark:bg-[#0B1728] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 flex flex-col justify-between flex-1 group"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Thumbnail 16:9 ratio */}
                  <div className="relative w-full sm:w-36 aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                    <img
                      src={story.thumbnailUrl || story.mediaUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      loading="lazy"
                    />
                    {story.type === 'VIDEO' && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-sm">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase">
                        {typeof story.category === 'object' ? story.category?.name : story.category || 'LOCAL'}
                      </span>
                      <span>·</span>
                      <span>{story.location?.city || 'Local'}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      <Link href={`/news/${story.id}`}>
                        {story.title}
                      </Link>
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {story.createdAt || 'Today'}
                  </span>
                  <Link
                    href={`/news/${story.id}`}
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <span>{story.type === 'VIDEO' ? t.newsWatchVideo : t.newsReadStory}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>

        {/* ================================================================= */}
        {/* SUPPORTING STORIES: 3 Balanced Cards Grid                         */}
        {/* ================================================================= */}
        {supportingStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {supportingStories.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-[#0B1728] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      loading="lazy"
                    />
                    {item.type === 'VIDEO' && (
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-sm">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase">
                        {typeof item.category === 'object' ? item.category?.name : item.category || 'LOCAL'}
                      </span>
                      <span>·</span>
                      <span>{item.location?.city || 'Local'}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      <Link href={`/news/${item.id}`}>
                        {item.title}
                      </Link>
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {item.createdAt || 'Today'}
                  </span>
                  <Link
                    href={`/news/${item.id}`}
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <span>{item.type === 'VIDEO' ? t.newsWatchVideo : t.newsReadStory}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

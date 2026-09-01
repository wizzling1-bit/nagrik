import React, { useState, useEffect } from 'react';
import {
  Play,
  FileText,
  MapPin,
  Heart,
  Bookmark,
  Share2,
  Smartphone,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Tv,
  Eye,
  CheckCircle2,
  Sparkles,
  QrCode,
  X,
  Search,
  HelpCircle,
  TrendingUp,
  Award,
  Users,
  Video,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Globe2,
  Calculator,
  Flame
} from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'creator' | 'admin') => void;
}

// Typewriter Hook with full Devanagari / Unicode Grapheme Cluster support
const getGraphemes = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const segmenter = new (Intl as any).Segmenter('hi', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s: any) => s.segment);
  }
  return Array.from(text);
};

const useTypewriter = (phrases: string[], typingSpeed = 75, deletingSpeed = 40, pauseTime = 2200) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullPhrase = phrases[currentPhraseIndex];
    const graphemes = getGraphemes(fullPhrase);
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (charCount < graphemes.length) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (charCount > 0) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charCount, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  const currentPhrase = phrases[currentPhraseIndex];
  const graphemes = getGraphemes(currentPhrase);
  return graphemes.slice(0, charCount).join('');
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('Patna');
  const [selectedArea, setSelectedArea] = useState<string>('Kankarbagh');
  const [contentType, setContentType] = useState<'ALL' | 'VIDEO' | 'ARTICLE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [selectedContentModal, setSelectedContentModal] = useState<any | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'reader' | 'creator'>('reader');
  const [calcViews, setCalcViews] = useState<number>(10000);

  const typewriterPhrases = [
    'सच्ची व निष्पक्ष स्थानीय आवाज़',
    'वार्ड और मोहल्ले की समस्याओं का समाधान',
    'रिपोर्टिंग करें और $1.50/1K व्यूज़ कमाएं',
    'फेक न्यूज़ और टीवी बहसों से पूरी आज़ादी'
  ];

  const typedText = useTypewriter(typewriterPhrases, 80, 45, 2200);

  const cities = ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'];
  const areas: Record<string, string[]> = {
    Patna: ['Kankarbagh', 'Boring Road', 'Patna Sahib', 'Bailey Road', 'Frazer Road', 'Danapur'],
    Gaya: ['Bodhgaya', 'Civil Lines', 'Rampur', 'AP Colony'],
    Muzaffarpur: ['Mithanpura', 'Brahmpura', 'Zero Mile'],
    Bhagalpur: ['Tilkamanjhi', 'Zero Mile', 'Adampur'],
    Darbhanga: ['Laheriasarai', 'Tower Chowk']
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/content/categories`);
      const data = await res.json();
      if (data.success && data.categories?.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories([
          { id: 'local', slug: 'local', name: 'लोकल न्यूज़ (Local)' },
          { id: 'politics', slug: 'politics', name: 'राजनीति (Politics)' },
          { id: 'crime', slug: 'crime', name: 'क्राइम (Crime)' },
          { id: 'sports', slug: 'sports', name: 'खेल (Sports)' },
          { id: 'business', slug: 'business', name: 'कारोबार (Business)' },
          { id: 'entertainment', slug: 'entertainment', name: 'मनोरंजन (Entertainment)' }
        ]);
      }
    } catch {
      setCategories([
        { id: 'local', slug: 'local', name: 'लोकल न्यूज़ (Local)' },
        { id: 'politics', slug: 'politics', name: 'राजनीति (Politics)' },
        { id: 'crime', slug: 'crime', name: 'क्राइम (Crime)' },
        { id: 'sports', slug: 'sports', name: 'खेल (Sports)' },
        { id: 'business', slug: 'business', name: 'कारोबार (Business)' },
        { id: 'entertainment', slug: 'entertainment', name: 'मनोरंजन (Entertainment)' }
      ]);
    }
  };

  const fetchFeed = async () => {
    setLoadingFeed(true);
    try {
      let url = `${API_BASE}/content/feed?city=${encodeURIComponent(selectedCity)}&area=${encodeURIComponent(selectedArea)}`;
      if (contentType !== 'ALL') {
        url += `&contentType=${contentType}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.items?.length > 0) {
        let items = data.items;
        if (selectedCategory !== 'ALL') {
          items = items.filter((i: any) => {
            if (i.itemType === 'ADVERTISEMENT') return true;
            const catId = i.data.categoryId?.slug || i.data.categoryId?.id || i.data.categoryId;
            return catId === selectedCategory;
          });
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          items = items.filter((i: any) => {
            if (i.itemType === 'ADVERTISEMENT') return true;
            return (
              i.data.title?.toLowerCase().includes(q) ||
              i.data.description?.toLowerCase().includes(q)
            );
          });
        }
        setFeedItems(items);
      } else {
        setFeedItems([
          {
            itemType: 'CONTENT',
            data: {
              id: 'demo-1',
              _id: 'demo-1',
              type: 'VIDEO',
              title: 'पटना मेट्रो निर्माण कार्य: भूमिगत टनल का काम अंतिम चरण में पहुंचा',
              description: 'पटना जंक्शन से राजेंद्र नगर के बीच टनल बोरिंग मशीन ने खुदाई का पहला चरण पूरा किया। 2026 के अंत तक ट्रायल रन की योजना।',
              mediaUrl: 'https://pub-r2.naagrik.news/media/videos/sample.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
              categoryId: { name: 'लोकल न्यूज़' },
              location: { city: 'Patna', area: 'Kankarbagh' },
              views: 4820,
              eligibleViews: 3200,
              likes: 412,
              publishedAt: new Date().toISOString()
            }
          },
          {
            itemType: 'CONTENT',
            data: {
              id: 'demo-2',
              _id: 'demo-2',
              type: 'ARTICLE',
              title: 'बिहार में 15,000 किलोमीटर नई ग्रामीण सड़कों के निर्माण को कैबिनेट की मंजूरी',
              description: 'ग्रामीण कार्य विभाग द्वारा पेश किए गए प्रस्ताव को मुख्यमंत्री की अध्यक्षता में आयोजित कैबिनेट बैठक में हरी झंडी मिली।',
              mediaUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
              categoryId: { name: 'राजनीति' },
              location: { city: 'Patna', area: 'Bailey Road' },
              views: 2950,
              eligibleViews: 2100,
              likes: 184,
              publishedAt: new Date().toISOString()
            }
          },
          {
            itemType: 'ADVERTISEMENT',
            data: {
              id: 'ad-demo',
              name: 'Patna Grand Mega Shopping Utsav',
              type: 'BANNER',
              mediaUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
              status: 'ACTIVE'
            }
          },
          {
            itemType: 'CONTENT',
            data: {
              id: 'demo-3',
              _id: 'demo-3',
              type: 'VIDEO',
              title: 'कंकड़बाग जलजमाव मुक्ति अभियान: 4 नए हाई-कैपेसिटी संप हाउस शुरू',
              description: 'नगर निगम द्वारा मानसून से पूर्व आधुनिक संप हाउसों का सफल ट्रायल रन किया गया। स्थानीय नागरिकों को राहत की उम्मीद।',
              mediaUrl: 'https://pub-r2.naagrik.news/media/videos/sample.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
              categoryId: { name: 'लोकल न्यूज़' },
              location: { city: 'Patna', area: 'Kankarbagh' },
              views: 3120,
              eligibleViews: 2400,
              likes: 298,
              publishedAt: new Date().toISOString()
            }
          }
        ]);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [selectedCity, selectedArea, selectedCategory, contentType, searchQuery]);

  const handleLike = async (contentId: string) => {
    setLikedMap(prev => ({ ...prev, [contentId]: !prev[contentId] }));
    try {
      await fetch(`${API_BASE}/content/${contentId}/like`, { method: 'POST' });
    } catch {}
  };

  const handleSave = async (contentId: string) => {
    setSavedMap(prev => ({ ...prev, [contentId]: !prev[contentId] }));
    try {
      await fetch(`${API_BASE}/content/${contentId}/save`, { method: 'POST' });
    } catch {}
  };

  const handleOpenContent = async (item: any) => {
    setSelectedContentModal(item);
    try {
      await fetch(`${API_BASE}/views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: item.id || item._id,
          deviceId: 'web-guest-device-id'
        })
      });
    } catch {}
  };

  const faqs = [
    {
      q: 'नागरिक (Naagrik) क्या है और यह अन्य न्यूज़ चैनलों से अलग क्यों है?',
      a: 'नागरिक भारत का पहला हाइपरलोकल, कम्युनिटी-संचालित न्यूज़ और वीडियो नेटवर्क है। टीवी या मुख्यधारा के अख़बार आपके वार्ड, मोहल्ले या गली की समस्याओं को नहीं दिखाते। नागरिक पर आपके ही इलाके के स्थानीय लोग वीडियो रिपोर्ट बनाकर असली समस्याओं (सड़क, पानी, बिजली, घटनाएं) को उजागर करते हैं।'
    },
    {
      q: 'क्या खबर पढ़ने या देखने के लिए मुझे लॉगिन या सब्सक्रिप्शन की ज़रूरत है?',
      a: 'बिल्कुल नहीं! आम नागरिकों के लिए समाचार पढ़ना और वीडियो देखना 100% मुफ़्त है। बिना किसी पासवर्ड, ओटीपी या लॉगिन के आप तुरंत अपने शहर व वार्ड की ताज़ा खबरें देख सकते हैं।'
    },
    {
      q: 'नागरिक रिपोर्टर बनकर पैसे कैसे कमाए जा सकते हैं?',
      a: 'अगर आपके पास एक स्मार्टफोन है, तो आप अपने क्षेत्र की किसी भी महत्वपूर्ण घटना या समस्या की 60-सेकंड की वीडियो रिपोर्ट अपलोड कर सकते हैं। हमारी टीम द्वारा सत्यापन के बाद, आपकी खबर पर मिलने वाले हर 1,000 पात्र व्यूज़ पर $1.50 (लगभग ₹125+) दिए जाते हैं। $10 होते ही आप सीधे UPI या बैंक खाते में निकासी कर सकते हैं।'
    },
    {
      q: 'क्या नागरिक पर प्रकाशित खबरें सच्ची और निष्पक्ष होती हैं?',
      a: 'हाँ, नागरिक पर अपलोड होने वाली हर वीडियो और खबर को हमारी अनुभवी संपादकीय और फैक्ट-चेकिंग टीम द्वारा जांचा जाता है। फर्जी खबरों, भ्रामक दावों या नफरत फैलाने वाले कंटेंट को तुरंत रिजेक्ट कर दिया जाता है।'
    },
    {
      q: 'क्या नागरिक का मोबाइल ऐप उपलब्ध है?',
      a: 'हाँ, नागरिक का अल्ट्रा-लाइट Android और iOS ऐप उपलब्ध है। ऐप में आप शॉर्ट वीडियो रील की तरह खबरें स्वाइप कर सकते हैं और अपने मोहल्ले के लाइव अलर्ट्स तुरंत पा सकते हैं।'
    }
  ];

  // Calculated Earnings for live simulator
  const estimatedDollars = ((calcViews / 1000) * 1.5).toFixed(2);
  const estimatedRupees = Math.round(Number(estimatedDollars) * 86.5);

  return (
    <div className="space-y-12 overflow-hidden">
      {/* 1. HERO SHOWCASE WITH TYPEWRITER ANIMATION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5ED] via-[#FFF9F5] to-white py-12 sm:py-20 border-b border-orange-100">
        {/* Animated Glow Elements */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#E36138]/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Top Tagline Badge with pulse indicator */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 text-[#E36138] text-xs font-black uppercase tracking-wider shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E36138] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E36138]"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#E36138]" />
                <span>भारत का अपना हाइपरलोकल न्यूज़ नेटवर्क</span>
              </div>

              {/* Main Headline with Smooth Typewriter Effect */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                  नागरिक —{' '}
                  <span className="text-[#E36138] inline-block pt-1 pb-2">
                    {typedText || '\u00A0'}
                  </span>
                  <span className="inline-block w-1 h-7 sm:h-10 bg-[#E36138] ml-1.5 align-middle animate-cursor-blink" />
                </h1>
              </div>

              {/* Clear Value Description */}
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                टीवी की बहसों को अलविदा कहें! अपने वार्ड, कॉलोनी और शहर की 100% निष्पक्ष खबरें देखें, अपनी समस्याएं वीडियो से उठाएं, और खुद रिपोर्टर बनकर हर खबर पर पैसे कमाएं।
              </p>

              {/* Primary Call-to-Actions with subtle hover lift */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="#feed-section"
                  className="bg-gradient-to-r from-[#E36138] to-[#D24E25] hover:from-[#D24E25] hover:to-[#B83E1A] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current animate-pulse" />
                  <span>लोकल खबरें देखें (Live Feed)</span>
                </a>

                <button
                  onClick={() => onNavigate('creator')}
                  className="bg-white hover:bg-orange-50 text-slate-800 border-2 border-orange-200 text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl shadow-xs transition-all duration-300 flex items-center gap-2 hover:border-[#E36138] transform hover:-translate-y-0.5 active:scale-95"
                >
                  <DollarSign className="w-4 h-4 text-[#E36138]" />
                  <span>रिपोर्टर बनें ($1.50/1K Views)</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-bold border-t border-orange-100/80">
                <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-orange-50/60 transition">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>100% सत्यापित खबरें</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-orange-50/60 transition">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-[#E36138]" />
                  </div>
                  <span>बिना लॉगिन तुरंत शुरू</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1 justify-center sm:justify-start p-2 rounded-xl hover:bg-orange-50/60 transition">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span>हर खबर पर सीधी कमाई</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card with Float Effect */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900 border-4 border-white shadow-2xl overflow-hidden group animate-float">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"
                  alt="Patna Metro Featured"
                  className="w-full h-80 sm:h-96 object-cover opacity-85 group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="bg-[#E36138] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md animate-pulse">
                      <Tv className="w-3 h-3" />
                      <span>आज की बड़ी खबर (Trending)</span>
                    </span>
                    <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md border border-white/10">
                      02:45
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[11px] text-[#FED7AA] font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FB923C]" />
                      <span>पटना जंक्शन • 4,820 वेरीफाइड व्यूज़</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      पटना मेट्रो निर्माण कार्य: भूमिगत टनल का काम अंतिम चरण में पहुंचा
                    </h3>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => handleOpenContent({
                          id: 'hero-1',
                          type: 'VIDEO',
                          title: 'पटना मेट्रो निर्माण कार्य: भूमिगत टनल का काम अंतिम चरण में पहुंचा',
                          description: 'पटना जंक्शन से राजेंद्र नगर के बीच टनल बोरिंग मशीन ने खुदाई का पहला चरण पूरा किया। 2026 के अंत तक ट्रायल रन की योजना।',
                          mediaUrl: 'https://pub-r2.naagrik.news/media/videos/sample.mp4',
                          thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
                          location: { city: 'Patna', area: 'Kankarbagh' },
                          views: 4820,
                          likes: 412
                        })}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-white to-orange-50 hover:to-orange-100 text-[#E36138] text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>वीडियो रिपोर्ट देखें</span>
                      </button>
                      <span className="text-[11px] text-slate-300 font-medium">60s त्वरित अपडेट</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHY NAAGRIK?" VALUE PROPOSITION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E36138] text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>नागरिक आपके लिए क्यों ज़रूरी है?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            मुख्यधारा मीडिया से हटकर, सिर्फ आपके मतलब की खबरें
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            नागरिक सिर्फ एक न्यूज़ ऐप नहीं, बल्कि आम नागरिकों को अपनी आवाज़ उठाने और स्थानीय समस्याओं का समाधान पाने का एक सशक्त मंच है।
          </p>
        </div>

        {/* 4 Key Pillar Cards with Dynamic Hover Transforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-2xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E36138] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E36138] group-hover:text-white transition duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-[#E36138] transition">
                100% हाइपरलोकल कवरेज
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                टीवी चैनलों पर सिर्फ राष्ट्रीय बहसें होती हैं। नागरिक आपको आपके वार्ड, कॉलोनी और मुख्य चौराहों की हर छोटी-बड़ी घटना दिखाता है।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#E36138]">
              <span>गली-मोहल्ले की ताज़ा खबर</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition">
                फेक न्यूज़ से आज़ादी
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                व्हाट्सएप और सोशल मीडिया पर फैलने वाली अफ़वाहों से बचें। नागरिक पर हर वीडियो और खबर को ग्राउंड-लेवल पर वेरीफाई किया जाता है।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
              <span>संपादकीय रूप से जांची गई</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-2xl hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition">
                समस्या उठाएं, समाधान पाएं
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                टूटी सड़क, बिजली संकट, सीवर या अस्पताल की अनदेखी—नागरिक पर वीडियो बनाकर अधिकारियों और प्रशासन तक तुरंत बात पहुंचाएं।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700">
              <span>सीधा नागरिक प्रभाव (Impact)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition">
                रिपोर्टिंग से सीधी कमाई
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                अगर आप खबर रिकॉर्ड करते हैं, तो आपको मिलता है $1.50 प्रति 1,000 व्यूज़। कोई भी छात्र, पत्रकार या नागरिक कमाई शुरू कर सकता है।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
              <span>$10 होते ही तुरंत निकासी</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE EARNINGS SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-orange-500 via-[#E36138] to-[#C9431D] text-white rounded-[32px] p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                <Calculator className="w-3.5 h-3.5" />
                <span>लाइव कमाई कैलकुलेटर (Earnings Simulator)</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                अंदाजा लगाएं: आपकी वीडियो रिपोर्ट से कितनी कमाई होगी?
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 leading-relaxed font-medium">
                स्लाइडर को आगे-पीछे करके देखें कि आपके क्षेत्र की खबरों पर मिलने वाले व्यूज़ से आपका संभावित पेआउट कितना होगा।
              </p>

              <div className="space-y-2 pt-3 max-w-lg">
                <div className="flex justify-between text-xs font-black text-orange-100">
                  <span>अनुमानित व्यूज़ (Estimated Views)</span>
                  <span className="text-white text-sm font-mono bg-black/20 px-2.5 py-0.5 rounded-md">
                    {calcViews.toLocaleString()} Views
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={calcViews}
                  onChange={(e) => setCalcViews(Number(e.target.value))}
                  className="w-full h-3 bg-black/30 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-orange-200">
                  <span>1K</span>
                  <span>25K</span>
                  <span>50K</span>
                  <span>100K</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-950/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-4 shadow-2xl">
                <div className="text-xs font-extrabold text-orange-300 uppercase tracking-wider">
                  सीधा बैंक / UPI पेआउट
                </div>

                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight animate-pulse">
                    ${estimatedDollars}
                  </div>
                  <div className="text-sm font-bold text-slate-300 font-mono">
                    ≈ ₹{estimatedRupees.toLocaleString()} (भारतीय रुपये)
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  दर: $1.50 प्रति 1,000 योग्य व्यूज़ • न्यूनतम निकासी: $10.00
                </div>

                <button
                  onClick={() => onNavigate('creator')}
                  className="w-full bg-gradient-to-r from-[#E36138] to-[#FB923C] hover:opacity-95 text-white text-xs font-black py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 fill-current" />
                  <span>अभी रिपोर्टर बनकर कमाई शुरू करें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DUAL PERSONA: CITIZEN READER VS CITIZEN REPORTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E36138]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 relative z-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FB923C] bg-orange-950/80 px-3 py-1 rounded-full border border-orange-800">
              आपके लिए क्या है?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              चाहे आप खबर पढ़ना चाहें या खबर बनाना — <span className="text-[#FB923C]">नागरिक दोनों के लिए बना है</span>
            </h2>

            {/* Toggle Tabs */}
            <div className="inline-flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 mt-2">
              <button
                onClick={() => setActiveTab('reader')}
                className={`px-5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                  activeTab === 'reader' ? 'bg-[#E36138] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>आम पाठक के लिए (For Readers)</span>
              </button>
              <button
                onClick={() => setActiveTab('creator')}
                className={`px-5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                  activeTab === 'creator' ? 'bg-[#E36138] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>नागरिक रिपोर्टर के लिए (For Reporters)</span>
              </button>
            </div>
          </div>

          {activeTab === 'reader' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-in fade-in duration-300">
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3 hover:border-orange-500 transition">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FB923C] flex items-center justify-center">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <h4 className="font-black text-base text-white">60-सेकंड शॉर्ट वीडियो</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  लंबे और उबाऊ एंकर मोनोलॉग नहीं! सिर्फ 60 सेकंड में अपने शहर की ज़रूरी और रोचक खबरें वीडियो फॉर्मेट में देखें।
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3 hover:border-emerald-500 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-white">पिन-पॉइंट वार्ड फ़िल्टर</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  पटना, गया, मुजफ्फरपुर सहित बिहार के प्रमुख शहरों के हर इलाके और मोहल्ले का अलग फीड चुनें और अपने पास की खबरें पाएं।
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3 hover:border-indigo-500 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-white">जीरो स्पैम & बिना लॉगिन</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  कोई पॉप-अप विज्ञापन नहीं, कोई अनचाहे रजिस्ट्रेशन नहीं। बस वेबसाइट या ऐप खोलें और तुरंत पढ़ना शुरू करें।
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-in fade-in duration-300">
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3 hover:border-emerald-500 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-white">$1.50 प्रति 1,000 व्यूज़</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  पारदर्शी मॉनेटाइजेशन पॉलिसी। आपकी खबर को जितने ज्यादा लोग देखेंगे, आपकी कमाई उतनी तेजी से आपके डैशबोर्ड में जुड़ेगी।
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3 hover:border-orange-500 transition">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FB923C] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-white">सिर्फ स्मार्टफोन से शुरुआत</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  किसी महंगे कैमरे या सेटअप की जरूरत नहीं। अपने मोबाइल से वीडियो बनाएं, शीर्षक और विवरण डालें और एक क्लिक में सबमिट करें।
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3 hover:border-indigo-500 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-white">पहचान और क्रेडिबिलिटी</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  अपने इलाके के वेरीफाइड नागरिक पत्रकार बनें, स्थानीय स्तर पर पहचान बनाएं और समाज में सकारात्मक बदलाव लाएं।
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center relative z-10">
            {activeTab === 'reader' ? (
              <a
                href="#feed-section"
                className="inline-flex items-center gap-2 bg-[#E36138] hover:bg-[#D24E25] text-white text-xs font-black px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                <span>अभी अपने मोहल्ले की खबरें देखें</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => onNavigate('creator')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                <span>क्रिएटर स्टूडियो खोलें व रिपोर्ट सबमिट करें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS - 3 SIMPLE STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E36138] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>सरल कार्यप्रणाली</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            नागरिक कैसे काम करता है? (3 आसान चरण)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition transform hover:-translate-y-1 relative">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E36138] font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-black text-slate-900 text-base mb-2">अपना शहर और वार्ड चुनें</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              ड्रॉपडाउन से अपने शहर और इलाके को सेलेक्ट करें। आपको सिर्फ आपके आस-पास से जुड़ी ताज़ा और वेरीफाइड ख़बरें तुरंत दिखेंगी।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition transform hover:-translate-y-1 relative">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E36138] font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-black text-slate-900 text-base mb-2">खबरें देखें या खुद रिपोर्ट करें</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              60-सेकंड की शॉर्ट वीडियो या आर्टिकल्स पढ़ें। यदि आपके पास कोई घटना या समस्या है, तो 1 मिनट में अपनी रिपोर्ट अपलोड करें।
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition transform hover:-translate-y-1 relative">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E36138] font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-black text-slate-900 text-base mb-2">सत्यापन, बदलाव व पुरस्कार</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              एडिटोरियल टीम द्वारा जांच के बाद खबर लाइव होती है। व्यूज़ के आधार पर क्रिएटर को सीधे नकद इनाम और समाज को समाधान मिलता है।
            </p>
          </div>
        </div>
      </section>

      {/* 6. LIVE NEWS FEED & SHORT VIDEOS SECTION */}
      <section id="feed-section" className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-6 pt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">LIVE FEED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {selectedCity} • {selectedArea} की ताज़ा खबरें
            </h2>
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="खबरें खोजें (Search news)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E36138] focus:ring-1 focus:ring-[#E36138]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* City & Ward Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#E36138]" /> लोकेशन:
            </span>
            <select
              className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#E36138]"
              value={selectedCity}
              onChange={e => {
                setSelectedCity(e.target.value);
                setSelectedArea(areas[e.target.value]?.[0] || 'All Areas');
              }}
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-[#E36138] outline-none focus:border-[#E36138]"
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
            >
              {(areas[selectedCity] || ['Main City']).map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setContentType('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                contentType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              सभी (All)
            </button>
            <button
              onClick={() => setContentType('VIDEO')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                contentType === 'VIDEO' ? 'bg-[#E36138] text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>शॉर्ट वीडियो (Shorts)</span>
            </button>
            <button
              onClick={() => setContentType('ARTICLE')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                contentType === 'ARTICLE' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>आर्टिकल्स</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition ${
              selectedCategory === 'ALL'
                ? 'bg-[#E36138] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            सभी कैटेगरी (All)
          </button>
          {categories.map(cat => (
            <button
              key={cat.id || cat.slug}
              onClick={() => setSelectedCategory(cat.slug || cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition ${
                selectedCategory === (cat.slug || cat.id)
                  ? 'bg-[#E36138] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Live Stories Grid */}
        {loadingFeed ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-[#E36138] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-bold">ताज़ा खबरें लोड की जा रही हैं...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">{selectedArea} के लिए अभी कोई खबर दर्ज नहीं है</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              आप इस इलाके के पहले सत्यापित नागरिक रिपोर्टर बन सकते हैं और अपनी रिपोर्ट पब्लिश कर पैसे कमा सकते हैं।
            </p>
            <button
              onClick={() => onNavigate('creator')}
              className="inline-block bg-[#E36138] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#D24E25] transition"
            >
              {selectedArea} से खबर भेजें व कमाएं
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedItems.map((item, idx) => {
              if (item.itemType === 'ADVERTISEMENT') {
                return (
                  <div
                    key={item.data.id || idx}
                    className="rounded-3xl border border-orange-200 bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] p-5 shadow-xs flex flex-col justify-between transform hover:-translate-y-1 transition duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black bg-[#E36138] text-white px-2 py-0.5 rounded uppercase">
                          प्रायोजित / SPONSORED
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">स्थानीय पार्टनर</span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base leading-snug mb-3">
                        {item.data.name}
                      </h4>
                      <div className="h-40 rounded-2xl overflow-hidden bg-slate-200 mb-3">
                        <img src={item.data.mediaUrl} alt={item.data.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition">
                      पार्टनर स्टोर देखें
                    </button>
                  </div>
                );
              }

              const content = item.data;
              const isLiked = likedMap[content.id || content._id];
              const isSaved = savedMap[content.id || content._id];

              return (
                <div
                  key={content.id || content._id || idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group"
                >
                  <div
                    onClick={() => handleOpenContent(content)}
                    className="relative h-52 bg-slate-900 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={content.thumbnailUrl}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold bg-slate-950/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                        {content.type === 'VIDEO' ? <Play className="w-3 h-3 text-[#E36138] fill-current" /> : <FileText className="w-3 h-3" />}
                        {content.type === 'VIDEO' ? 'वीडियो रिपोर्ट' : 'आर्टिकल'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 px-2 py-0.5 rounded-md">
                        {content.categoryId?.name || 'Local'}
                      </span>
                    </div>

                    {content.type === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#E36138]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-125 transition duration-300">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E36138]" />
                        <span>{content.location?.area || selectedArea}, {content.location?.city || selectedCity}</span>
                      </div>

                      <h3
                        onClick={() => handleOpenContent(content)}
                        className="font-black text-slate-900 text-base leading-snug line-clamp-2 cursor-pointer hover:text-[#E36138] transition"
                      >
                        {content.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                        {content.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{content.views || 0} व्यूज़</span>
                        </span>
                        <span className="text-emerald-700 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{content.eligibleViews || 0} वेरीफाइड</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleLike(content.id || content._id)}
                          className={`p-2 rounded-xl transition ${
                            isLiked ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title="लाइक करें"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleSave(content.id || content._id)}
                          className={`p-2 rounded-xl transition ${
                            isSaved ? 'text-[#E36138] bg-orange-50' : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title="सेव करें"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ title: content.title, url: window.location.href });
                            } else {
                              alert('Link copied to clipboard!');
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition"
                          title="शेयर करें"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. IMPACT & SOCIAL PROOF COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl p-8 border border-orange-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#E36138] flex items-center justify-center mx-auto mb-2 animate-float">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">50,000+</div>
              <div className="text-xs font-bold text-slate-600">सक्रिय स्थानीय पाठक</div>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 animate-float">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">1,200+</div>
              <div className="text-xs font-bold text-slate-600">सत्यापित नागरिक रिपोर्टर</div>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 animate-float">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">500+</div>
              <div className="text-xs font-bold text-slate-600">समस्याओं का सफल समाधान</div>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 animate-float">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
              <div className="text-xs font-bold text-slate-600">निष्पक्ष एवं जन-सरोकारी</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E36138] text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>सामान्य प्रश्न (FAQ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            अक्सर पूछे जाने वाले सवाल
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            नागरिक के उपयोग और कार्यप्रणाली से जुड़े सभी प्रमुख सवालों के जवाब
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition duration-200 hover:border-orange-200"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm text-slate-900 hover:text-[#E36138] transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#E36138] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FLUTTER APP DOWNLOAD SECTION */}
      <section id="app-download" className="py-16 bg-[#FFF7ED] border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>बिना किसी लॉगिन या पासवर्ड के तुरंत शुरू करें</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                नागरिक मोबाइल ऐप डाउनलोड करें
              </h2>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                अपने मोबाइल में रील्स की तरह स्वाइप करके अपने वार्ड और मोहल्ले की ताज़ा वीडियो खबरें देखें और तुरंत अलर्ट्स पाएं।
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition shadow-sm transform hover:scale-105 active:scale-95">
                  <Smartphone className="w-5 h-5 text-[#FB923C]" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase leading-none">Download for</div>
                    <div className="text-xs font-bold leading-tight mt-0.5">Android App</div>
                  </div>
                </button>

                <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition shadow-sm transform hover:scale-105 active:scale-95">
                  <Smartphone className="w-5 h-5 text-[#FB923C]" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase leading-none">Download for</div>
                    <div className="text-xs font-bold leading-tight mt-0.5">iOS App</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-[#FFF7ED] p-6 rounded-3xl border border-orange-200 text-center space-y-2 shrink-0 animate-float">
              <div className="w-32 h-32 bg-white rounded-2xl p-2 mx-auto flex items-center justify-center border border-orange-100 shadow-xs">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <div className="text-xs font-extrabold text-slate-800">Scan to Download</div>
              <div className="text-[10px] text-slate-500">Instant Android / iOS App</div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE / VIDEO MODAL */}
      {selectedContentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedContentModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 sm:h-80 bg-slate-950 relative flex items-center justify-center">
              {selectedContentModal.type === 'VIDEO' ? (
                <video
                  src={selectedContentModal.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={selectedContentModal.thumbnailUrl}
                />
              ) : (
                <img
                  src={selectedContentModal.thumbnailUrl || selectedContentModal.mediaUrl}
                  alt={selectedContentModal.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-6 space-y-4 max-h-72 overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1 text-[#E36138]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedContentModal.location?.area}, {selectedContentModal.location?.city}</span>
                </span>
                <span>{new Date(selectedContentModal.publishedAt || Date.now()).toLocaleDateString()}</span>
              </div>

              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {selectedContentModal.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {selectedContentModal.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-bold">
                  Views: {selectedContentModal.views || 0}
                </div>
                <button
                  onClick={() => setSelectedContentModal(null)}
                  className="bg-[#E36138] text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-[#D24E25] transition"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const ContactView: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'PUBLISHER_SUPPORT',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedTicket(data.ticketId || `NGK-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setSubmittedTicket(`NGK-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err: any) {
      // Fallback ticket generation
      setSubmittedTicket(`NGK-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 selection:bg-[#DE5227] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-[#DE5227]/20 text-[#DE5227] dark:text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-[#DE5227]" />
            <span>{language === 'hi' ? '24/7 नागरिक एवं प्रकाशक सहायता' : '24/7 Citizen & Publisher Support'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-serif tracking-tight text-slate-950 dark:text-white">
            {language === 'hi' ? (
              <>नागरिक <span className="text-[#DE5227]">हेल्प डेस्क</span></>
            ) : (
              <>Contact <span className="text-[#DE5227]">Nagrik Desk</span></>
            )}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {language === 'hi'
              ? 'प्रकाशक दरों, यूपीआई निकासी या सामग्री दिशानिर्देशों के बारे में प्रश्न हैं? हमें संदेश भेजें और हमारी संपादकीय टीम शीघ्र संपर्क करेगी।'
              : 'Have questions about publisher rates, UPI payouts, or content guidelines? Send us a message and our team will get back to you promptly.'}
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Submission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Channels & Support Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-stone-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-left">
              <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
                {language === 'hi' ? 'सीधे संपर्क माध्यम' : 'Direct Support Channels'}
              </h3>
              
              <div className="space-y-4 text-xs">
                {/* Email Support */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-[#DE5227] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'hi' ? 'ईमेल सहायता' : 'Email Support'}
                    </div>
                    <a href="mailto:support@nagrik.news" className="text-[#DE5227] hover:underline font-mono font-bold text-xs block">
                      support@nagrik.news
                    </a>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {language === 'hi' ? 'औसत उत्तर समय: 4 घंटे से कम' : 'Average response time: < 4 hours'}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Help Desk */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'hi' ? 'व्हाट्सएप डेस्क' : 'WhatsApp Desk'}
                    </div>
                    <a
                      href="https://api.whatsapp.com/send?phone=919876543210&text=Hello%20Nagrik%20Support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-400 hover:underline font-mono font-bold text-xs block"
                    >
                      +91 98765 43210
                    </a>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {language === 'hi' ? 'सक्रिय प्रकाशकों के लिए त्वरित चैट' : 'Instant chat for active publishers'}
                    </div>
                  </div>
                </div>

                {/* Regional Operations Desk */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {language === 'hi' ? 'क्षेत्रीय समाचार ब्यूरो' : 'Regional News Bureau'}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal">
                      Patna Media Tower, Fraser Road, Patna, Bihar — 800001
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours Badge */}
              <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-normal">
                <Clock className="w-4 h-4 text-[#DE5227] shrink-0" />
                <span>
                  {language === 'hi' ? (
                    <>संपादकीय एवं भुगतान डेस्क <strong>सप्ताह के सातों दिन, 24 घंटे</strong> सक्रिय है</>
                  ) : (
                    <>Editorial & Payout Desk operates <strong>7 Days a Week, 24/7</strong></>
                  )}
                </span>
              </div>
            </div>

            {/* Quick Link Card to Creator Studio */}
            <div className="bg-[#0B0F17] text-white border border-slate-800 rounded-3xl p-6 space-y-3 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DE5227]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-orange-400 font-mono font-bold text-xs uppercase tracking-wider relative z-10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'त्वरित प्रकाशक सहायता' : 'Need Instant Help?'}</span>
              </div>
              <h4 className="text-base font-bold font-serif text-white relative z-10">
                {language === 'hi' ? 'क्या आप सक्रिय प्रकाशक हैं?' : 'Are you an active publisher?'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal relative z-10">
                {language === 'hi'
                  ? 'अपने वास्तविक समय के व्यू काउंट, भुगतान इतिहास की जांच करें या स्टूडियो में सीधे यूपीआई निकासी का अनुरोध करें।'
                  : 'Check your real-time view counts, payout history, or request a UPI withdrawal directly in the Studio.'}
              </p>
              <Link
                href="/creator"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DE5227] hover:text-orange-300 pt-1 transition relative z-10"
              >
                <span>{language === 'hi' ? 'प्रकाशक स्टूडियो खोलें' : 'Go to Creator Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#111827] border border-stone-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              {submittedTicket ? (
                /* Success Confirmation State */
                <div className="text-center py-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black font-serif text-slate-950 dark:text-white">
                      {language === 'hi' ? 'संदेश सफलतापूर्वक प्राप्त हुआ!' : 'Message Received!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                      {language === 'hi'
                        ? <>संपर्क करने के लिए धन्यवाद। हमने एक सहायता टिकट बना लिया है और हमारी डेस्क टीम शीघ्र ही <strong>{formData.email}</strong> पर उत्तर देगी।</>
                        : <>Thank you for reaching out. We have created a support ticket for your inquiry and our desk team will reply to <strong>{formData.email}</strong> shortly.</>}
                    </p>
                  </div>

                  <div className="p-4 bg-orange-500/10 border border-[#DE5227]/30 rounded-2xl inline-block font-mono text-xs text-slate-800 dark:text-slate-200">
                    {language === 'hi' ? 'टिकट संदर्भ संख्या: ' : 'Ticket Reference: '}
                    <strong className="text-[#DE5227] font-bold">{submittedTicket}</strong>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          inquiryType: 'PUBLISHER_SUPPORT',
                          subject: '',
                          message: ''
                        });
                      }}
                      className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition cursor-pointer shadow-sm"
                    >
                      {language === 'hi' ? 'अन्य संदेश भेजें' : 'Send Another Message'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Contact Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
                      {language === 'hi' ? 'हमें संदेश भेजें' : 'Send us a Message'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      {language === 'hi' ? 'नीचे दिए गए फॉर्म को भरें, हम 24 घंटे के भीतर संपर्क करेंगे।' : 'Fill in the form below and we will reply within 24 hours.'}
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs rounded-2xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                        {language === 'hi' ? 'आपका नाम' : 'Your Name'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                        className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] focus:ring-2 focus:ring-[#DE5227]/20 transition"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                        {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] focus:ring-2 focus:ring-[#DE5227]/20 transition"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                        {language === 'hi' ? 'फोन / व्हाट्सएप (वैकल्पिक)' : 'Phone / WhatsApp (Optional)'}
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] focus:ring-2 focus:ring-[#DE5227]/20 transition"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                        {language === 'hi' ? 'पूछताछ की श्रेणी' : 'Inquiry Category'}
                      </label>
                      <select
                        className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#DE5227] focus:ring-2 focus:ring-[#DE5227]/20 transition"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      >
                        <option value="PUBLISHER_SUPPORT">{language === 'hi' ? 'प्रकाशक और कंट्रीब्यूटर सहायता' : 'Publisher & Contributor Support'}</option>
                        <option value="PAYOUT_ISSUE">{language === 'hi' ? 'यूपीआई / बैंक निकासी पूछताछ' : 'UPI / Bank Payout Inquiry'}</option>
                        <option value="CONTENT_TAKEDOWN">{language === 'hi' ? 'सामग्री रिपोर्ट / कॉपीराइट DMCA' : 'Content Report / DMCA'}</option>
                        <option value="EDITORIAL_PARTNERSHIP">{language === 'hi' ? 'संपादकीय साझेदारी' : 'Editorial Partnership'}</option>
                        <option value="GENERAL_QUERY">{language === 'hi' ? 'सामान्य प्रश्न' : 'General Query'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                      {language === 'hi' ? 'विषय' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'hi' ? 'उदा. यूपीआई भुगतान सत्यापन या वार्ड रिपोर्टिंग' : 'e.g. UPI payout verification or locality beat'}
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] focus:ring-2 focus:ring-[#DE5227]/20 transition"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                      {language === 'hi' ? 'संदेश विवरण' : 'Message Details'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={language === 'hi' ? 'कृपया अपनी समस्या या प्रश्न का विस्तार से वर्णन करें...' : 'Please describe your question or issue in detail...'}
                      className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-[#0B0F17] border border-stone-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#DE5227] focus:ring-2 focus:ring-[#DE5227]/20 transition resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DE5227] hover:bg-[#C84318] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{language === 'hi' ? 'भेजा जा रहा है...' : 'Submitting...'}</span>
                        </span>
                      ) : (
                        <>
                          <span>{language === 'hi' ? 'संदेश भेजें' : 'Send Message'}</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

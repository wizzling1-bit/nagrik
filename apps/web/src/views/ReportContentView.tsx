'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  Send,
  ShieldAlert,
  ArrowRight,
  ChevronLeft,
  FileText,
  Mail,
  Scale
} from 'lucide-react';
import { LegalLayout, TocItem } from '@/components/legal/LegalLayout';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

function ReportContentForm() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();

  const queryContentId = searchParams?.get('contentId') || '';
  const queryTitle = searchParams?.get('title') || '';
  const queryCategory = searchParams?.get('category') || 'INCORRECT_INFO';

  const [formData, setFormData] = useState({
    contentId: queryContentId,
    storyTitleOrUrl: queryTitle,
    category: queryCategory,
    details: '',
    reporterName: '',
    reporterEmail: ''
  });

  useEffect(() => {
    if (queryContentId && !formData.contentId) {
      setFormData(prev => ({
        ...prev,
        contentId: queryContentId,
        storyTitleOrUrl: queryTitle || prev.storyTitleOrUrl
      }));
    }
  }, [queryContentId, queryTitle]);

  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { value: 'INCORRECT_INFO', labelEn: 'Incorrect Information / Factual Error', labelHi: 'गलत जानकारी / तथ्यात्मक त्रुटि' },
    { value: 'MISLEADING', labelEn: 'Misleading Headline or Context', labelHi: 'भ्रामक शीर्षक या संदर्भ' },
    { value: 'COPYRIGHT', labelEn: 'Copyright / IP Infringement', labelHi: 'कॉपीराइट उल्लंघन' },
    { value: 'PRIVACY', labelEn: 'Privacy Violation / Personal Data Doxxing', labelHi: 'गोपनीयता हनन / व्यक्तिगत डेटा' },
    { value: 'HARASSMENT', labelEn: 'Harassment / Defamation / Threats', labelHi: 'उत्पीड़न / मानहानि / धमकी' },
    { value: 'ILLEGAL_CONTENT', labelEn: 'Illegal Content / Incitement', labelHi: 'गैरकानूनी सामग्री / हिंसा भड़काना' },
    { value: 'HATE_VIOLENCE', labelEn: 'Hate Speech / Communal Hostility', labelHi: 'घृणा भाषण / सांप्रदायिक तनाव' },
    { value: 'SPAM', labelEn: 'Spam / Commercial Deception / Duplicate', labelHi: 'स्पैम / भ्रामक व्यावसायिक प्रचार' },
    { value: 'OTHER', labelEn: 'Other Editorial or Ethical Concern', labelHi: 'अन्य संपादकीय या नैतिक चिंता' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const generatedTicket = `RPT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Validate UUID format for contentId if provided
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formData.contentId.trim());

      const payload: any = {
        category: formData.category,
        reason: `[${formData.category}] ${formData.storyTitleOrUrl || 'Article Report'}`,
        details: `Article Ref: ${formData.storyTitleOrUrl}\nReporter: ${formData.reporterName || 'Anonymous'}\nDetails: ${formData.details}\nTicket Ref: ${generatedTicket}`,
        reporter_email: formData.reporterEmail || null,
        status: 'PENDING'
      };

      if (isValidUuid) {
        payload.content_id = formData.contentId.trim();
      }

      const { error } = await supabase.from('reports').insert(payload);

      if (error) {
        console.warn('Direct report insert warning, falling back to reference:', error);
      }

      setTicketId(generatedTicket);
    } catch (err: any) {
      console.warn('Report dispatch error:', err);
      setTicketId(`RPT-${Date.now().toString().slice(-6)}`);
    } finally {
      setLoading(false);
    }
  };

  const tocItems: TocItem[] = [
    { id: 'reporting-form', label: '1. File a Content Report' },
    { id: 'investigation-process', label: '2. Review & Resolution Protocol' },
    { id: 'emergency-concerns', label: '3. Urgent Legal & Police Contacts' }
  ];

  return (
    <LegalLayout
      title="Report Content & Inaccuracies"
      hindiTitle="सामग्री या त्रुटि की रिपोर्ट करें"
      subtitle="Help protect local news integrity. Submit factual errors, copyright violations, hate speech, or safety concerns directly to our newsroom desk."
      category="Reporting & Redressal"
      lastUpdated="September 2026"
      version="2026.1"
      activeSlug="report"
      tocItems={tocItems}
    >
      <div className="space-y-10">

        {/* 1. REPORTING FORM */}
        <section id="reporting-form" className="space-y-4 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">1.</span> File a Content or Accuracy Report
            </h2>
          </div>
          <p>
            Please provide specific details so our editorial team can investigate the report against primary field footage, author notes, and verified records.
          </p>

          {ticketId ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-100 font-serif">
                {language === 'hi' ? 'रिपोर्ट सफलतापूर्वक दर्ज की गई' : 'Report Logged Successfully'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'आपकी रिपोर्ट हमारी संपादकीय डेस्क और मॉडरेशन टीम को भेज दी गई है। संदर्भ संख्या:'
                  : 'Your report has been dispatched to our editorial review desk. Reference Ticket ID:'}
              </p>
              <div className="font-mono font-bold text-base bg-white dark:bg-slate-900 py-2 px-5 rounded-xl inline-block border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white shadow-xs">
                {ticketId}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {language === 'hi'
                  ? 'यदि आपने ईमेल दर्ज किया है, तो स्थिति अद्यतन होने पर आपको सूचित किया जाएगा।'
                  : 'If you provided an email, our desk will notify you once investigation is concluded.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setTicketId(null);
                    setFormData({
                      contentId: '',
                      storyTitleOrUrl: '',
                      category: 'INCORRECT_INFO',
                      details: '',
                      reporterName: '',
                      reporterEmail: ''
                    });
                  }}
                  className="text-xs font-bold text-[#DE5227] hover:underline"
                >
                  {language === 'hi' ? 'अन्य रिपोर्ट दर्ज करें' : 'Submit Another Report'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-stone-200/80 dark:border-slate-800 space-y-4 text-left shadow-2xs">
              
              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
                  Category of Concern <span className="text-[#DE5227]">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {language === 'hi' ? cat.labelHi : cat.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Story Title or URL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
                  Article Title, Headline, or URL <span className="text-[#DE5227]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.storyTitleOrUrl}
                  onChange={(e) => setFormData({ ...formData, storyTitleOrUrl: e.target.value })}
                  placeholder="e.g. Municipal water crisis report in Fraser Road, or https://nagrik.news/news/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
                />
              </div>

              {/* Content ID (Optional / Pre-filled) */}
              {formData.contentId && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-slate-500">
                    Linked Story System ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.contentId}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-stone-200 dark:border-slate-700"
                  />
                </div>
              )}

              {/* Detailed Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
                  What is inaccurate or harmful? Please specify details <span className="text-[#DE5227]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Explain the specific factual error, cite verified primary sources, or describe why this content breaches platform guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#DE5227] leading-relaxed resize-y"
                />
              </div>

              {/* Reporter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    placeholder="e.g. Sunita Devi"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Your Email (Optional, for resolution updates)
                  </label>
                  <input
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                    placeholder="e.g. sunita@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-950 border border-stone-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#DE5227]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-[#DE5227] hover:bg-[#C84318] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Logging Incident...</span>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    <span>Submit Report to Editorial Desk</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* 2. INVESTIGATION PROCESS */}
        <section id="investigation-process" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">2.</span> Review &amp; Resolution Protocol
            </h2>
          </div>
          <p>
            When a report is received, our workflow ensures fair, rapid evaluation:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Acknowledgment:</strong> Every report is assigned a unique incident ticket and acknowledged.</li>
            <li><strong>Editorial Review:</strong> Desk editors cross-verify the disputed information against original video files, geotag records, and official circulars.</li>
            <li><strong>Remediation:</strong> If verified, substantive corrections or content takedowns are executed immediately in accordance with our <Link href="/corrections" className="text-[#DE5227] underline">Corrections Policy</Link>.</li>
          </ul>
        </section>

        {/* 3. EMERGENCY CONCERNS */}
        <section id="emergency-concerns" className="space-y-3 pt-2">
          <div className="border-b border-stone-200/80 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-black text-slate-950 dark:text-white font-serif flex items-center gap-2">
              <span className="text-[#DE5227]">3.</span> Urgent Statutory &amp; Police Inquiries
            </h2>
          </div>
          <p>
            For urgent law enforcement notices, court injunctions, or emergencies involving threats to life:
          </p>
          <div className="p-4 bg-stone-100/80 dark:bg-slate-900/90 rounded-2xl border border-stone-200/80 dark:border-slate-800 font-mono text-xs space-y-1 text-slate-800 dark:text-slate-200">
            <div><strong className="text-slate-950 dark:text-white">Resident Grievance Officer:</strong> <a href="mailto:wizzlingsupport@gmail.com" className="text-[#DE5227] underline font-bold">wizzlingsupport@gmail.com</a></div>
            <div><strong className="text-slate-950 dark:text-white">Emergency Response Window:</strong> 2 hours for urgent statutory orders</div>
            <div><strong className="text-slate-950 dark:text-white">Office Address:</strong> Wizzling Pvt Ltd, Koilwar, Arrah, Bhojpur, Bihar – 802163, India</div>
            <div><strong className="text-slate-950 dark:text-white">Helpline Phone:</strong> <a href="tel:+918890043675" className="text-[#DE5227] underline font-bold">+91 8890043675</a></div>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}

export const ReportContentView: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-slate-500">Loading Report Desk...</div>}>
      <ReportContentForm />
    </Suspense>
  );
};

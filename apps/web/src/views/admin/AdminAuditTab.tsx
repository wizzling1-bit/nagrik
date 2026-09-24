import React, { useState } from 'react';
import { History } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

interface AdminAuditTabProps {
  auditLogs: any[];
}

export const AdminAuditTab: React.FC<AdminAuditTabProps> = ({ auditLogs }) => {
  const [auditFilterTab, setAuditFilterTab] = useState<'ALL' | 'PAYOUT' | 'CONTENT' | 'CREATOR' | 'ADS' | 'SETTINGS' | 'SECURITY'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleFilterTabChange = (key: any) => {
    setAuditFilterTab(key);
    setCurrentPage(1);
  };

  const filteredLogs = auditLogs.filter((log: any) => {
    if (auditFilterTab === 'ALL') return true;
    return log.category === auditFilterTab || log.action?.includes(auditFilterTab);
  });

  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white dark:bg-[#101522] border border-[#DCD1BF] dark:border-slate-800 p-6 rounded-3xl space-y-5 animate-in fade-in duration-200 shadow-[0_4px_20px_-2px_rgba(30,24,16,0.08),0_1px_3px_rgba(30,24,16,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
            <History className="w-4 h-4 text-brand-500" />
            <span>Security & Operational Audit Logs</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tamper-evident record of administrative and financial transactions</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { key: 'ALL', label: 'All Logs', count: auditLogs.length },
            { key: 'PAYOUT', label: 'Payouts', count: auditLogs.filter(l => l.category === 'PAYOUT' || l.action?.includes('PAYOUT')).length },
            { key: 'CONTENT', label: 'Moderation', count: auditLogs.filter(l => l.category === 'CONTENT' || l.action?.includes('CONTENT')).length },
            { key: 'CREATOR', label: 'Creators', count: auditLogs.filter(l => l.category === 'CREATOR' || l.action?.includes('CREATOR')).length },
            { key: 'ADS', label: 'Ads', count: auditLogs.filter(l => l.category === 'ADS' || l.action?.includes('AD')).length },
            { key: 'SETTINGS', label: 'Economics', count: auditLogs.filter(l => l.category === 'SETTINGS' || l.action?.includes('SETTINGS')).length },
            { key: 'SECURITY', label: 'Security', count: auditLogs.filter(l => l.category === 'SECURITY' || l.action?.includes('SECURITY')).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterTabChange(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                auditFilterTab === tab.key
                  ? 'bg-brand-500 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                auditFilterTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Audit Event Stream */}
      {filteredLogs.length === 0 ? (
        <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-2">
          <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Audit Logs Recorded</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Administrative and financial audit events will appear here as transactions take place.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedLogs.map((log: any, idx: number) => (
            <div
              key={log.id || idx}
              className="p-4 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#F4EFE6] dark:bg-[#0B0F17] border border-[#DCD1BF] dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  {(currentPage - 1) * pageSize + idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        log.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{log.title || log.action}</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {log.description || (typeof log.details === 'object' && log.details !== null ? (log.details.description || log.details.reason || log.details.message || JSON.stringify(log.details)) : log.details) || log.entity_type || log.entity || 'System event'}
                  </p>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-2 pt-0.5">
                    <span>Actor: {log.actor || log.actorEmail || (log.user_id ? `User ${String(log.user_id).slice(0, 8)}` : 'System Admin')}</span>
                    <span>•</span>
                    <span>IP: {log.ip_address || log.ip || '127.0.0.1'}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0 self-end sm:self-center">
                {log.created_at ? new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : (log.time || '-')}
              </div>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

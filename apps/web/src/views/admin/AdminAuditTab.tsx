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
    <div className="bg-[#FAF9F5] border border-[#E3E0D4] p-6 rounded-3xl space-y-5 animate-in fade-in duration-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E0D4] pb-4">
        <div>
          <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
            <History className="w-4 h-4 text-[#E36138]" />
            <span>Security & Operational Audit Logs</span>
          </h3>
          <p className="text-xs text-stone-500">Tamper-evident record of administrative and financial transactions</p>
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
                  ? 'bg-[#E36138] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-[#DBD7C9]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                auditFilterTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#EFECE6] text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Audit Event Stream */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white border border-[#E3E0D4] rounded-2xl p-12 text-center space-y-2">
          <History className="w-8 h-8 text-stone-300 mx-auto" />
          <h4 className="font-bold text-stone-900 text-sm">No Audit Logs Recorded</h4>
          <p className="text-xs text-stone-500">Administrative and financial audit events will appear here as transactions take place.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedLogs.map((log: any, idx: number) => (
            <div
              key={log.id || idx}
              className="p-4 bg-white border border-[#E3E0D4] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-stone-400 transition shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#E3E0D4] text-stone-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                  {(currentPage - 1) * pageSize + idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        log.badgeColor || 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-bold text-stone-900 text-xs">{log.title || log.action}</span>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed">{log.description || log.entity || '-'}</p>
                  <div className="text-[10px] text-stone-400 font-mono flex items-center gap-2 pt-0.5">
                    <span>Actor: {log.actor || log.actorEmail || 'System'}</span>
                    <span>•</span>
                    <span>IP: {log.ip || '127.0.0.1'}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-stone-400 shrink-0 self-end sm:self-center">
                {log.time || new Date(log.created_at || log.timestamp || Date.now()).toLocaleTimeString()}
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

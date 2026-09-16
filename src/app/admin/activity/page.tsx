'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminActivityLogItem } from '@/lib/adminStore';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AdminActivityLogItem[]>([]);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setLogs(adminEngine.getActivityLogs());
  }, []);

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.adminName.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Timestamp,Admin,Role,Action,Details"].concat(
          logs.map(l => `"${l.timestamp}","${l.adminName}","${l.adminRole}","${l.action}","${l.details.replace(/"/g, '""')}"`)
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roshspark_admin_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit log exported to CSV successfully');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981]"></span>
            Administrative Activity Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable, compliance-grade operational trail recording all live scoring edits, fixture changes, ticket revisions, and administrative logins.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border border-slate-700"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV Log
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search audit actions, staff, details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filtered.length}</span> recorded log entries
        </div>
      </div>

      {/* Activity Timeline / Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Administrator</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Event Code</th>
              <th className="py-3 px-4">Operational Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500 font-sans">
                  No activity matching your search.
                </td>
              </tr>
            ) : (
              filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 text-white font-sans font-bold whitespace-nowrap">
                    {log.adminName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      {log.adminRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

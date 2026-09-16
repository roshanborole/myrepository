'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminNotification } from '@/lib/adminStore';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'ALL_FANS' | 'TICKET_HOLDERS_ONLY' | 'VIP_PAVILION_ONLY'>('ALL_FANS');
  const [category, setCategory] = useState<'MATCH_UPDATE' | 'WEATHER_ALERT' | 'SECURITY' | 'TICKET_OFFER'>('MATCH_UPDATE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setNotifications(adminEngine.getNotifications());
  }, []);

  const refreshList = () => {
    setNotifications([...adminEngine.getNotifications()]);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    adminEngine.broadcastNotification(title, message, audience, category);
    refreshList();
    setTitle('');
    setMessage('');
    showToast('Push notification broadcasted to active fans!');
  };

  const categoryBadge = (cat: AdminNotification['category']) => {
    switch (cat) {
      case 'MATCH_UPDATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Match Update</span>;
      case 'WEATHER_ALERT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Weather Alert</span>;
      case 'SECURITY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Security Alert</span>;
      case 'TICKET_OFFER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ticket Offer</span>;
    }
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
            Fan Push Notifications & Stadium Announcements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch urgent match updates, gate advisories, weather announcements, and alerts directly to registered fan devices.
          </p>
        </div>
      </div>

      {/* Dual Column: Broadcast Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Compose New Dispatch
          </h2>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Notification Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Turnstiles Now Open at RoshSpark Stadium Gate 3"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="MATCH_UPDATE">Match Update</option>
                  <option value="WEATHER_ALERT">Weather Alert</option>
                  <option value="SECURITY">Security Advisory</option>
                  <option value="TICKET_OFFER">Ticket Offer</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target Audience</label>
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="ALL_FANS">All Registered Spectators</option>
                  <option value="TICKET_HOLDERS_ONLY">Today's Match Ticket Holders</option>
                  <option value="VIP_PAVILION_ONLY">VIP Pavilion Club Members Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Message Body</label>
              <textarea
                required
                rows={3}
                placeholder="Type the message that will pop up on spectator screens..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send Broadcast Alert
              </button>
            </div>
          </form>
        </div>

        {/* Live Device Preview (1 col) */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile Screen Preview
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Simulated lockscreen banner appearance</p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  ROSHSPARK STADIUM APP
                </span>
                <span>now</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {title || 'Official Match Announcement'}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {message || 'Your broadcast message preview will appear here in real time as you compose the announcement.'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800">
            Delivered via RoshSpark push gateway protocol. Encrypted end-to-end.
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Broadcast Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Audience</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Delivery Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {notifications.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.message}</div>
                </td>
                <td className="py-3 px-4">{categoryBadge(item.category)}</td>
                <td className="py-3 px-4">
                  <span className="text-slate-300 font-medium">
                    {item.audience.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{item.timestamp}</td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Delivered (100%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

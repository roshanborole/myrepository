'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminEngine, AdminMatchItem } from '@/lib/adminStore';

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<AdminMatchItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'>('ALL');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating/editing match
  const [formData, setFormData] = useState({
    title: '',
    series: 'Border-Gavaskar Trophy 2026',
    format: 'T20' as 'T20' | 'ODI' | 'TEST',
    team1: 'India',
    team1Short: 'IND',
    team2: 'Australia',
    team2Short: 'AUS',
    date: '2026-09-12',
    time: '19:00 IST',
    status: 'UPCOMING' as 'LIVE' | 'UPCOMING' | 'COMPLETED' | 'PAUSED' | 'CANCELLED',
    ticketStatus: 'AVAILABLE' as 'AVAILABLE' | 'SELLING_FAST' | 'SOLD_OUT' | 'UNAVAILABLE',
    pitchType: 'Hard, fast bounce with good carry'
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setMatches(adminEngine.getMatches());
  }, []);

  const refreshMatches = () => {
    setMatches([...adminEngine.getMatches()]);
  };

  const filteredMatches = matches.filter(m => {
    const matchFilter = filter === 'ALL' || m.status === filter;
    const matchSearch =
      m.team1.toLowerCase().includes(search.toLowerCase()) ||
      m.team2.toLowerCase().includes(search.toLowerCase()) ||
      (m.series || m.competition || '').toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleStatusChange = (id: string, newStatus: AdminMatchItem['status']) => {
    adminEngine.updateMatchStatus(id, newStatus);
    refreshMatches();
    showToast(`Match status updated to ${newStatus}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete match "${name}"?`)) {
      adminEngine.deleteMatch(id);
      refreshMatches();
      showToast(`Match deleted successfully`);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `m-${Date.now()}`;
    const newMatch: AdminMatchItem = {
      id: newId,
      title: `${formData.team1} vs ${formData.team2}`,
      series: formData.series,
      format: formData.format,
      team1: formData.team1,
      team1Short: formData.team1Short,
      team2: formData.team2,
      team2Short: formData.team2Short,
      date: formData.date,
      time: formData.time,
      venue: 'RoshSpark Cricket Stadium, Main Bowl',
      status: formData.status,
      ticketStatus: formData.ticketStatus
    };
    adminEngine.addMatch(newMatch);
    refreshMatches();
    setShowCreateModal(false);
    showToast(`Match "${newMatch.title}" scheduled successfully!`);
  };

  const statusBadge = (st: AdminMatchItem['status']) => {
    switch (st) {
      case 'LIVE':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30"><span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>LIVE NOW</span>;
      case 'UPCOMING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">UPCOMING</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-700">COMPLETED</span>;
      case 'PAUSED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">RAIN PAUSED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">CANCELLED</span>;
    }
  };

  const ticketBadge = (t: AdminMatchItem['ticketStatus']) => {
    switch (t) {
      case 'AVAILABLE':
        return <span className="text-xs text-emerald-400 font-medium">Available</span>;
      case 'SELLING_FAST':
        return <span className="text-xs text-amber-400 font-medium">Selling Fast</span>;
      case 'SOLD_OUT':
        return <span className="text-xs text-rose-400 font-medium">Sold Out</span>;
      case 'UNAVAILABLE':
        return <span className="text-xs text-slate-400 font-medium">Not on sale</span>;
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

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981]"></span>
            Match Management Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure fixtures, schedule encounters, initiate live scoring, and manage RoshSpark Cricket Stadium match states.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/matches/m-live-01/live"
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Open Live Scoring Console
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Schedule New Match
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Matches</div>
          <div className="text-2xl font-black text-white mt-1">{matches.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20">
          <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            Live Matches
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {matches.filter(m => m.status === 'LIVE').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium">Upcoming Fixtures</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {matches.filter(m => m.status === 'UPCOMING').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Completed & Archives</div>
          <div className="text-2xl font-black text-slate-300 mt-1">
            {matches.filter(m => m.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      {/* Controls: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'LIVE', 'UPCOMING', 'COMPLETED', 'PAUSED', 'CANCELLED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab === 'ALL' ? 'All Fixtures' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search teams, tournament..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Matches Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Match Details</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">Schedule (IST)</th>
              <th className="py-3 px-4">Venue</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Ticket Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">
                  No matches match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredMatches.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {m.team1} vs {m.team2}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.series}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] font-bold text-slate-300">
                      {m.format}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200 font-medium">{m.date}</div>
                    <div className="text-[11px] text-slate-400">{m.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300">{m.venue}</span>
                  </td>
                  <td className="py-3 px-4">{statusBadge(m.status)}</td>
                  <td className="py-3 px-4">{ticketBadge(m.ticketStatus)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {m.status === 'LIVE' ? (
                        <Link
                          href={`/admin/matches/${m.id}/live`}
                          className="px-2.5 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 rounded-lg text-xs font-bold transition-all"
                        >
                          Score Console
                        </Link>
                      ) : m.status === 'UPCOMING' ? (
                        <button
                          onClick={() => handleStatusChange(m.id, 'LIVE')}
                          className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-xs font-semibold"
                        >
                          Start Match
                        </button>
                      ) : null}

                      <div className="relative group/menu inline-block text-left">
                        <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        <div className="hidden group-hover/menu:block absolute right-0 top-6 w-36 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-20 py-1 text-xs">
                          {m.status === 'LIVE' && (
                            <button
                              onClick={() => handleStatusChange(m.id, 'PAUSED')}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-amber-300"
                            >
                              Pause Match
                            </button>
                          )}
                          {m.status === 'PAUSED' && (
                            <button
                              onClick={() => handleStatusChange(m.id, 'LIVE')}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-emerald-400"
                            >
                              Resume Match
                            </button>
                          )}
                          {m.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(m.id, 'COMPLETED')}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300"
                            >
                              Mark Completed
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(m.id, m.title || `${m.team1} vs ${m.team2}`)}
                            className="w-full text-left px-3 py-1.5 hover:bg-rose-500/20 text-rose-400"
                          >
                            Delete Match
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Match Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Schedule Match at RoshSpark Stadium
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Team 1 (Home)</label>
                  <input
                    type="text"
                    required
                    value={formData.team1}
                    onChange={e => setFormData({ ...formData, team1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Team 1 Short</label>
                  <input
                    type="text"
                    required
                    value={formData.team1Short}
                    onChange={e => setFormData({ ...formData, team1Short: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Team 2 (Away)</label>
                  <input
                    type="text"
                    required
                    value={formData.team2}
                    onChange={e => setFormData({ ...formData, team2: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Team 2 Short</label>
                  <input
                    type="text"
                    required
                    value={formData.team2Short}
                    onChange={e => setFormData({ ...formData, team2Short: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Series / Tournament</label>
                  <input
                    type="text"
                    required
                    value={formData.series}
                    onChange={e => setFormData({ ...formData, series: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Match Format</label>
                  <select
                    value={formData.format}
                    onChange={e => setFormData({ ...formData, format: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="T20">T20 (20 Overs)</option>
                    <option value="ODI">ODI (50 Overs)</option>
                    <option value="TEST">TEST (5 Days)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Match Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Start Time (IST)</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE (Start immediately)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Ticket Availability</label>
                  <select
                    value={formData.ticketStatus}
                    onChange={e => setFormData({ ...formData, ticketStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="SELLING_FAST">Selling Fast</option>
                    <option value="SOLD_OUT">Sold Out</option>
                    <option value="UNAVAILABLE">Not on sale</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

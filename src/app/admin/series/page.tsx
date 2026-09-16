'use client';

import React, { useState } from 'react';
import { adminEngine } from '@/lib/adminStore';

interface SeriesItem {
  id: string;
  name: string;
  category: string;
  format: 'T20' | 'ODI' | 'TEST';
  totalMatches: number;
  completedMatches: number;
  dates: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  standings: {
    team: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    nrr: string;
    points: number;
  }[];
}

export default function AdminSeriesPage() {
  const initialSeries: SeriesItem[] = [
    {
      id: 'ser-01',
      name: 'Border-Gavaskar Trophy 2026',
      category: 'International Bilateral',
      format: 'T20',
      totalMatches: 5,
      completedMatches: 2,
      dates: 'Sep 10 - Sep 28, 2026',
      status: 'ACTIVE',
      standings: [
        { team: 'India', played: 2, won: 1, lost: 1, tied: 0, nrr: '+0.450', points: 2 },
        { team: 'Australia', played: 2, won: 1, lost: 1, tied: 0, nrr: '-0.450', points: 2 }
      ]
    },
    {
      id: 'ser-02',
      name: 'RoshSpark Premier League 2026 (RPL)',
      category: 'Franchise League',
      format: 'T20',
      totalMatches: 14,
      completedMatches: 8,
      dates: 'Oct 05 - Nov 12, 2026',
      status: 'UPCOMING',
      standings: [
        { team: 'RoshSpark Titans', played: 4, won: 3, lost: 1, tied: 0, nrr: '+1.120', points: 6 },
        { team: 'Mumbai Spark', played: 4, won: 3, lost: 1, tied: 0, nrr: '+0.880', points: 6 },
        { team: 'Bangalore Blasters', played: 4, won: 1, lost: 3, tied: 0, nrr: '-0.420', points: 2 },
        { team: 'Delhi Dominators', played: 4, won: 1, lost: 3, tied: 0, nrr: '-1.580', points: 2 }
      ]
    },
    {
      id: 'ser-03',
      name: 'RoshSpark Tri-Nation Cup',
      category: 'Tri-Series',
      format: 'ODI',
      totalMatches: 7,
      completedMatches: 7,
      dates: 'Aug 01 - Aug 18, 2026',
      status: 'COMPLETED',
      standings: [
        { team: 'India', played: 5, won: 4, lost: 1, tied: 0, nrr: '+1.450', points: 8 },
        { team: 'South Africa', played: 5, won: 2, lost: 3, tied: 0, nrr: '+0.120', points: 4 },
        { team: 'England', played: 4, won: 1, lost: 3, tied: 0, nrr: '-1.570', points: 2 }
      ]
    }
  ];

  const [seriesList, setSeriesList] = useState<SeriesItem[]>(initialSeries);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(initialSeries[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSeries, setNewSeries] = useState({
    name: '',
    category: 'International Bilateral',
    format: 'T20' as 'T20' | 'ODI' | 'TEST',
    dates: '',
    totalMatches: 3
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentSeries = seriesList.find(s => s.id === selectedSeriesId) || seriesList[0];

  const handleUpdatePoints = (teamIndex: number, deltaWon: number) => {
    const updated = seriesList.map(s => {
      if (s.id !== selectedSeriesId) return s;
      const newStandings = [...s.standings];
      const row = { ...newStandings[teamIndex] };
      row.won = Math.max(0, row.won + deltaWon);
      row.played = row.won + row.lost + row.tied;
      row.points = row.won * 2 + row.tied * 1;
      newStandings[teamIndex] = row;
      return { ...s, standings: newStandings };
    });
    setSeriesList(updated);
    adminEngine.logActivity('SERIES_UPDATED', `Points table recalculated for ${currentSeries.name}`);
    showToast('Points table updated');
  };

  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SeriesItem = {
      id: `ser-${Date.now()}`,
      name: newSeries.name,
      category: newSeries.category,
      format: newSeries.format,
      totalMatches: Number(newSeries.totalMatches),
      completedMatches: 0,
      dates: newSeries.dates || 'Upcoming 2026',
      status: 'UPCOMING',
      standings: [
        { team: 'Team A', played: 0, won: 0, lost: 0, tied: 0, nrr: '0.000', points: 0 },
        { team: 'Team B', played: 0, won: 0, lost: 0, tied: 0, nrr: '0.000', points: 0 }
      ]
    };
    setSeriesList([created, ...seriesList]);
    setSelectedSeriesId(created.id);
    adminEngine.logActivity('SERIES_CREATED', `Tournament "${created.name}" created at RoshSpark Stadium`);
    setShowCreateModal(false);
    showToast(`Tournament "${created.name}" created!`);
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
            Series, Tournaments & Standings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage championship tournaments hosted exclusively at RoshSpark Cricket Stadium and adjust points tables.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Tournament
        </button>
      </div>

      {/* Series Cards Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seriesList.map(s => {
          const isSelected = s.id === selectedSeriesId;
          return (
            <div
              key={s.id}
              onClick={() => setSelectedSeriesId(s.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">{s.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  s.status === 'ACTIVE'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : s.status === 'UPCOMING'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {s.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm mt-2">{s.name}</h3>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                <span>{s.format} Format</span>
                <span>{s.completedMatches}/{s.totalMatches} Matches Played</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tournament Points Table */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
              Official Points Table
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">{currentSeries.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dates: {currentSeries.dates} • Venue: RoshSpark Cricket Stadium
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Win = 2 pts, Tie/NR = 1 pt, Loss = 0 pts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-2.5 px-3">Pos</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3 text-center">Played</th>
                <th className="py-2.5 px-3 text-center">Won</th>
                <th className="py-2.5 px-3 text-center">Lost</th>
                <th className="py-2.5 px-3 text-center">Tied</th>
                <th className="py-2.5 px-3 text-center">NRR</th>
                <th className="py-2.5 px-3 text-center">Points</th>
                <th className="py-2.5 px-3 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {currentSeries.standings.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-white">{row.team}</td>
                  <td className="py-3 px-3 text-center font-mono">{row.played}</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">{row.won}</td>
                  <td className="py-3 px-3 text-center font-mono text-rose-400">{row.lost}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{row.tied}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{row.nrr}</td>
                  <td className="py-3 px-3 text-center font-mono font-black text-amber-300 text-sm">
                    {row.points}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleUpdatePoints(idx, 1)}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold"
                        title="Add 1 Win"
                      >
                        + Win
                      </button>
                      <button
                        onClick={() => handleUpdatePoints(idx, -1)}
                        className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold"
                        title="Deduct 1 Win"
                      >
                        - Win
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Series Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Create Tournament at RoshSpark
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSeries} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RoshSpark Super Series 2026"
                  value={newSeries.name}
                  onChange={e => setNewSeries({ ...newSeries, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    required
                    value={newSeries.category}
                    onChange={e => setNewSeries({ ...newSeries, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Format</label>
                  <select
                    value={newSeries.format}
                    onChange={e => setNewSeries({ ...newSeries, format: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="T20">T20</option>
                    <option value="ODI">ODI</option>
                    <option value="TEST">TEST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Scheduled Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. Oct 10 - Oct 25"
                    value={newSeries.dates}
                    onChange={e => setNewSeries({ ...newSeries, dates: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Total Matches</label>
                  <input
                    type="number"
                    min={1}
                    value={newSeries.totalMatches}
                    onChange={e => setNewSeries({ ...newSeries, totalMatches: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
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
                  Launch Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

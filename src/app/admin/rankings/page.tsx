'use client';

import React, { useState } from 'react';
import { CENTRAL_PLAYERS } from '@/lib/centralData';
import { adminEngine } from '@/lib/adminStore';

export default function AdminRankingsPage() {
  const [category, setCategory] = useState<'BATTING' | 'BOWLING' | 'ALL_ROUNDER' | 'FIELDING'>('BATTING');
  const [format, setFormat] = useState<'ALL' | 'T20' | 'ODI' | 'TEST'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Batting rankings sorted by runs at RoshSpark
  const battingRankings = [...CENTRAL_PLAYERS]
    .sort((a, b) => b.stadiumStats.runs - a.stadiumStats.runs)
    .slice(0, 15);

  // Bowling rankings sorted by wickets
  const bowlingRankings = [...CENTRAL_PLAYERS]
    .sort((a, b) => b.stadiumStats.wickets - a.stadiumStats.wickets)
    .slice(0, 15);

  // All-rounder rankings
  const allRounderRankings = [...CENTRAL_PLAYERS]
    .sort((a, b) => b.stadiumStats.allRounderRating - a.stadiumStats.allRounderRating)
    .slice(0, 15);

  // Fielding rankings
  const fieldingRankings = [...CENTRAL_PLAYERS]
    .sort((a, b) => (b.stadiumStats.catches + b.stadiumStats.runOuts) - (a.stadiumStats.catches + a.stadiumStats.runOuts))
    .slice(0, 15);

  const handleRecalculate = () => {
    adminEngine.logActivity('RANKINGS_RECALCULATED', 'Official RoshSpark Cricket Stadium player leaderboards recalculated');
    showToast('Rankings recalculated from official match engine records!');
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
            RoshSpark Stadium Player Rankings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Stadium-exclusive player performance leaderboards and historical ground impact indexes.
          </p>
        </div>
        <button
          onClick={handleRecalculate}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Recalculate All Rankings
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {(['BATTING', 'BOWLING', 'ALL_ROUNDER', 'FIELDING'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat === 'ALL_ROUNDER' ? 'All-Rounders' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Format:</span>
          {(['ALL', 'T20', 'ODI', 'TEST'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                format === fmt
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Player</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4">Stadium Matches</th>
              {category === 'BATTING' && (
                <>
                  <th className="py-3 px-4">Total Runs</th>
                  <th className="py-3 px-4">Batting Avg</th>
                  <th className="py-3 px-4">Strike Rate</th>
                  <th className="py-3 px-4">High Score</th>
                </>
              )}
              {category === 'BOWLING' && (
                <>
                  <th className="py-3 px-4">Wickets</th>
                  <th className="py-3 px-4">Economy</th>
                  <th className="py-3 px-4">Avg</th>
                  <th className="py-3 px-4">Best Figures</th>
                </>
              )}
              {category === 'ALL_ROUNDER' && (
                <>
                  <th className="py-3 px-4">Runs</th>
                  <th className="py-3 px-4">Wickets</th>
                  <th className="py-3 px-4">Rating Index</th>
                </>
              )}
              {category === 'FIELDING' && (
                <>
                  <th className="py-3 px-4">Catches</th>
                  <th className="py-3 px-4">Run Outs</th>
                  <th className="py-3 px-4">Stumpings</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {(category === 'BATTING'
              ? battingRankings
              : category === 'BOWLING'
              ? bowlingRankings
              : category === 'ALL_ROUNDER'
              ? allRounderRankings
              : fieldingRankings
            ).map((p, idx) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                    idx === 0 ? 'bg-amber-500 text-slate-950 font-black' :
                    idx === 1 ? 'bg-slate-300 text-slate-950 font-black' :
                    idx === 2 ? 'bg-amber-700 text-white font-black' :
                    'text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    {p.name}
                    <span className="text-[10px] text-slate-400 font-normal">#{p.jersey}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{p.role}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-300">{p.teamName}</span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-300">
                  {p.stadiumStats.matches}
                </td>

                {category === 'BATTING' && (
                  <>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {p.stadiumStats.runs}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-200">
                      {p.stadiumStats.average}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {p.stadiumStats.strikeRate}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.stadiumStats.highestScore}
                    </td>
                  </>
                )}

                {category === 'BOWLING' && (
                  <>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {p.stadiumStats.wickets}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-200">
                      {p.stadiumStats.economy}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {p.stadiumStats.bowlingAverage}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.stadiumStats.bestFigures}
                    </td>
                  </>
                )}

                {category === 'ALL_ROUNDER' && (
                  <>
                    <td className="py-3 px-4 font-mono text-slate-300">{p.stadiumStats.runs}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{p.stadiumStats.wickets}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {p.stadiumStats.allRounderRating} pts
                    </td>
                  </>
                )}

                {category === 'FIELDING' && (
                  <>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{p.stadiumStats.catches}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{p.stadiumStats.runOuts}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{p.stadiumStats.stumpings}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

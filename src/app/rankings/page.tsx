"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CENTRAL_PLAYERS, CentralPlayer } from '@/lib/centralData';

type MainCategory = 'Batting' | 'Bowling' | 'All-rounder' | 'Fielding';

export default function RankingsPage() {
  const [mainCategory, setMainCategory] = useState<MainCategory>('Batting');
  const [battingMetric, setBattingMetric] = useState<'runs' | 'strikeRate' | 'average' | 'centuries' | 'fifties' | 'sixes' | 'fours'>('runs');
  const [bowlingMetric, setBowlingMetric] = useState<'wickets' | 'economy' | 'bowlingAverage' | 'bestFigures' | 'maidens' | 'dotBalls'>('wickets');
  const [allRounderMetric, setAllRounderMetric] = useState<'overall' | 'batting' | 'bowling'>('overall');
  const [fieldingMetric, setFieldingMetric] = useState<'catches' | 'runOuts' | 'stumpings'>('catches');
  
  const [genderFilter, setGenderFilter] = useState<'All' | "Men's" | "Women's">('All');
  const [formatFilter, setFormatFilter] = useState<'All' | 'T20' | 'ODI'>('All');

  // Filter & sort players
  const rankedPlayers = useMemo(() => {
    let list = [...CENTRAL_PLAYERS];

    if (genderFilter === "Women's") {
      list = list.filter(p => p.teamId === 'rsv' || p.teamId === 'cqn' || p.teamId === 'ssp');
    } else if (genderFilter === "Men's") {
      list = list.filter(p => p.teamId !== 'rsv' && p.teamId !== 'cqn' && p.teamId !== 'ssp');
    }

    if (mainCategory === 'Batting') {
      list.sort((a, b) => {
        if (battingMetric === 'runs') return b.stadiumStats.runs - a.stadiumStats.runs;
        if (battingMetric === 'strikeRate') return b.stadiumStats.strikeRate - a.stadiumStats.strikeRate;
        if (battingMetric === 'average') return b.stadiumStats.average - a.stadiumStats.average;
        if (battingMetric === 'centuries') return b.stadiumStats.centuries - a.stadiumStats.centuries;
        if (battingMetric === 'fifties') return b.stadiumStats.fifties - a.stadiumStats.fifties;
        if (battingMetric === 'sixes') return b.stadiumStats.sixes - a.stadiumStats.sixes;
        if (battingMetric === 'fours') return b.stadiumStats.fours - a.stadiumStats.fours;
        return 0;
      });
    } else if (mainCategory === 'Bowling') {
      list.sort((a, b) => {
        if (bowlingMetric === 'wickets') return b.stadiumStats.wickets - a.stadiumStats.wickets;
        if (bowlingMetric === 'economy') {
          // Lowest economy with at least 10 overs
          const aE = a.stadiumStats.oversBowled >= 10 ? a.stadiumStats.economy : 99;
          const bE = b.stadiumStats.oversBowled >= 10 ? b.stadiumStats.economy : 99;
          return aE - bE;
        }
        if (bowlingMetric === 'bowlingAverage') {
          const aA = a.stadiumStats.wickets > 0 ? a.stadiumStats.bowlingAverage : 999;
          const bA = b.stadiumStats.wickets > 0 ? b.stadiumStats.bowlingAverage : 999;
          return aA - bA;
        }
        if (bowlingMetric === 'maidens') return b.stadiumStats.maidens - a.stadiumStats.maidens;
        if (bowlingMetric === 'dotBalls') return b.stadiumStats.dotBalls - a.stadiumStats.dotBalls;
        return b.stadiumStats.wickets - a.stadiumStats.wickets;
      });
    } else if (mainCategory === 'All-rounder') {
      list.sort((a, b) => {
        if (allRounderMetric === 'batting') return b.stadiumStats.runs - a.stadiumStats.runs;
        if (allRounderMetric === 'bowling') return b.stadiumStats.wickets - a.stadiumStats.wickets;
        return b.stadiumStats.allRounderRating - a.stadiumStats.allRounderRating;
      });
    } else if (mainCategory === 'Fielding') {
      list.sort((a, b) => {
        if (fieldingMetric === 'catches') return b.stadiumStats.catches - a.stadiumStats.catches;
        if (fieldingMetric === 'runOuts') return b.stadiumStats.runOuts - a.stadiumStats.runOuts;
        if (fieldingMetric === 'stumpings') return b.stadiumStats.stumpings - a.stadiumStats.stumpings;
        return (b.stadiumStats.catches + b.stadiumStats.runOuts) - (a.stadiumStats.catches + a.stadiumStats.runOuts);
      });
    }

    return list;
  }, [mainCategory, battingMetric, bowlingMetric, allRounderMetric, fieldingMetric, genderFilter, formatFilter]);

  return (
    <main className="w-full pt-20 bg-background min-h-screen text-on-surface pb-16">
      {/* Hero Header */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-6 lg:px-10 py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 font-label-caps text-xs tracking-widest uppercase">
            <span className="material-symbols-outlined text-base">leaderboard</span>
            <span>STADIUM-SPECIFIC TELEMETRY RANKINGS</span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-white">
            ROSHSPARK ARENA PLAYER RANKINGS
          </h1>
          <p className="text-slate-400 font-body-md mt-2 max-w-2xl text-sm sm:text-base">
            Official all-time player rankings computed strictly on matchday performances at RoshSpark Cricket Stadium. Does not use worldwide or ICC global ratings.
          </p>

          {/* Filters: Gender & Format */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">CATEGORY:</span>
              {(['All', "Men's", "Women's"] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    genderFilter === g ? 'bg-emerald-500 text-black font-bold' : 'bg-surface-container text-slate-300 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">FORMAT:</span>
              {(['All', 'T20', 'ODI'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormatFilter(f)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    formatFilter === f ? 'bg-emerald-500 text-black font-bold' : 'bg-surface-container text-slate-300 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8">
        
        {/* Main Categories Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/10 scrollbar-none">
          {(['Batting', 'Bowling', 'All-rounder', 'Fielding'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setMainCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                mainCategory === cat
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-surface-container text-slate-300 hover:text-white hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {cat === 'Batting' ? 'sports_cricket' : cat === 'Bowling' ? 'sports_baseball' : cat === 'All-rounder' ? 'stars' : 'sports_handball'}
              </span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Sub-Metrics Selection Bar */}
        <div className="flex items-center gap-2 my-6 overflow-x-auto scrollbar-none">
          {mainCategory === 'Batting' && (
            <>
              {[
                { id: 'runs', label: 'Most Runs' },
                { id: 'strikeRate', label: 'Highest Strike Rate' },
                { id: 'average', label: 'Best Average' },
                { id: 'centuries', label: 'Most Centuries' },
                { id: 'fifties', label: 'Most Half-Centuries' },
                { id: 'sixes', label: 'Most Sixes' },
                { id: 'fours', label: 'Most Fours' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setBattingMetric(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap ${
                    battingMetric === m.id
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-400'
                      : 'bg-surface-container-low border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </>
          )}

          {mainCategory === 'Bowling' && (
            <>
              {[
                { id: 'wickets', label: 'Most Wickets' },
                { id: 'economy', label: 'Best Economy' },
                { id: 'bowlingAverage', label: 'Best Bowling Average' },
                { id: 'maidens', label: 'Most Maidens' },
                { id: 'dotBalls', label: 'Most Dot Balls' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setBowlingMetric(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap ${
                    bowlingMetric === m.id
                      ? 'bg-cyan-950/80 border border-cyan-500 text-cyan-400'
                      : 'bg-surface-container-low border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </>
          )}

          {mainCategory === 'All-rounder' && (
            <>
              {[
                { id: 'overall', label: 'Overall Rating' },
                { id: 'batting', label: 'Batting Contribution' },
                { id: 'bowling', label: 'Bowling Contribution' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setAllRounderMetric(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap ${
                    allRounderMetric === m.id
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-400'
                      : 'bg-surface-container-low border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </>
          )}

          {mainCategory === 'Fielding' && (
            <>
              {[
                { id: 'catches', label: 'Most Catches' },
                { id: 'runOuts', label: 'Most Run Outs' },
                { id: 'stumpings', label: 'Most Stumpings' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setFieldingMetric(m.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap ${
                    fieldingMetric === m.id
                      ? 'bg-amber-950/80 border border-amber-500 text-amber-400'
                      : 'bg-surface-container-low border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Ranked Players Table */}
        <div className="bg-surface-container rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-high text-slate-400 font-label-caps text-xs border-b border-white/10">
                  <th className="p-4 w-16 text-center">RANK</th>
                  <th className="p-4">PLAYER</th>
                  <th className="p-4">ROLE</th>
                  <th className="p-4 text-center">MATCHES</th>
                  <th className="p-4 text-right">
                    {mainCategory === 'Batting' && battingMetric === 'runs' && 'RUNS'}
                    {mainCategory === 'Batting' && battingMetric === 'strikeRate' && 'STRIKE RATE'}
                    {mainCategory === 'Batting' && battingMetric === 'average' && 'AVERAGE'}
                    {mainCategory === 'Batting' && battingMetric === 'centuries' && '100s'}
                    {mainCategory === 'Batting' && battingMetric === 'fifties' && '50s'}
                    {mainCategory === 'Batting' && battingMetric === 'sixes' && 'SIXES'}
                    {mainCategory === 'Batting' && battingMetric === 'fours' && 'FOURS'}
                    {mainCategory === 'Bowling' && bowlingMetric === 'wickets' && 'WICKETS'}
                    {mainCategory === 'Bowling' && bowlingMetric === 'economy' && 'ECONOMY'}
                    {mainCategory === 'Bowling' && bowlingMetric === 'bowlingAverage' && 'BOWLING AVG'}
                    {mainCategory === 'Bowling' && bowlingMetric === 'maidens' && 'MAIDENS'}
                    {mainCategory === 'Bowling' && bowlingMetric === 'dotBalls' && 'DOT BALLS'}
                    {mainCategory === 'All-rounder' && 'IMPACT RATING'}
                    {mainCategory === 'Fielding' && 'DISMISSALS'}
                  </th>
                  <th className="p-4 text-right">PROFILE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-body-md">
                {rankedPlayers.map((player, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 text-center font-mono font-bold">
                        <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center ${
                          rank === 1 ? 'bg-amber-400 text-black font-black' :
                          rank === 2 ? 'bg-slate-300 text-black font-black' :
                          rank === 3 ? 'bg-amber-700 text-white font-black' :
                          'text-slate-400'
                        }`}>
                          {rank}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link href={`/players/${player.id}`} className="flex items-center gap-3 group-hover:text-emerald-400 transition-colors">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                              <span>{player.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">#{player.jersey}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{player.teamName} • {player.nationality}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-label-caps uppercase px-2.5 py-1 rounded-md bg-surface-container-high text-slate-300">
                          {player.role}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-slate-300">
                        {player.stadiumStats.matches}
                      </td>
                      <td className="p-4 text-right font-headline-md font-bold text-base">
                        {mainCategory === 'Batting' && battingMetric === 'runs' && (
                          <span className="text-emerald-400">{player.stadiumStats.runs}</span>
                        )}
                        {mainCategory === 'Batting' && battingMetric === 'strikeRate' && (
                          <span className="text-emerald-400">{player.stadiumStats.strikeRate}</span>
                        )}
                        {mainCategory === 'Batting' && battingMetric === 'average' && (
                          <span className="text-emerald-400">{player.stadiumStats.average}</span>
                        )}
                        {mainCategory === 'Batting' && battingMetric === 'centuries' && (
                          <span className="text-amber-400">{player.stadiumStats.centuries}</span>
                        )}
                        {mainCategory === 'Batting' && battingMetric === 'fifties' && (
                          <span className="text-emerald-400">{player.stadiumStats.fifties}</span>
                        )}
                        {mainCategory === 'Batting' && battingMetric === 'sixes' && (
                          <span className="text-purple-400">{player.stadiumStats.sixes}</span>
                        )}
                        {mainCategory === 'Batting' && battingMetric === 'fours' && (
                          <span className="text-white">{player.stadiumStats.fours}</span>
                        )}

                        {mainCategory === 'Bowling' && bowlingMetric === 'wickets' && (
                          <span className="text-cyan-400">{player.stadiumStats.wickets}</span>
                        )}
                        {mainCategory === 'Bowling' && bowlingMetric === 'economy' && (
                          <span className="text-cyan-400 font-mono">{player.stadiumStats.economy}</span>
                        )}
                        {mainCategory === 'Bowling' && bowlingMetric === 'bowlingAverage' && (
                          <span className="text-cyan-400 font-mono">{player.stadiumStats.bowlingAverage}</span>
                        )}
                        {mainCategory === 'Bowling' && bowlingMetric === 'maidens' && (
                          <span className="text-white">{player.stadiumStats.maidens}</span>
                        )}
                        {mainCategory === 'Bowling' && bowlingMetric === 'dotBalls' && (
                          <span className="text-white">{player.stadiumStats.dotBalls}</span>
                        )}

                        {mainCategory === 'All-rounder' && (
                          <span className="text-emerald-400 font-mono">{player.stadiumStats.allRounderRating}</span>
                        )}

                        {mainCategory === 'Fielding' && (
                          <span className="text-amber-400 font-mono">
                            {fieldingMetric === 'catches' ? player.stadiumStats.catches :
                             fieldingMetric === 'runOuts' ? player.stadiumStats.runOuts :
                             player.stadiumStats.stumpings}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          href={`/players/${player.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-emerald-500 text-slate-300 hover:text-black font-label-caps text-xs font-bold uppercase transition-all"
                        >
                          Profile →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

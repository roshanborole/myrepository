"use client";

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeriesById, CENTRAL_MATCHES, CENTRAL_PLAYERS } from '@/lib/centralData';

export default function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const series = getSeriesById(resolvedParams.id);

  if (!series) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'fixtures' | 'results' | 'teams' | 'statistics' | 'points' | 'news' | 'videos'>('overview');

  const seriesMatches = CENTRAL_MATCHES.filter(m => m.tournament.toLowerCase().includes(series.format.toLowerCase()) || m.tournament.toLowerCase().includes('rpl') || m.tournament.toLowerCase().includes('icc'));

  return (
    <main className="w-full pt-20 bg-background min-h-screen text-on-surface pb-16">
      {/* Back Ribbon */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-6 lg:px-10 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/series" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-label-caps text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Series
          </Link>
          <div className="text-xs font-mono text-slate-400">
            RoshSpark Stadium Tournament Arena
          </div>
        </div>
      </div>

      {/* Series Hero Header */}
      <div className="relative w-full overflow-hidden bg-surface-container-low border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={series.bannerUrl} alt={series.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-label-caps text-xs font-black uppercase">
              {series.category}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-surface-container px-2.5 py-1 rounded-full border border-white/10">
              {series.format} Format
            </span>
            <span className="text-xs font-mono text-slate-400">
              {series.matchesCount} Fixtures at RoshSpark
            </span>
          </div>

          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            {series.name}
          </h1>

          <p className="text-slate-300 font-body-md max-w-3xl text-sm sm:text-base leading-relaxed mb-6">
            {series.overview}
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-emerald-400 text-sm">calendar_today</span>
              <span>{series.dates}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-emerald-400 text-sm">location_on</span>
              <span>RoshSpark Cricket Stadium</span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-emerald-400 text-sm">groups</span>
              <span>{series.teamsCount} Participating Franchises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full bg-surface-container-high sticky top-20 z-30 shadow-md border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {[
              { id: 'overview', label: 'OVERVIEW' },
              { id: 'fixtures', label: 'FIXTURES' },
              { id: 'results', label: 'RESULTS' },
              { id: 'teams', label: 'TEAMS' },
              { id: 'statistics', label: 'STATISTICS' },
              { id: 'points', label: 'POINTS TABLE' },
              { id: 'news', label: 'NEWS' },
              { id: 'videos', label: 'VIDEOS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8">
        
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
                <h3 className="font-headline-md font-bold text-xl text-white mb-4">About this Tournament</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {series.overview} Every fixture is scheduled under standard ICC Category-1 LED lighting arrays calibrated to 3,200 lux with sub-surface drainage ensuring continuous action even under coastal cloudbursts.
                </p>
                <h4 className="font-label-caps text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3">KEY STADIUM CONDITIONS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-slate-400 text-[10px] block">PITCH BOUNDARIES</span>
                    <span className="font-bold text-white">74m Square / 81m Long</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-slate-400 text-[10px] block">EXPECTED PAR SCORE</span>
                    <span className="font-bold text-white">182 (T20)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-slate-400 text-[10px] block">DEW FACTOR</span>
                    <span className="font-bold text-emerald-400">Post 8:45 PM</span>
                  </div>
                </div>
              </div>

              {/* Next Fixture Spotlight */}
              <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
                <h3 className="font-headline-md font-bold text-xl text-white mb-4">Featured Matchday</h3>
                <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-label-caps text-[10px] font-black uppercase">
                      Spotlight Match
                    </span>
                    <h4 className="font-headline-md font-bold text-lg text-white mt-1">India vs Australia (3rd T20I)</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">RoshSpark Cricket Stadium • 7:30 PM IST</p>
                  </div>
                  <Link 
                    href="/matches/match-ind-aus-live" 
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-bold uppercase transition-all shadow-md flex-shrink-0"
                  >
                    Open Match Center →
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar Leaders */}
            <div className="space-y-6">
              <div className="bg-surface-container rounded-3xl p-6 border border-white/5 shadow-xl">
                <h3 className="font-headline-md font-bold text-lg text-white mb-4 border-b border-white/10 pb-2">Tournament Leaders</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-slate-400 text-[10px] font-label-caps uppercase">MOST RUNS (ORANGE CAP)</span>
                    <div className="font-bold text-white text-base mt-1">{series.topPerformers.runsLeader.name}</div>
                    <div className="text-emerald-400 font-mono text-sm font-bold mt-0.5">
                      {series.topPerformers.runsLeader.runs} Runs (Avg: {series.topPerformers.runsLeader.avg})
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-slate-400 text-[10px] font-label-caps uppercase">MOST WICKETS (PURPLE CAP)</span>
                    <div className="font-bold text-white text-base mt-1">{series.topPerformers.wicketsLeader.name}</div>
                    <div className="text-cyan-400 font-mono text-sm font-bold mt-0.5">
                      {series.topPerformers.wicketsLeader.wickets} Wickets (Econ: {series.topPerformers.wicketsLeader.econ})
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container rounded-3xl p-6 border border-white/5 shadow-xl text-center">
                <span className="material-symbols-outlined text-4xl text-emerald-400 mb-2">confirmation_number</span>
                <h4 className="font-headline-md font-bold text-lg text-white mb-1">Catch It Live from the Stands</h4>
                <p className="text-xs text-slate-400 mb-4">Tickets available for upcoming clashes across 6 grandstand tiers.</p>
                <Link 
                  href="/tickets" 
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-bold uppercase transition-all block shadow-md"
                >
                  Book Tickets
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FIXTURES */}
        {activeTab === 'fixtures' && (
          <div className="space-y-4">
            <h3 className="font-headline-md font-bold text-xl text-white mb-4">Scheduled Matches at RoshSpark</h3>
            {series.fixtures.map((fix, idx) => (
              <div key={idx} className="bg-surface-container rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-xs font-mono text-emerald-400 block mb-1">📅 {fix.date}</span>
                  <h4 className="font-headline-md font-bold text-lg text-white">{fix.teams}</h4>
                  <p className="text-xs text-slate-400 font-mono">{fix.venue}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg font-label-caps text-xs font-bold uppercase ${
                    fix.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' :
                    fix.status === 'UPCOMING' ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400' :
                    'bg-surface-container-highest text-slate-300'
                  }`}>
                    {fix.status}
                  </span>
                  <Link 
                    href={`/matches/${fix.matchId}`} 
                    className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-emerald-500 text-slate-200 hover:text-black font-label-caps text-xs font-bold uppercase transition-all"
                  >
                    View Match →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESULTS */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <h3 className="font-headline-md font-bold text-xl text-white mb-4">Tournament Results</h3>
            {CENTRAL_MATCHES.filter(m => m.status === 'RECENT').map(match => (
              <div key={match.id} className="bg-surface-container rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">{match.tournament} • {match.datetime}</span>
                  <h4 className="font-headline-md font-bold text-lg text-white">{match.team1.name} ({match.team1Score}) vs {match.team2.name} ({match.team2Score})</h4>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">{match.resultSummary}</p>
                </div>
                <Link 
                  href={`/matches/${match.id}`} 
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-emerald-500 text-slate-200 hover:text-black font-label-caps text-xs font-bold uppercase transition-all"
                >
                  Scorecard & Report →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TEAMS */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {series.teams.map((tName, idx) => (
              <div key={idx} className="bg-surface-container rounded-2xl p-5 border border-white/5 shadow-md flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center font-bold text-emerald-400 text-base">
                  {tName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-headline-md font-bold text-base text-white">{tName}</h4>
                  <span className="text-xs text-slate-400 font-mono">Franchise XI</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATISTICS */}
        {activeTab === 'statistics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 shadow-xl">
              <h3 className="font-headline-md font-bold text-lg text-white mb-4 pb-2 border-b border-white/10">Top Batting Averages</h3>
              <div className="space-y-3">
                {CENTRAL_PLAYERS.filter(p => p.stadiumStats.runs > 300).slice(0, 5).map(player => (
                  <div key={player.id} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low">
                    <span className="font-bold text-white text-sm">{player.name} ({player.teamName})</span>
                    <span className="font-mono text-emerald-400 text-sm font-bold">{player.stadiumStats.average}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 shadow-xl">
              <h3 className="font-headline-md font-bold text-lg text-white mb-4 pb-2 border-b border-white/10">Top Bowling Strike Rates</h3>
              <div className="space-y-3">
                {CENTRAL_PLAYERS.filter(p => p.stadiumStats.wickets > 10).slice(0, 5).map(player => (
                  <div key={player.id} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low">
                    <span className="font-bold text-white text-sm">{player.name} ({player.teamName})</span>
                    <span className="font-mono text-cyan-400 text-sm font-bold">{player.stadiumStats.wickets} Wkts (Econ {player.stadiumStats.economy})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* POINTS TABLE */}
        {activeTab === 'points' && (
          <div className="bg-surface-container rounded-3xl overflow-hidden shadow-xl border border-white/5">
            <div className="p-5 bg-surface-container-high border-b border-white/10">
              <h3 className="font-headline-md font-bold text-lg text-white">Official Series Standings</h3>
              <p className="text-xs text-slate-400 font-mono">Net Run Rate updated after every completed fixture</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-surface-container-low text-slate-400 font-label-caps text-xs border-b border-white/5">
                    <th className="p-4 w-12 text-center">POS</th>
                    <th className="p-4">TEAM</th>
                    <th className="p-4 text-center">P</th>
                    <th className="p-4 text-center">W</th>
                    <th className="p-4 text-center">L</th>
                    <th className="p-4 text-center">NR</th>
                    <th className="p-4 text-center font-bold text-emerald-400">PTS</th>
                    <th className="p-4 text-right">NRR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-body-md">
                  {series.pointsTable.map(team => (
                    <tr key={team.pos} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-center font-mono font-bold text-slate-400">{team.pos}</td>
                      <td className="p-4 font-bold text-white">{team.team}</td>
                      <td className="p-4 text-center text-slate-300 font-mono">{team.played}</td>
                      <td className="p-4 text-center text-slate-300 font-mono">{team.won}</td>
                      <td className="p-4 text-center text-slate-300 font-mono">{team.lost}</td>
                      <td className="p-4 text-center text-slate-400 font-mono">{team.nr}</td>
                      <td className="p-4 text-center font-black text-emerald-400 text-base font-mono">{team.pts}</td>
                      <td className="p-4 text-right font-mono text-slate-300">{team.nrr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NEWS */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl">
              <span className="text-[10px] font-label-caps uppercase text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded">Tournament Dispatch</span>
              <h4 className="font-headline-md font-bold text-lg text-white mt-3 mb-2">Record Stadium Gate Receipts for {series.name}</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Over 52,000 tickets claimed across the opening leg as RoshSpark Stadium hosts its signature floodlit fixtures.
              </p>
              <span className="text-xs font-mono text-slate-500">2 days ago • Media Center</span>
            </div>

            <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl">
              <span className="text-[10px] font-label-caps uppercase text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded">Curator Update</span>
              <h4 className="font-headline-md font-bold text-lg text-white mt-3 mb-2">Centre Strips Prepared for Accelerated Pace</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Curator confirms dry-deck rolling has maintained 15mm grass binding to provide high strike-rate batting entertainment.
              </p>
              <span className="text-xs font-mono text-slate-500">4 days ago • Grounds Crew</span>
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Link href="/videos/v-grand-final" className="bg-surface-container rounded-2xl overflow-hidden shadow-xl border border-white/5 group">
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80" alt="Extended Highlights" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="material-symbols-outlined text-4xl text-emerald-400">play_circle</span>
                </div>
              </div>
              <div className="p-4">
                <h5 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">Extended Matchday Highlights</h5>
                <span className="text-xs text-slate-400 font-mono">18:42 • 4K Stream</span>
              </div>
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

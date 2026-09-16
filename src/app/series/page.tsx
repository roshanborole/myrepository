"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { CENTRAL_SERIES } from '@/lib/centralData';
import { trackClientActivity } from '@/lib/activityLogger';

export default function SeriesPage() {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Upcoming' | 'Completed'>('All');

  useEffect(() => {
    trackClientActivity('Series viewed', `Viewing CrickEntry tournaments & series hub`);
  }, []);

  const filteredSeries = useMemo(() => {
    if (statusFilter === 'All') return CENTRAL_SERIES;
    return CENTRAL_SERIES.filter(s => s.category === statusFilter);
  }, [statusFilter]);

  return (
    <main className="w-full pt-20 bg-background min-h-screen pb-16 text-on-surface">
      {/* Hero Banner */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-6 lg:px-10 py-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 font-label-caps text-xs tracking-widest uppercase">
            <span className="material-symbols-outlined text-base">emoji_events</span>
            <span>CHAMPIONSHIPS & TOUR AT ROSHSPARK CRICKET STADIUM</span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-white">
            SERIES & TOURNAMENTS
          </h1>
          <p className="text-slate-400 font-body-md mt-2 max-w-2xl">
            Explore marquee cricket series, international bilaterals, and the flagship RoshSpark Premier League (RPL) hosted at the world's premier floodlit venue.
          </p>

          {/* Filter Tabs: All, Live, Upcoming, Completed */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto scrollbar-none">
            {(['All', 'Live', 'Upcoming', 'Completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-5 py-2 rounded-full font-label-caps text-xs uppercase font-bold transition-all ${
                  statusFilter === tab
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : 'bg-surface-container text-slate-300 hover:text-white hover:bg-surface-container-high'
                }`}
              >
                {tab} Series
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeries.map(series => (
            <div 
              key={series.id} 
              className="group bg-surface-container rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <img 
                    src={series.bannerUrl} 
                    alt={series.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider ${
                      series.category === 'Live' 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : series.category === 'Upcoming' 
                        ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-surface-container-highest text-slate-300'
                    }`}>
                      {series.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[11px]">
                      {series.format}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {series.matchesCount} Matches
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="font-headline-md font-bold text-xl text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {series.name}
                  </h2>
                  <p className="text-slate-400 text-xs font-mono mb-4">
                    📅 {series.dates} • {series.teamsCount} Teams
                  </p>
                  <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed mb-6">
                    {series.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface-container-low border border-white/5 text-xs font-label-caps mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TOP RUNS</span>
                      <span className="font-bold text-white truncate block">{series.topPerformers.runsLeader.name}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{series.topPerformers.runsLeader.runs} Runs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">TOP WICKETS</span>
                      <span className="font-bold text-white truncate block">{series.topPerformers.wicketsLeader.name}</span>
                      <span className="text-cyan-400 font-mono text-[11px]">{series.topPerformers.wicketsLeader.wickets} Wkts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-white/5">
                <Link 
                  href={`/series/${series.id}`} 
                  className="w-full py-3 rounded-xl bg-surface-container-highest hover:bg-emerald-500 text-slate-200 hover:text-black font-label-caps text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <span>View Series Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

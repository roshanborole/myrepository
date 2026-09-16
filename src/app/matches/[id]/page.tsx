"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMatchById } from '@/lib/centralData';
import MatchCenterTabs from '../components/MatchCenterTabs';
import { useLiveMatch } from '../hooks/useLiveMatch';
import { trackClientActivity } from '@/lib/activityLogger';

export default function MatchCenterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const initialMatch = getMatchById(resolvedParams.id);

  if (!initialMatch) {
    notFound();
  }

  useEffect(() => {
    trackClientActivity('Match viewed', `${initialMatch.team1.name} vs ${initialMatch.team2.name} (${initialMatch.category})`);
  }, [initialMatch]);

  // Use the live match hook to enforce consistency and enable simulation
  const { match, derivedStats, simulateNextBall } = useLiveMatch(initialMatch);

  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';
  const isRecent = match.status === 'RECENT';

  // Live countdown timer for upcoming matches
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    if (!isUpcoming) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isUpcoming]);

  return (
    <main className="w-full pt-20 bg-background min-h-screen text-on-surface">
      {/* Match Center Back Ribbon & Stadium Overview */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-6 lg:px-10 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/matches" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-label-caps text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Matches
          </Link>
          <div className="flex items-center gap-4 text-xs font-label-caps text-slate-400">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-400">location_on</span> {match.venue}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Boundaries: 74m Square, 81m Straight</span>
          </div>
        </div>
      </div>

      {/* Match Header Scoreboard Hero */}
      <div className="w-full bg-surface-container-low px-4 sm:px-6 lg:px-10 py-6 sm:py-8 border-b border-white/5 relative overflow-hidden">
        {/* Ambient light effect */}
        {isLive && (
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        )}
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Tournament and Format Badge */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-2.5">
              {isLive && (
                <span className="px-3 py-1 rounded-full bg-red-600 text-white font-label-caps text-xs font-black uppercase flex items-center gap-1.5 shadow-lg shadow-red-600/30 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white"></span> LIVE
                </span>
              )}
              {isRecent && (
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-slate-300 font-label-caps text-xs font-bold uppercase">
                  COMPLETED
                </span>
              )}
              {isUpcoming && (
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-label-caps text-xs font-bold uppercase">
                  UPCOMING
                </span>
              )}
              <span className="text-slate-300 font-label-caps text-xs uppercase tracking-wider font-semibold">
                {match.tournament} • {match.matchName} • <span className="text-emerald-400">{match.format}</span>
              </span>
            </div>
            <div className="text-xs font-label-caps text-slate-400 font-mono">
              {isUpcoming ? `Fixture Date: ${match.datetime}` : (match.info.toss || match.datetime)}
            </div>
          </div>

          {/* Scores and Teams Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Team 1 */}
            <div className="md:col-span-4 lg:col-span-5 flex items-center gap-4 bg-surface-container/70 p-5 rounded-2xl border border-white/5">
              <div className={`w-16 h-16 rounded-2xl ${match.team1.color || 'bg-blue-600'} text-white flex items-center justify-center font-headline-md font-black text-2xl shadow-xl flex-shrink-0 border border-white/10`}>
                {match.team1.shortName}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-xl font-bold text-white line-clamp-1">{match.team1.name}</h2>
                  {isLive && match.team1Score && (
                     <span className="px-2 py-0.5 rounded text-[10px] font-label-caps uppercase bg-emerald-500/20 text-emerald-400 font-bold">Innings 1</span>
                  )}
                </div>
                {!isUpcoming && (match.team1Score || match.team1Overs) && (
                  <div className="flex items-baseline gap-2 mt-1">
                    {match.team1Score && <span className="font-headline-lg text-3xl md:text-4xl font-black text-white">{match.team1Score}</span>}
                    {match.team1Overs && <span className="text-slate-400 font-label-caps text-sm">{match.team1Overs}</span>}
                  </div>
                )}
                {isUpcoming && (
                  <span className="text-xs text-slate-400 font-label-caps mt-1 block">Playing XI Announced on Matchday</span>
                )}
              </div>
            </div>

            {/* Match Situation Center Badge */}
            <div className="md:col-span-4 lg:col-span-2 text-center py-2 flex flex-col justify-center items-center">
              {isUpcoming ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs font-bold bg-surface-container px-3 py-1.5 rounded-xl border border-white/5">
                    <span>{timeLeft.days}d</span>:<span>{timeLeft.hours}h</span>:<span>{timeLeft.minutes}m</span>:<span>{timeLeft.seconds}s</span>
                  </div>
                  <div className="text-[11px] font-label-caps text-slate-400">MATCH STARTS IN</div>
                  <Link 
                    href={`/tickets/${match.id}`} 
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">confirmation_number</span>
                    BUY TICKETS
                  </Link>
                  {match.ticketsStartingPrice && (
                    <span className="text-[10px] text-emerald-400 font-label-caps">From ₹{match.ticketsStartingPrice}</span>
                  )}
                </div>
              ) : isLive && derivedStats ? (
                // Live Mathematically Derived Equation
                <div className="w-full bg-surface-container/90 p-4 rounded-2xl border border-emerald-500/30 shadow-lg">
                  <div className="font-headline-md text-lg font-black text-emerald-400 mb-0.5 whitespace-nowrap">
                    NEED {derivedStats.runsRequired} RUNS
                  </div>
                  <div className="font-label-caps text-xs text-slate-300 font-semibold mb-2">
                    FROM {derivedStats.ballsRemaining} BALLS
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[11px] font-label-caps border-t border-white/10 pt-2">
                    <div>
                      <span className="text-slate-400">CRR:</span> <span className="font-bold text-white font-mono">{derivedStats.crr}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">RRR:</span> <span className="font-bold text-amber-400 font-mono">{derivedStats.rrr}</span>
                    </div>
                  </div>
                  <div className="mt-1.5 text-[10px] font-mono text-slate-400">TARGET: {derivedStats.target}</div>
                </div>
              ) : (
                <div className="bg-surface-container p-4 rounded-2xl border border-white/5">
                  <div className="font-label-caps text-[10px] uppercase text-slate-400 tracking-wider mb-1">
                    MATCH RESULT
                  </div>
                  <div className="font-headline-md text-sm sm:text-base font-extrabold text-white">
                    {match.resultSummary}
                  </div>
                </div>
              )}
            </div>

            {/* Team 2 */}
            <div className={`md:col-span-4 lg:col-span-5 flex items-center justify-end gap-4 bg-surface-container/70 p-5 rounded-2xl border border-white/5 ${isLive && !derivedStats ? 'opacity-80' : ''}`}>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {isLive && derivedStats && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-label-caps uppercase bg-emerald-500 text-black font-black">Chasing</span>
                  )}
                  <h2 className="font-headline-md text-xl font-bold text-white line-clamp-1">{match.team2.name}</h2>
                </div>
                {!isUpcoming && (match.team2Score || match.team2Overs) && (
                  <div className="flex items-baseline justify-end gap-2 mt-1">
                    {match.team2Score && <span className="font-headline-lg text-3xl md:text-4xl font-black text-emerald-400">{match.team2Score}</span>}
                    {match.team2Overs && <span className="text-slate-400 font-label-caps text-sm">{match.team2Overs}</span>}
                  </div>
                )}
                {isUpcoming && (
                  <span className="text-xs text-slate-400 font-label-caps mt-1 block">Visiting Arena</span>
                )}
              </div>
              <div className={`w-16 h-16 rounded-2xl ${match.team2.color || 'bg-amber-500'} text-white flex items-center justify-center font-headline-md font-black text-2xl shadow-xl flex-shrink-0 border border-white/10`}>
                {match.team2.shortName}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs and Content Component */}
      <MatchCenterTabs match={match} derivedStats={derivedStats} simulateNextBall={simulateNextBall} />
      
    </main>
  );
}

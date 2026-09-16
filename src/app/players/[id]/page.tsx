"use client";

import React, { use, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlayerById, CENTRAL_PLAYERS } from '@/lib/centralData';
import BackButton from '@/components/BackButton';
import { trackClientActivity } from '@/lib/activityLogger';

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const player = getPlayerById(resolvedParams.id) || CENTRAL_PLAYERS.find(p => p.id === resolvedParams.id) || CENTRAL_PLAYERS[0];

  useEffect(() => {
    if (player) {
      trackClientActivity('Player profile viewed', `${player.name} (${player.teamName} • ${player.role})`);
    }
  }, [player]);

  if (!player) {
    notFound();
  }

  const stats = player.stadiumStats;

  return (
    <main className="w-full pt-20 bg-background min-h-screen text-on-surface pb-16">
      {/* Top Ribbon */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-6 lg:px-10 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/rankings" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-label-caps text-xs uppercase font-bold">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Player Rankings
          </Link>
          <div className="text-xs font-mono text-slate-400">
            RoshSpark Cricket Stadium Performance Dossier
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 space-y-8">
        
        {/* Player Header Card */}
        <div className="bg-surface-container rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Photo & Jersey */}
          <div className="relative flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-900">
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black font-headline-md font-black text-lg sm:text-xl px-3 py-1 rounded-xl shadow-lg">
              #{player.jersey}
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-label-caps text-xs uppercase font-bold">
              <span>{player.teamName}</span> • <span>{player.role}</span>
            </div>

            <h1 className="font-headline-lg text-3xl sm:text-5xl font-black text-white">
              {player.name}
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm font-mono">
              Nationality: <strong className="text-white">{player.nationality}</strong> • Age: <strong className="text-white">{player.age} yrs</strong> ({player.dob})
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                <span className="text-slate-400 text-[10px] block font-label-caps uppercase">BATTING STYLE</span>
                <span className="font-bold text-white">{player.battingStyle}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                <span className="text-slate-400 text-[10px] block font-label-caps uppercase">BOWLING STYLE</span>
                <span className="font-bold text-white">{player.bowlingStyle}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                <span className="text-slate-400 text-[10px] block font-label-caps uppercase">MATCHES AT VENUE</span>
                <span className="font-bold text-emerald-400 font-headline-md text-base">{stats.matches}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                <span className="text-slate-400 text-[10px] block font-label-caps uppercase">IMPACT RATING</span>
                <span className="font-bold text-white font-headline-md text-base">{stats.allRounderRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stadium Statistics Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-emerald-400 text-xl">analytics</span>
            <h2 className="font-headline-md font-bold text-2xl text-white">
              RoshSpark Cricket Stadium Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Batting Stats Box */}
            <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
              <h3 className="font-headline-md font-bold text-lg text-white mb-6 pb-2 border-b border-white/10 flex items-center justify-between">
                <span>BATTING RECORD</span>
                <span className="text-xs font-mono text-emerald-400">{stats.innings} Innings</span>
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">RUNS</span>
                  <span className="font-headline-md font-black text-2xl text-emerald-400">{stats.runs}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">HIGHEST</span>
                  <span className="font-headline-md font-black text-2xl text-white">{stats.highestScore}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">AVERAGE</span>
                  <span className="font-headline-md font-black text-2xl text-white">{stats.average}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">STRIKE RATE</span>
                  <span className="font-headline-md font-black text-2xl text-emerald-400">{stats.strikeRate}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">100s</span>
                  <span className="font-headline-md font-black text-2xl text-amber-400">{stats.centuries}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">50s</span>
                  <span className="font-headline-md font-black text-2xl text-emerald-400">{stats.fifties}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">FOURS</span>
                  <span className="font-headline-md font-black text-2xl text-white">{stats.fours}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="text-[10px] text-slate-400 font-label-caps block">SIXES</span>
                  <span className="font-headline-md font-black text-2xl text-purple-400">{stats.sixes}</span>
                </div>
              </div>
            </div>

            {/* Bowling & Fielding Stats Box */}
            <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-headline-md font-bold text-lg text-white mb-6 pb-2 border-b border-white/10 flex items-center justify-between">
                  <span>BOWLING &amp; FIELDING RECORD</span>
                  <span className="text-xs font-mono text-cyan-400">{stats.oversBowled} Overs</span>
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-[10px] text-slate-400 font-label-caps block">WICKETS</span>
                    <span className="font-headline-md font-black text-2xl text-cyan-400">{stats.wickets}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-[10px] text-slate-400 font-label-caps block">ECONOMY</span>
                    <span className="font-headline-md font-black text-2xl text-white">{stats.economy}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-[10px] text-slate-400 font-label-caps block">BEST FIGURES</span>
                    <span className="font-headline-md font-black text-2xl text-emerald-400">{stats.bestFigures}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-[10px] text-slate-400 font-label-caps block">MAIDENS</span>
                    <span className="font-headline-md font-black text-2xl text-white">{stats.maidens}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-[10px] text-slate-400 font-label-caps block">DOT BALLS</span>
                    <span className="font-headline-md font-black text-2xl text-white">{stats.dotBalls}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                    <span className="text-[10px] text-slate-400 font-label-caps block">BOWLING AVG</span>
                    <span className="font-headline-md font-black text-2xl text-white">{stats.bowlingAverage || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Fielding Dismissals */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-label-caps">CATCHES</span>
                  <span className="font-bold text-white text-base">{stats.catches}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-label-caps">RUN OUTS</span>
                  <span className="font-bold text-white text-base">{stats.runOuts}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-label-caps">STUMPINGS</span>
                  <span className="font-bold text-white text-base">{stats.stumpings}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Form & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Recent Form */}
          <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
            <h3 className="font-headline-md font-bold text-lg text-white mb-4">Recent Form at RoshSpark</h3>
            <div className="space-y-3">
              {player.recentForm.map((rf, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <div>
                    <span className="font-bold text-white text-sm block">{rf.match}</span>
                    <span className="text-xs text-slate-400 font-mono">Opponent: {rf.opp}</span>
                  </div>
                  <div className="text-right font-mono">
                    {rf.runs !== undefined && (
                      <span className="font-headline-md font-bold text-emerald-400 text-base">{rf.runs} ({rf.balls}b)</span>
                    )}
                    {rf.wickets !== undefined && (
                      <span className="font-headline-md font-bold text-cyan-400 text-base ml-2">• {rf.wickets} Wkts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stadium Achievements */}
          <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
            <h3 className="font-headline-md font-bold text-lg text-white mb-4">Stadium Achievements &amp; Honours</h3>
            <div className="space-y-3">
              {player.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="material-symbols-outlined text-amber-400 text-xl flex-shrink-0">military_tech</span>
                  <span className="text-slate-200 text-sm leading-relaxed">{ach}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

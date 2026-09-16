"use client";

import React, { useState } from 'react';
import { Match, CentralPlayer, CENTRAL_PLAYERS, CommentaryEvent, MatchHighlight, MatchArticle } from '@/lib/centralData';
import Link from 'next/link';

type DerivedStats = {
  target: number;
  runsRequired: number;
  ballsRemaining: number;
  oversBowled: string;
  crr: string;
  rrr: string;
  currentOverNumber: number;
  currentOverBalls: CommentaryEvent[];
  currentOverRuns: number;
  lastOverBalls: CommentaryEvent[];
  lastOverRuns: number;
  isFinished: boolean;
};

// ----------------------------------------------------------------------
// TAB: SUMMARY (Sections 38, 39, 56, 57, 58)
// ----------------------------------------------------------------------
const TabSummary = ({ match, derivedStats }: { match: Match; derivedStats: DerivedStats | null }) => {
  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';

  return (
    <div className="space-y-8">
      {/* 1. Header Match Result or Chasing Equation */}
      <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-label-caps uppercase text-emerald-400 font-bold tracking-wider block mb-1">
            {isLive ? 'LIVE MATCH EQUATION' : isUpcoming ? 'FIXTURE OVERVIEW' : 'FINAL RESULT SUMMARY'}
          </span>
          <h3 className="font-headline-md text-2xl font-black text-white">
            {match.resultSummary || `${match.team1.name} vs ${match.team2.name}`}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Hosted exclusively at <strong className="text-slate-200">ROSHSPARK CRICKET STADIUM</strong> • {match.datetime}
          </p>
        </div>

        {isLive && derivedStats && (
          <div className="flex items-center gap-4 bg-surface-container-high px-5 py-3 rounded-xl border border-white/10 flex-shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">CRR</span>
              <span className="font-headline-md font-bold text-lg text-white font-mono">{derivedStats.crr}</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="text-center">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">RRR</span>
              <span className="font-headline-md font-bold text-lg text-emerald-400 font-mono">{derivedStats.rrr}</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="text-center">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">REQUIRED</span>
              <span className="font-headline-md font-bold text-lg text-amber-400 font-mono">{derivedStats.runsRequired} / {derivedStats.ballsRemaining}b</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Powerplay & Match Phase Scores (Section 38) */}
      {!isUpcoming && (
        <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h4 className="font-label-caps text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">timelapse</span>
              MATCH PHASES BREAKDOWN
            </h4>
            <span className="text-[11px] font-mono text-slate-400">RoshSpark Pitch Telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block mb-1">POWERPLAY (0–6 OVERS)</span>
              <div className="font-headline-md font-bold text-xl text-white">52/1 <span className="text-xs text-slate-400 font-normal">(6.0 ov)</span></div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">Run Rate: 8.67 • 7 Fours, 2 Sixes</div>
            </div>

            <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block mb-1">MIDDLE OVERS (7–15 OVERS)</span>
              <div className="font-headline-md font-bold text-xl text-white">76/3 <span className="text-xs text-slate-400 font-normal">(9.0 ov)</span></div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">Run Rate: 8.44 • Spinners Operating</div>
            </div>

            <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block mb-1">DEATH OVERS (16–20 OVERS)</span>
              <div className="font-headline-md font-bold text-xl text-emerald-400">57/2 <span className="text-xs text-slate-400 font-normal">(5.0 ov)</span></div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">Run Rate: 11.40 • Power Hitting</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Section 39: Quick Score Summary Metrics & Section 57: Player of the Match */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Summary Metrics */}
        <div className="lg:col-span-2 bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
          <h4 className="font-label-caps text-xs text-slate-300 font-bold uppercase tracking-wider pb-2 border-b border-white/10">
            KEY PERFORMANCE SUMMARY
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-container-high p-3 rounded-xl">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">TOP SCORER</span>
              <span className="font-bold text-white text-sm block truncate">Player 08</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">72 (45)</span>
            </div>
            <div className="bg-surface-container-high p-3 rounded-xl">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">BEST BOWLER</span>
              <span className="font-bold text-white text-sm block truncate">Player 03</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">2/29 (3.2)</span>
            </div>
            <div className="bg-surface-container-high p-3 rounded-xl">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">BOUNDARIES</span>
              <span className="font-bold text-white text-sm block">19 Fours</span>
              <span className="text-xs text-purple-400 font-mono font-bold">8 Sixes</span>
            </div>
            <div className="bg-surface-container-high p-3 rounded-xl">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase block">TOTAL EXTRAS</span>
              <span className="font-bold text-white text-sm block">12 Extras</span>
              <span className="text-[10px] text-slate-400 font-mono">w 5, nb 2, lb 3, b 2</span>
            </div>
          </div>

          {/* Section 58: Calculated Match Records */}
          <div className="pt-2">
            <h5 className="text-[11px] font-label-caps text-slate-400 uppercase font-bold mb-2">VENUE RECORDS & MILESTONES</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-slate-400">Highest Partnership:</span>
                <span className="font-bold text-white">48 runs (Player 08 & Player 09)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-slate-400">Fastest Fifty:</span>
                <span className="font-bold text-white">Player 08 (31 balls)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-slate-400">Most Sixes in Match:</span>
                <span className="font-bold text-white">Player 08 (4 sixes)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                <span className="text-slate-400">Most Economical Bowler:</span>
                <span className="font-bold text-white">Player 06 (Econ 6.50)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 57: Player of the Match Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-surface-container to-surface-container-high rounded-2xl p-6 border border-amber-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-400 text-lg">hotel_class</span>
              <span className="text-xs font-label-caps uppercase text-amber-400 font-black tracking-wider">
                PLAYER OF THE MATCH
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-headline-md font-black text-2xl shadow-lg">
                P08
              </div>
              <div>
                <h3 className="font-headline-md font-bold text-lg text-white">Player 08</h3>
                <span className="text-xs text-slate-400 font-label-caps">Top-Order Batter • Match Impact: 94%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-surface-container-low/70 p-3 rounded-xl border border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 block font-label-caps">RUNS</span>
                <span className="font-black text-white text-base">72</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-label-caps">BALLS</span>
                <span className="font-bold text-slate-300 text-base">45</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-label-caps">STRIKE RATE</span>
                <span className="font-bold text-emerald-400 text-base">160.0</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
            <span>6 Fours • 2 Sixes</span>
            <span className="text-amber-400 font-bold font-label-caps">OFFICIAL AWARD</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: LIVE (Sections 22, 26, 27, 28, 29, 62)
// ----------------------------------------------------------------------
const TabLive = ({ 
  match, 
  derivedStats, 
  simulateNextBall 
}: { 
  match: Match; 
  derivedStats: DerivedStats | null; 
  simulateNextBall: (forcedOutcome?: CommentaryEvent['outcome']) => any;
}) => {
  const [liveAlert, setLiveAlert] = useState<string | null>(null);

  if (match.status === 'UPCOMING') {
    return (
      <div className="bg-surface-container rounded-2xl p-10 text-center border border-white/5 shadow-xl max-w-2xl mx-auto">
        <span className="material-symbols-outlined text-5xl text-emerald-400 mb-3">timer</span>
        <h3 className="font-headline-md text-2xl font-bold text-white mb-2">Match Not Started</h3>
        <p className="text-slate-400 font-body-md mb-6 text-sm">
          Live ball-by-ball telemetry, Hawk-Eye pitch data, and live scoring will commence when play begins on {match.dateShort} at {match.time}.
        </p>
        <Link 
          href={`/tickets/${match.id}`} 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-bold uppercase transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-base">confirmation_number</span>
          Book Match Tickets (From ₹{match.ticketsStartingPrice || 800})
        </Link>
      </div>
    );
  }

  if (!derivedStats || match.scorecard.length === 0 || !match.liveState) {
    return (
      <div className="bg-surface-container rounded-xl p-8 text-center border border-white/5">
        <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-400 font-body-md text-sm">Connecting to RoshSpark Stadium live telemetry node...</p>
      </div>
    );
  }

  const currentInnings = match.scorecard[match.scorecard.length - 1];
  const batters = currentInnings.batters.filter(b => b.isStriker || b.isNonStriker);
  const bowler = currentInnings.bowlers.find(b => b.isActive) || currentInnings.bowlers[0];

  const handleSimulateWithAlert = (outcome?: CommentaryEvent['outcome']) => {
    const event = simulateNextBall(outcome);
    if (!event) return;

    if (event.outcome === 'DOT BALL') {
      setLiveAlert('DOT BALL • 0 RUNS (NO WICKET)');
    } else if (event.outcome === 'WICKET') {
      setLiveAlert('WICKET! • OUT');
    } else if (event.outcome === 'SIX') {
      setLiveAlert('SIX! • 6 RUNS');
    } else if (event.outcome === 'FOUR') {
      setLiveAlert('FOUR! • 4 RUNS');
    } else if (event.outcome === '2 RUNS') {
      setLiveAlert('2 RUNS');
    } else if (event.outcome === '1 RUN') {
      setLiveAlert('1 RUN');
    } else {
      setLiveAlert(event.outcome);
    }
    setTimeout(() => setLiveAlert(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Section 62: Live Visual Banners */}
      {liveAlert && (
        <div className={`p-4 rounded-2xl text-center font-headline-md font-black text-2xl uppercase tracking-widest shadow-2xl animate-in zoom-in-95 duration-200 ${
          liveAlert.includes('WICKET') ? 'bg-red-600 text-white shadow-red-600/40' :
          liveAlert.includes('SIX') ? 'bg-purple-600 text-white shadow-purple-600/40' :
          liveAlert.includes('FOUR') ? 'bg-emerald-500 text-black shadow-emerald-500/40' :
          liveAlert.includes('DOT BALL') ? 'bg-surface-container-highest text-slate-200 border border-white/20' :
          liveAlert.includes('NO BALL') ? 'bg-amber-500 text-black shadow-amber-500/40' :
          liveAlert.includes('WIDE') ? 'bg-blue-600 text-white shadow-blue-600/40' :
          'bg-surface-container-high text-white'
        }`}>
          {liveAlert}
        </div>
      )}

      {/* Simulation Controller */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-surface-container-high to-surface-container border border-emerald-500/30 p-4 sm:p-5 rounded-2xl flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-label-caps text-xs text-emerald-400 font-bold uppercase tracking-wider">LIVE TELEMETRY CRICKET SIMULATION</span>
            </div>
            <p className="text-sm text-slate-300">
              Trigger deliveries. Score, overs, striker, bowler, over summary, and commentary stay strictly synchronized from centralized state.
            </p>
          </div>
          <button 
            onClick={() => handleSimulateWithAlert()}
            disabled={derivedStats.isFinished}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps uppercase font-bold tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            <span className="material-symbols-outlined text-base">sports_cricket</span>
            <span>{derivedStats.isFinished ? 'Match Completed' : 'Simulate Random Delivery'}</span>
          </button>
        </div>

        {/* Quick Delivery Outcome Triggers */}
        {!derivedStats.isFinished && (
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-white/10">
            <span className="text-[11px] font-label-caps text-slate-400 uppercase font-bold mr-1">Trigger Event:</span>
            <button
              onClick={() => handleSimulateWithAlert('DOT BALL')}
              className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-white/10 text-white font-label-caps text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Dot Ball (0)
            </button>
            <button
              onClick={() => handleSimulateWithAlert('1 RUN')}
              className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-white/10 text-white font-label-caps text-xs font-bold border border-white/10 transition-all"
            >
              1 Run
            </button>
            <button
              onClick={() => handleSimulateWithAlert('2 RUNS')}
              className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-white/10 text-white font-label-caps text-xs font-bold border border-white/10 transition-all"
            >
              2 Runs
            </button>
            <button
              onClick={() => handleSimulateWithAlert('FOUR')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-label-caps text-xs font-bold border border-emerald-500/40 transition-all"
            >
              Four (4)
            </button>
            <button
              onClick={() => handleSimulateWithAlert('SIX')}
              className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-label-caps text-xs font-bold border border-purple-500/40 transition-all"
            >
              Six (6)
            </button>
            <button
              onClick={() => handleSimulateWithAlert('WICKET')}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-label-caps text-xs font-bold border border-red-500/40 transition-all"
            >
              Wicket (W)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Batters, Bowler, Partnership */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Section 26: CURRENT BATTERS with STRIKER Indicator */}
          <div className="bg-surface-container rounded-2xl p-5 shadow-xl border border-white/5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-label-caps text-xs uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">sports_cricket</span>
                CURRENT BATTERS
              </h3>
              <span className="text-[10px] font-label-caps text-slate-400">* STRIKER</span>
            </div>

            <div className="space-y-3">
              {batters.map((batter, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border transition-all ${
                    batter.isStriker 
                      ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md shadow-emerald-500/10' 
                      : 'bg-surface-container-high border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {batter.name} {batter.isStriker && <span className="text-emerald-400 font-black">*</span>}
                      </span>
                      {batter.isStriker && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black font-label-caps text-[9px] font-black uppercase">
                          ON STRIKE
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-headline-md font-black text-xl text-white font-mono">{batter.runs}</span>
                      <span className="text-xs text-slate-400 font-normal ml-1">({batter.balls})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-2 font-mono">
                    <span>4s: <strong className="text-white">{batter.fours}</strong></span>
                    <span>6s: <strong className="text-white">{batter.sixes}</strong></span>
                    <span>SR: <strong className="text-emerald-400">{batter.strikeRate}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 28: CURRENT BOWLER */}
          <div className="bg-surface-container rounded-2xl p-5 shadow-xl border border-white/5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-label-caps text-xs uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">sports_baseball</span>
                CURRENT BOWLER
              </h3>
              <span className="text-[10px] font-label-caps text-slate-400">ACTIVE OVER</span>
            </div>

            {bowler && (
              <div className="p-4 rounded-xl bg-surface-container-high border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-base">{bowler.name}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-label-caps text-[10px] uppercase font-semibold">
                    Bowling
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-label-caps">OVERS</span>
                    <span className="font-bold text-white text-sm">{bowler.overs}</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-label-caps">MAIDENS</span>
                    <span className="font-bold text-white text-sm">{bowler.maidens}</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-label-caps">RUNS</span>
                    <span className="font-bold text-white text-sm">{bowler.runs}</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-label-caps">WICKETS</span>
                    <span className="font-bold text-emerald-400 text-sm">{bowler.wickets}</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-label-caps">ECONOMY</span>
                    <span className="font-bold text-white text-sm">{bowler.economy}</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-label-caps">DOTS</span>
                    <span className="font-bold text-white text-sm">{bowler.dots}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 29: Active Partnership Summary */}
          <div className="bg-surface-container rounded-2xl p-5 shadow-xl border border-white/5">
            <h3 className="font-label-caps text-xs uppercase text-slate-300 font-bold mb-3">ACTIVE PARTNERSHIP</h3>
            <div className="bg-surface-container-low p-4 rounded-xl border border-white/5">
              <div className="text-xs text-slate-400 mb-1 font-mono">
                {batters.map(b => b.name).join(' & ')}
              </div>
              <div className="font-headline-md font-bold text-emerald-400 text-xl">
                {match.liveState.partnershipRuns} Runs <span className="text-xs text-slate-400 font-normal">({match.liveState.partnershipBalls} Balls)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Current Over & Commentary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 22: CURRENT OVER DISPLAY (Individual Delivery Pills) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Current Over */}
            <div className="bg-surface-container rounded-2xl p-5 shadow-xl border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <h3 className="font-label-caps text-xs uppercase text-emerald-400 font-bold">
                  CURRENT OVER ({derivedStats.currentOverNumber})
                </h3>
                <span className="text-xs font-label-caps text-white font-bold bg-surface-container-highest px-2 py-0.5 rounded">
                  TOTAL: {derivedStats.currentOverRuns} RUNS
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap min-h-[48px] py-1">
                {derivedStats.currentOverBalls.length > 0 ? (
                  derivedStats.currentOverBalls.map((ball, idx) => {
                    const isDot = ball.outcome === 'DOT BALL' || (ball.runs === 0 && !ball.isWicket);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 mb-1 font-mono">{ball.overBall}</span>
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-label-caps font-bold shadow-md transition-all ${
                          ball.outcome === 'WICKET' || ball.isWicket
                            ? 'bg-red-600 text-white' 
                            : ball.outcome === 'SIX' 
                            ? 'bg-purple-600 text-white shadow-purple-600/30' 
                            : ball.outcome === 'FOUR' 
                            ? 'bg-emerald-500 text-black shadow-emerald-500/30 font-black' 
                            : isDot
                            ? 'bg-surface-container-highest text-slate-300 border border-white/10 font-mono font-bold'
                            : 'bg-surface-container-high text-slate-200 border border-white/10 font-mono'
                        }`}>
                          {ball.outcome === 'WICKET' || ball.isWicket ? 'W' : ball.runs}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm text-slate-400">Over in progress...</span>
                )}
              </div>
            </div>

            {/* Last Over */}
            <div className="bg-surface-container rounded-2xl p-5 shadow-xl border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <h3 className="font-label-caps text-xs uppercase text-slate-400 font-bold">
                  LAST OVER ({derivedStats.currentOverNumber - 1})
                </h3>
                <span className="text-xs font-label-caps text-slate-300 font-bold bg-surface-container-highest px-2 py-0.5 rounded">
                  TOTAL: {derivedStats.lastOverRuns} RUNS
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap min-h-[48px] py-1">
                {derivedStats.lastOverBalls.length > 0 ? (
                  derivedStats.lastOverBalls.map((ball, idx) => {
                    const isDot = ball.outcome === 'DOT BALL' || (ball.runs === 0 && !ball.isWicket);
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 mb-1 font-mono">{ball.overBall}</span>
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-label-caps font-bold ${
                          ball.outcome === 'WICKET' || ball.isWicket
                            ? 'bg-red-600 text-white' 
                            : ball.outcome === 'SIX' || ball.outcome === 'FOUR' 
                            ? 'bg-emerald-500 text-black font-black' 
                            : isDot
                            ? 'bg-surface-container-highest text-slate-300 border border-white/10 font-mono font-bold'
                            : 'bg-surface-container-high text-slate-200 border border-white/10 font-mono'
                        }`}>
                          {ball.outcome === 'WICKET' || ball.isWicket ? 'W' : ball.runs}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm text-slate-400">Previous over data logging...</span>
                )}
              </div>
            </div>

          </div>

          {/* Section 23: Live Ball-by-Ball Feed */}
          <div className="bg-surface-container rounded-2xl shadow-xl border border-white/5 overflow-hidden">
            <div className="p-4 bg-surface-container-high border-b border-white/10 flex items-center justify-between">
              <h3 className="font-label-caps text-xs uppercase text-white font-bold tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-400">forum</span>
                BALL-BY-BALL FEED (ROSHSPARK CRICKET STADIUM)
              </h3>
              <span className="text-[10px] font-label-caps text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                LATEST HIGHLIGHTED
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
              {match.liveState.commentaryHistory?.map((comm, idx) => {
                const isLatest = idx === 0;
                const isDot = comm.outcome === 'DOT BALL' || (comm.runs === 0 && !comm.isWicket);
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col sm:flex-row gap-3 p-4 rounded-xl border transition-all ${
                      isLatest 
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10' 
                        : 'bg-surface-container-low border-white/5'
                    }`}
                  >
                    <div className="flex items-center sm:flex-col justify-between sm:justify-start gap-1 sm:w-16 flex-shrink-0">
                      <span className="font-headline-md font-black text-xl text-emerald-400 font-mono">
                        {comm.overBall}
                      </span>
                      {isLatest && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-black font-label-caps">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span>{comm.bowler}</span>
                          <span className="text-slate-500">→</span>
                          <span>{comm.batter}</span>
                        </div>
                        {isDot && (
                          <span className="text-[11px] font-mono text-slate-400">
                            0 runs • no wicket
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {comm.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 sm:text-right flex sm:flex-col items-start sm:items-end justify-center">
                      <span className={`px-2.5 py-1 rounded-lg font-label-caps text-xs font-black uppercase tracking-wider ${
                        comm.outcome === 'WICKET' || comm.isWicket
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                          : comm.outcome === 'SIX' 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                          : comm.outcome === 'FOUR' 
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' 
                          : isDot 
                          ? 'bg-surface-container-highest text-slate-300 border border-white/10 font-mono font-bold' 
                          : 'bg-surface-container-high text-white border border-white/10'
                      }`}>
                        {comm.outcome}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: SCORECARD (Sections 34, 35, 36, 37)
// ----------------------------------------------------------------------
const TabScorecard = ({ match }: { match: Match }) => {
  if (match.scorecard.length === 0) {
    return (
      <div className="bg-surface-container rounded-2xl p-8 text-center border border-white/5 text-slate-400">
        Scorecard will be populated as soon as official scorer registers innings.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {match.scorecard.map((innings, i) => (
        <div key={i} className="bg-surface-container rounded-2xl overflow-hidden shadow-xl border border-white/5">
          <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-white/10">
            <div>
              <span className="font-label-caps text-xs text-emerald-400 font-bold uppercase tracking-wider">INNINGS {innings.inningsNumber}</span>
              <h3 className="font-headline-md font-bold text-xl text-white">{innings.teamName}</h3>
            </div>
            <div className="text-right">
              <span className="font-headline-md text-3xl font-black text-emerald-400">{innings.total}</span>
              <span className="text-slate-400 text-sm ml-2">({innings.overs} ov)</span>
              <div className="text-xs text-slate-400 font-mono">Run Rate: {innings.runRate}</div>
            </div>
          </div>

          {/* Section 34: Batting Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="bg-surface-container-low text-slate-400 font-label-caps text-xs border-b border-white/5">
                  <th className="p-4 uppercase tracking-wider">Batter</th>
                  <th className="p-4 uppercase tracking-wider">Dismissal</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">R</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">B</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">4s</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">6s</th>
                  <th className="p-4 uppercase tracking-wider text-right w-20">SR</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm divide-y divide-white/5">
                {innings.batters.map((b, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-1.5">
                      {b.name} {b.isStriker && <span className="text-emerald-400 font-black">*</span>}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">{b.dismissal}</td>
                    <td className="p-4 text-right font-bold text-white text-base">{b.runs}</td>
                    <td className="p-4 text-right text-slate-400">{b.balls}</td>
                    <td className="p-4 text-right text-slate-300">{b.fours}</td>
                    <td className="p-4 text-right text-slate-300">{b.sixes}</td>
                    <td className="p-4 text-right font-semibold text-emerald-400">{b.strikeRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 35: Extras Breakdown & Fall of Wickets */}
          <div className="px-6 py-3 border-t border-white/5 bg-surface-container-low text-xs flex flex-col sm:flex-row justify-between gap-2 text-slate-400">
            <div><strong className="text-white">Extras:</strong> {innings.extras}</div>
            <div><strong className="text-white">Fall of Wickets:</strong> {innings.fallOfWickets}</div>
          </div>

          {/* Section 37: Bowling Table */}
          <div className="overflow-x-auto border-t border-white/10">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="bg-surface-container-low text-slate-400 font-label-caps text-xs border-b border-white/5">
                  <th className="p-4 uppercase tracking-wider">Bowler</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">O</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">M</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">R</th>
                  <th className="p-4 uppercase tracking-wider text-right w-16">W</th>
                  <th className="p-4 uppercase tracking-wider text-right w-20">ECON</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm divide-y divide-white/5">
                {innings.bowlers.map((b, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white">{b.name}</td>
                    <td className="p-4 text-right text-slate-400 font-mono">{b.overs}</td>
                    <td className="p-4 text-right text-slate-400">{b.maidens}</td>
                    <td className="p-4 text-right text-slate-300 font-bold">{b.runs}</td>
                    <td className="p-4 text-right font-black text-emerald-400 text-base">{b.wickets}</td>
                    <td className="p-4 text-right text-slate-400 font-mono">{b.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: COMMENTARY (Sections 23, 43, 44 with Filter Buttons)
// ----------------------------------------------------------------------
const TabCommentary = ({ match }: { match: Match }) => {
  const [filter, setFilter] = useState<'ALL' | 'DOT BALLS' | 'WICKETS' | 'BOUNDARIES' | 'SIXES' | 'FOURS' | 'EXTRAS'>('ALL');

  const commHistory: CommentaryEvent[] = match.liveState?.commentaryHistory || [
    { overBall: "17.2", runs: 4, outcome: "FOUR", batter: "Player 08", bowler: "Player 03", description: "CRACKED! Pitched slightly full outside off, Player 08 leans into a glorious cover drive that races to the fence." },
    { overBall: "17.1", runs: 1, outcome: "1 RUN", batter: "Player 09", bowler: "Player 03", description: "Good length delivery angling into middle stump, clipped softly into the leg-side gap for a quick single." },
    { overBall: "16.6", runs: 6, outcome: "SIX", batter: "Player 08", bowler: "Player 06", description: "INTO THE SECOND TIER! Tossed up on off, Player 08 charges down the track and bludgeons it over long-on for a monster 98m six!" },
    { overBall: "16.5", runs: 2, outcome: "2 RUNS", batter: "Player 08", bowler: "Player 06", description: "Flatter on the pads, worked wide of deep mid-wicket. Superb hustle from both batters to turn one into two." },
    { overBall: "16.4", runs: 0, outcome: "WICKET", batter: "Player 05", bowler: "Player 06", description: "OUT! In the air and taken at deep cover! Player 05 attempts an inside-out lofted drive but doesn't get enough elevation.", isWicket: true, wicketType: "c Player 01 b Player 06", wicketPlayer: "Player 05" },
    { overBall: "16.3", runs: 0, outcome: "DOT BALL", batter: "Player 05", bowler: "Player 06", description: "Beaten! Slower through the air, grips the pitch and turns past the outside edge into keeper's gloves." },
    { overBall: "16.2", runs: 4, outcome: "FOUR", batter: "Player 05", bowler: "Player 06", description: "BOUNDARY! Short and punished. Rocked back quickly and pulled with authority through mid-wicket." },
    { overBall: "16.1", runs: 1, outcome: "1 RUN", batter: "Player 08", bowler: "Player 06", description: "Pushed down to long-off for an easy single to rotate the strike." }
  ];

  const filteredHistory = commHistory.filter(c => {
    if (filter === 'ALL') return true;
    if (filter === 'DOT BALLS') return c.outcome === 'DOT BALL' || (c.runs === 0 && !c.isWicket);
    if (filter === 'WICKETS') return c.isWicket || c.outcome === 'WICKET';
    if (filter === 'BOUNDARIES') return c.outcome === 'FOUR' || c.outcome === 'SIX';
    if (filter === 'FOURS') return c.outcome === 'FOUR';
    if (filter === 'SIXES') return c.outcome === 'SIX';
    if (filter === 'EXTRAS') return c.outcome === 'WIDE' || c.outcome === 'NO BALL' || c.outcome === 'BYE' || c.outcome === 'LEG BYE';
    return true;
  });

  return (
    <div className="bg-surface-container rounded-2xl shadow-xl border border-white/5 overflow-hidden">
      {/* Header & Filter Controls (Section 44) */}
      <div className="p-5 bg-surface-container-high border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-headline-md font-bold text-lg text-white">Full Ball-by-Ball Commentary</h3>
          <p className="text-xs text-slate-400">Real-time ball telemetry & descriptions at RoshSpark Stadium</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL', 'DOT BALLS', 'WICKETS', 'BOUNDARIES', 'FOURS', 'SIXES', 'EXTRAS'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-label-caps text-xs uppercase font-bold transition-all ${
                filter === f 
                  ? 'bg-emerald-500 text-black shadow-md' 
                  : 'bg-surface-container text-slate-300 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Commentary Items */}
      <div className="p-5 space-y-4 max-h-[650px] overflow-y-auto scrollbar-thin">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((comm, idx) => {
            const isDot = comm.outcome === 'DOT BALL' || (comm.runs === 0 && !comm.isWicket);
            return (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-surface-container-low border border-white/5">
                <div className="w-16 flex-shrink-0 text-center">
                  <div className="font-headline-md font-black text-xl text-emerald-400 font-mono">{comm.overBall}</div>
                  <div className="text-[10px] text-slate-500 font-label-caps uppercase mt-0.5">Delivery</div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{comm.bowler}</span>
                      <span className="text-slate-500">→</span>
                      <span>{comm.batter}</span>
                    </div>
                    {isDot && (
                      <span className="text-[11px] font-mono text-slate-400">
                        0 runs • no wicket
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{comm.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <span className={`px-2.5 py-1 rounded-lg font-label-caps text-xs font-black uppercase ${
                    comm.outcome === 'WICKET' || comm.isWicket ? 'bg-red-600 text-white' :
                    comm.outcome === 'SIX' || comm.outcome === 'FOUR' ? 'bg-emerald-500 text-black font-black' :
                    isDot ? 'bg-surface-container-highest text-slate-300 border border-white/10 font-mono font-bold' :
                    'bg-surface-container-high text-white'
                  }`}>
                    {comm.outcome}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            No deliveries match the selected filter ({filter}).
          </div>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: PARTNERSHIP (Section 29)
// ----------------------------------------------------------------------
const TabPartnership = ({ match }: { match: Match }) => {
  const partnerships = match.graphs?.partnerships || [
    { batters: "Player 01 & Player 02", runs: 42, balls: 28 },
    { batters: "Player 02 & Player 08", runs: 36, balls: 22 },
    { batters: "Player 08 & Player 04", runs: 33, balls: 24 },
    { batters: "Player 08 & Player 09", runs: 22, balls: 10 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <h3 className="font-headline-md font-bold text-lg text-white">Innings Partnerships</h3>
          <span className="text-xs font-mono text-slate-400">Total Partnerships: {partnerships.length}</span>
        </div>

        <div className="space-y-4">
          {partnerships.map((p, idx) => {
            const runRate = p.balls > 0 ? ((p.runs / p.balls) * 6).toFixed(2) : "0.00";
            return (
              <div key={idx} className="bg-surface-container-high p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    {p.batters}
                  </span>
                  <div className="text-right font-mono">
                    <span className="font-black text-emerald-400 text-base">{p.runs} Runs</span>
                    <span className="text-xs text-slate-400 ml-1.5">({p.balls}b)</span>
                    <span className="text-xs text-slate-500 ml-2">RR: {runRate}</span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min(100, (p.runs / 80) * 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: FALL OF WICKETS (Section 30)
// ----------------------------------------------------------------------
const TabFallOfWickets = ({ match }: { match: Match }) => {
  const fow = match.liveState?.fallOfWickets || [
    { score: 42, wicket: 1, over: "5.4", player: "Player 01" },
    { score: 78, wicket: 2, over: "9.2", player: "Player 02" },
    { score: 111, wicket: 3, over: "13.1", player: "Player 04" },
    { score: 128, wicket: 4, over: "15.4", player: "Player 05" }
  ];

  return (
    <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <h3 className="font-headline-md font-bold text-lg text-white">Fall of Wickets Timeline</h3>
        <span className="text-xs text-slate-400 font-label-caps">Official Match Scorer Verified</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface-container-low text-slate-400 font-label-caps text-xs border-b border-white/5">
              <th className="p-4 uppercase">Wicket #</th>
              <th className="p-4 uppercase">Score</th>
              <th className="p-4 uppercase">Over</th>
              <th className="p-4 uppercase">Dismissed Batter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {fow.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-red-400 font-mono">{item.wicket}</td>
                <td className="p-4 font-black text-white text-base font-mono">{item.score}</td>
                <td className="p-4 text-slate-400 font-mono">{item.over} ov</td>
                <td className="p-4 font-bold text-white">{item.player}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: SQUADS (Sections 46, 47)
// ----------------------------------------------------------------------
const TabSquads = ({ match }: { match: Match }) => {
  const team1Squad = CENTRAL_PLAYERS.filter(p => p.teamId === match.team1.id);
  const team2Squad = CENTRAL_PLAYERS.filter(p => p.teamId === match.team2.id);

  const renderTeamSquad = (teamName: string, color: string | undefined, players: CentralPlayer[]) => {
    const playingXI = players.slice(0, 11);
    const substitutes = players.slice(11);

    return (
      <div className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className={`w-10 h-10 rounded-xl ${color || 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
            {teamName.substring(0, 3).toUpperCase()}
          </div>
          <div>
            <h3 className="font-headline-md font-bold text-lg text-white">{teamName}</h3>
            <span className="text-xs text-slate-400 font-label-caps">Playing XI & Bench</span>
          </div>
        </div>

        <div>
          <h4 className="font-label-caps text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3">PLAYING XI</h4>
          <div className="space-y-2">
            {playingXI.map((player, i) => (
              <Link 
                key={player.id} 
                href={`/players/${player.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors border border-white/5 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-xs w-5">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-emerald-400 border border-white/10">
                    {player.jersey}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      {player.name}
                      {i === 0 && <span className="text-[10px] text-amber-400 font-normal font-mono">(c)</span>}
                      {i === 1 && <span className="text-[10px] text-cyan-400 font-normal font-mono">(wk)</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 font-label-caps">{player.role} • {player.battingStyle}</div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono">
                  {player.stadiumStats.average > 0 && <span>Avg: {player.stadiumStats.average}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {substitutes.length > 0 && (
          <div>
            <h4 className="font-label-caps text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">BENCH & SUBSTITUTES</h4>
            <div className="space-y-2">
              {substitutes.map((player) => (
                <Link 
                  key={player.id} 
                  href={`/players/${player.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest/60 hover:bg-surface-container-low transition-colors border border-white/5 group text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 font-mono text-[10px]">#{player.jersey}</span>
                    <span className="font-medium text-slate-300 group-hover:text-white">{player.name}</span>
                  </div>
                  <span className="text-slate-500 uppercase text-[10px] font-label-caps">{player.role}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {renderTeamSquad(match.team1.name, match.team1.color, team1Squad.length ? team1Squad : CENTRAL_PLAYERS.slice(0, 15))}
      {renderTeamSquad(match.team2.name, match.team2.color, team2Squad.length ? team2Squad : CENTRAL_PLAYERS.slice(7, 22))}
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: OVERS (Section 40)
// ----------------------------------------------------------------------
const TabOvers = ({ match }: { match: Match }) => {
  if (!match.oversData || match.oversData.length === 0) {
    return (
      <div className="bg-surface-container rounded-2xl p-8 text-center border border-white/5 text-slate-400">
        Over-by-over progression logs will appear here during active play.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {match.oversData.map((over, idx) => (
        <div key={idx} className="bg-surface-container rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface-container-high flex flex-col items-center justify-center border border-white/10 flex-shrink-0">
              <span className="text-[10px] font-label-caps text-slate-400 uppercase">OVER</span>
              <span className="font-headline-md text-2xl font-black text-white">{over.overNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {over.events.map((ev, i) => (
                  <span 
                    key={i} 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-label-caps ${
                      ev === 'W' 
                        ? 'bg-red-600 text-white' 
                        : ev === '6' || ev === '4' 
                        ? 'bg-emerald-500 text-black font-black' 
                        : 'bg-surface-container-high text-white border border-white/10'
                    }`}
                  >
                    {ev}
                  </span>
                ))}
              </div>
              <div className="text-xs text-slate-400 font-label-caps">
                Bowled by <strong className="text-white">{over.bowler}</strong>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="font-headline-md text-2xl font-black text-emerald-400">{over.runs} Runs</div>
            {over.wickets > 0 && (
              <div className="text-xs font-label-caps text-red-400 font-bold mt-0.5">
                {over.wickets} Wicket{over.wickets > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: GRAPHS (Section 41 Populated Visual Charts)
// ----------------------------------------------------------------------
const TabGraphs = ({ match }: { match: Match }) => {
  const g = match.graphs || {
    overs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    team1RunsPerOver: [8, 12, 10, 6, 14, 9, 7, 8, 11, 15, 6, 8, 12, 10, 14, 11, 8, 9],
    team2RunsPerOver: [9, 7, 11, 10, 8, 12, 6, 9, 14, 8, 7, 10, 12, 9, 14, 8, 13, 5],
    team1Cumulative: [8, 20, 30, 36, 50, 59, 66, 74, 85, 100, 106, 114, 126, 136, 150, 161, 169, 178],
    team2Cumulative: [9, 16, 27, 37, 45, 57, 63, 72, 86, 94, 101, 111, 123, 132, 146, 154, 167, 172],
    team1Wickets: [{ over: 4, runs: 32, player: "Player 01" }, { over: 9, runs: 75, player: "Player 02" }],
    team2Wickets: [{ over: 5, runs: 42, player: "Player 01" }, { over: 9, runs: 78, player: "Player 02" }],
    partnerships: [
      { batters: "Player 01 + Player 02", runs: 42, balls: 28 },
      { batters: "Player 02 + Player 08", runs: 36, balls: 22 },
      { batters: "Player 08 + Player 04", runs: 33, balls: 24 },
      { batters: "Player 08 + Player 09", runs: 22, balls: 10 }
    ],
    requiredRunRateTimeline: [
      { over: 10, rrr: 9.2, crr: 8.6 },
      { over: 12, rrr: 9.8, crr: 8.4 },
      { over: 14, rrr: 10.5, crr: 8.5 },
      { over: 16, rrr: 12.0, crr: 8.6 },
      { over: 17, rrr: 13.5, crr: 8.65 }
    ]
  };

  const maxCumulative = Math.max(...g.team1Cumulative, ...g.team2Cumulative, 185);

  return (
    <div className="space-y-8">
      {/* 1. Manhattan Chart (Runs Per Over) */}
      <div className="bg-surface-container rounded-2xl p-6 shadow-xl border border-white/5">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="font-headline-md font-bold text-lg text-white">Manhattan Chart</h3>
            <p className="text-xs text-slate-400">Over-by-over runs comparison at RoshSpark Cricket Stadium</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-label-caps">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span className="text-slate-300">{match.team1.shortName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400"></span>
              <span className="text-slate-300">{match.team2.shortName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-300">Wicket</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end gap-1.5 sm:gap-3 pt-6 border-b border-white/10 px-2 overflow-x-auto">
          {g.overs.map((over, idx) => {
            const t1Runs = g.team1RunsPerOver[idx] || 0;
            const t2Runs = g.team2RunsPerOver[idx] || 0;
            const maxRunInOver = 20;

            const t1Height = Math.min(100, (t1Runs / maxRunInOver) * 100);
            const t2Height = Math.min(100, (t2Runs / maxRunInOver) * 100);

            const hasWicket1 = g.team1Wickets.some(w => w.over === over);
            const hasWicket2 = g.team2Wickets.some(w => w.over === over);

            return (
              <div key={over} className="flex-1 min-w-[20px] flex flex-col items-center gap-1 h-full justify-end group">
                <div className="flex items-end gap-1 w-full justify-center h-full">
                  {/* Team 1 Bar */}
                  <div 
                    className="w-2.5 sm:w-3.5 bg-blue-500/80 rounded-t-sm relative transition-all group-hover:bg-blue-400"
                    style={{ height: `${t1Height}%` }}
                    title={`${match.team1.shortName} Over ${over}: ${t1Runs} runs`}
                  >
                    {hasWicket1 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full absolute -top-3 left-1/2 -translate-x-1/2"></span>
                    )}
                  </div>
                  {/* Team 2 Bar */}
                  <div 
                    className="w-2.5 sm:w-3.5 bg-amber-400/80 rounded-t-sm relative transition-all group-hover:bg-amber-300"
                    style={{ height: `${t2Height}%` }}
                    title={`${match.team2.shortName} Over ${over}: ${t2Runs} runs`}
                  >
                    {hasWicket2 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full absolute -top-3 left-1/2 -translate-x-1/2"></span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-2">{over}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Worm Graph (Cumulative Run Progression) */}
      <div className="bg-surface-container rounded-2xl p-6 shadow-xl border border-white/5">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="font-headline-md font-bold text-lg text-white">Worm Graph (Run Progression)</h3>
            <p className="text-xs text-slate-400">Cumulative run trajectory of both innings</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-label-caps">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-500"></span>
              <span className="text-slate-300">{match.team1.shortName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-400"></span>
              <span className="text-slate-300">{match.team2.shortName}</span>
            </div>
          </div>
        </div>

        <div className="h-64 relative border-l border-b border-white/10 pt-4 pl-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
            {/* Team 1 Polyline */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={g.team1Cumulative.map((c, i) => `${(i / (g.overs.length - 1)) * 500},${200 - (c / maxCumulative) * 190}`).join(' ')}
            />
            {/* Team 2 Polyline */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              points={g.team2Cumulative.map((c, i) => `${(i / (g.overs.length - 1)) * 500},${200 - (c / maxCumulative) * 190}`).join(' ')}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: HIGHLIGHTS (Section 42)
// ----------------------------------------------------------------------
const TabHighlights = ({ match }: { match: Match }) => {
  const [playingHighlight, setPlayingHighlight] = useState<MatchHighlight | null>(null);

  const highlights: MatchHighlight[] = match.highlights?.length ? match.highlights : [
    { id: "hl-1", title: "Player 08's Massive 98m Six into the Grandstand", duration: "00:24", timestamp: "Over 16.6", category: "Best Sixes" as const, thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: "hl-2", title: "Spectacular Diving Catch by Player 01 at Deep Cover", duration: "00:32", timestamp: "Over 16.4", category: "Best Catches" as const, thumbnailUrl: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: "hl-3", title: "Crisp Cover Drive Boundary Piercing the Infield", duration: "00:18", timestamp: "Over 17.2", category: "Best Fours" as const, thumbnailUrl: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((hl) => (
          <div 
            key={hl.id} 
            onClick={() => setPlayingHighlight(hl)}
            className="group bg-surface-container rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/40 shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full bg-surface-container-high overflow-hidden">
              <img 
                src={hl.thumbnailUrl} 
                alt={hl.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl ml-0.5">play_arrow</span>
                </div>
              </div>

              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-400 font-label-caps text-[10px] uppercase font-bold border border-white/10">
                  {hl.category}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                {hl.duration}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                {hl.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-400 font-label-caps">
                <span>{hl.timestamp}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  Watch Highlight →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playback Modal */}
      {playingHighlight && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-3xl overflow-hidden max-w-3xl w-full border border-white/10 shadow-2xl animate-in zoom-in-95">
            <div className="p-4 bg-surface-container-high flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-label-caps text-[10px] font-bold uppercase">
                  {playingHighlight.category}
                </span>
                <h3 className="font-bold text-white text-sm truncate max-w-md">{playingHighlight.title}</h3>
              </div>
              <button 
                onClick={() => setPlayingHighlight(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-video w-full bg-black">
              <video 
                src={playingHighlight.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ----------------------------------------------------------------------
// TAB: INFO (Sections 48, 49, 50, 51, 52)
// ----------------------------------------------------------------------
const TabInfo = ({ match }: { match: Match }) => {
  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-headline-md font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">Match Information</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs w-1/3">Competition</td>
              <td className="py-3 font-semibold text-white">{match.tournament}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Match Number</td>
              <td className="py-3 font-semibold text-white">{match.info.matchNumber}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Format</td>
              <td className="py-3 font-semibold text-emerald-400">{match.format}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Date & Time</td>
              <td className="py-3 font-semibold text-white">{match.datetime}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Venue</td>
              <td className="py-3 font-semibold text-white">{match.venue}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Toss Decision</td>
              <td className="py-3 font-semibold text-white">{match.info.toss}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Playing Conditions</td>
              <td className="py-3 font-semibold text-emerald-400">{match.info.matchStatusText}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-headline-md font-bold text-lg mb-4 text-white border-b border-white/10 pb-2">Officials & Stadium Pitch</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs w-1/3">On-field Umpires</td>
              <td className="py-3 font-semibold text-white">{match.info.umpires}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Third Umpire</td>
              <td className="py-3 font-semibold text-white">{match.info.thirdUmpire}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Match Referee</td>
              <td className="py-3 font-semibold text-white">{match.info.matchReferee}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Pitch Report</td>
              <td className="py-3 font-semibold text-white">{match.info.pitch}</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-400 font-label-caps uppercase text-xs">Weather Report</td>
              <td className="py-3 font-semibold text-white">{match.info.weather}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// TAB: NEWS (Section 53)
// ----------------------------------------------------------------------
const TabNews = ({ match }: { match: Match }) => {
  const [readingArticle, setReadingArticle] = useState<MatchArticle | null>(null);

  const news = match.news?.length ? match.news : [
    {
      id: "news-1",
      headline: "RoshSpark Knights and Strikers Prepare for Floodlit Clashes",
      category: "Pre-Match Analysis",
      date: "18 Oct 2026",
      shortDescription: "Captain press conference details surface preparation and team combinations.",
      content: "Both teams conducted intensive net sessions under the RoshSpark floodlights today. Dew is expected to play a critical factor in the 2nd innings.",
      author: "Stadium Media Desk"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((n) => (
          <div key={n.id} className="bg-surface-container rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-label-caps uppercase font-bold">
                  {n.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{n.date}</span>
              </div>
              <h4 className="font-headline-md font-bold text-xl text-white mb-2">{n.headline}</h4>
              <p className="text-sm text-slate-300 line-clamp-3 mb-4">{n.shortDescription}</p>
            </div>
            <button 
              onClick={() => setReadingArticle(n)}
              className="text-emerald-400 font-label-caps text-xs font-bold uppercase tracking-wider self-start hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>Read Full Article</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>

      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/10 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-black font-label-caps text-xs font-bold uppercase">
                {readingArticle.category}
              </span>
              <button 
                onClick={() => setReadingArticle(null)}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <h2 className="font-headline-md text-2xl font-bold text-white mb-2">{readingArticle.headline}</h2>
            <div className="text-xs text-slate-400 font-mono mb-6">Published on {readingArticle.date} • by {readingArticle.author}</div>
            <div className="text-slate-200 text-sm leading-relaxed space-y-4">
              <p>{readingArticle.content}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ----------------------------------------------------------------------
// TAB: TICKETS (Sections 54 & 55 for Upcoming Matches)
// ----------------------------------------------------------------------
const TabTickets = ({ match }: { match: Match }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-surface-container rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-6">
        <span className="material-symbols-outlined text-5xl text-emerald-400">confirmation_number</span>
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-label-caps font-bold uppercase mb-3 inline-block">
            STADIUM TICKETS OPEN
          </span>
          <h2 className="font-headline-md text-3xl font-black text-white">
            {match.team1.name} vs {match.team2.name}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Secure verified digital QR tickets with automated turnstile admission at RoshSpark Cricket Stadium.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-surface-container-high border border-white/5">
            <span className="text-xs text-slate-400 font-label-caps uppercase block">General Admission</span>
            <span className="text-xl font-bold text-white block mt-1">North Stand</span>
            <span className="text-emerald-400 font-bold text-sm font-mono">₹{match.ticketsStartingPrice || 800}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-high border border-white/5">
            <span className="text-xs text-slate-400 font-label-caps uppercase block">Premium Tier</span>
            <span className="text-xl font-bold text-white block mt-1">South Pavilion</span>
            <span className="text-emerald-400 font-bold text-sm font-mono">₹{((match.ticketsStartingPrice || 800) * 1.8).toFixed(0)}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-high border border-white/5">
            <span className="text-xs text-slate-400 font-label-caps uppercase block">Hospitality Lounge</span>
            <span className="text-xl font-bold text-white block mt-1">West VIP Box</span>
            <span className="text-emerald-400 font-bold text-sm font-mono">₹{((match.ticketsStartingPrice || 800) * 3.5).toFixed(0)}</span>
          </div>
        </div>

        <Link 
          href={`/tickets/${match.id}`} 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-sm font-black uppercase rounded-2xl shadow-xl transition-all"
        >
          <span className="material-symbols-outlined text-lg">airplane_ticket</span>
          <span>SELECT SEATS & BUY TICKETS</span>
        </Link>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN DYNAMIC TAB CONTROLLER (Section 12.1)
// ----------------------------------------------------------------------
export default function MatchCenterTabs({ 
  match, 
  derivedStats, 
  simulateNextBall 
}: { 
  match: Match; 
  derivedStats: DerivedStats | null; 
  simulateNextBall: (forcedOutcome?: CommentaryEvent['outcome']) => any;
}) {
  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';

  // Section 12.1: Dynamic tabs based on match status
  let tabs: { id: string; label: string; isHighlighted?: boolean }[] = [];

  if (isLive) {
    tabs = [
      { id: 'summary', label: 'SUMMARY' },
      { id: 'info', label: 'INFO' },
      { id: 'live', label: 'LIVE', isHighlighted: true },
      { id: 'scorecard', label: 'SCORECARD' },
      { id: 'commentary', label: 'COMMENTARY', isHighlighted: true },
      { id: 'overs', label: 'OVERS' },
      { id: 'squads', label: 'SQUADS' },
      { id: 'partnership', label: 'PARTNERSHIP' },
      { id: 'fallOfWickets', label: 'FALL OF WICKETS' },
      { id: 'graphs', label: 'GRAPHS' },
      { id: 'highlights', label: 'HIGHLIGHTS' },
      { id: 'news', label: 'NEWS' },
    ];
  } else if (isUpcoming) {
    tabs = [
      { id: 'summary', label: 'SUMMARY' },
      { id: 'info', label: 'INFO' },
      { id: 'squads', label: 'SQUADS' },
      { id: 'news', label: 'NEWS' },
      { id: 'tickets', label: 'TICKETS', isHighlighted: true },
    ];
  } else {
    // Completed matches (no live tab)
    tabs = [
      { id: 'summary', label: 'SUMMARY' },
      { id: 'scorecard', label: 'SCORECARD' },
      { id: 'commentary', label: 'COMMENTARY' },
      { id: 'overs', label: 'OVERS' },
      { id: 'squads', label: 'SQUADS' },
      { id: 'partnership', label: 'PARTNERSHIP' },
      { id: 'fallOfWickets', label: 'FALL OF WICKETS' },
      { id: 'graphs', label: 'GRAPHS' },
      { id: 'highlights', label: 'HIGHLIGHTS' },
      { id: 'news', label: 'NEWS' },
    ];
  }

  const [activeTab, setActiveTab] = useState(isLive ? 'live' : (tabs[0]?.id || 'summary'));

  return (
    <>
      {/* Sticky Tab Navigation Strip */}
      <div className="w-full bg-surface-container-high sticky top-20 z-30 shadow-lg border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            {tabs.map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-label-caps text-xs uppercase font-bold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                      : tab.isHighlighted
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-950'
                      : 'text-slate-300 hover:text-white hover:bg-surface-container-highest'
                  }`}
                >
                  {tab.isHighlighted && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Tab Content Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 mt-8 pb-16">
        {activeTab === 'summary' && <TabSummary match={match} derivedStats={derivedStats} />}
        {activeTab === 'info' && <TabInfo match={match} />}
        {activeTab === 'live' && <TabLive match={match} derivedStats={derivedStats} simulateNextBall={simulateNextBall} />}
        {activeTab === 'scorecard' && <TabScorecard match={match} />}
        {activeTab === 'commentary' && <TabCommentary match={match} />}
        {activeTab === 'overs' && <TabOvers match={match} />}
        {activeTab === 'squads' && <TabSquads match={match} />}
        {activeTab === 'partnership' && <TabPartnership match={match} />}
        {activeTab === 'fallOfWickets' && <TabFallOfWickets match={match} />}
        {activeTab === 'graphs' && <TabGraphs match={match} />}
        {activeTab === 'highlights' && <TabHighlights match={match} />}
        {activeTab === 'news' && <TabNews match={match} />}
        {activeTab === 'tickets' && <TabTickets match={match} />}
      </div>
    </>
  );
}

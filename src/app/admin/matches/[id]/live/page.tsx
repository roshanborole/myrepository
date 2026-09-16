"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { adminEngine, LiveMatchState, BallDelivery } from '@/lib/adminStore';

export default function AdminLiveScoringPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = (typeof params?.id === 'string' ? params.id : 'match-ind-aus-live');

  const [liveState, setLiveState] = useState<LiveMatchState>(adminEngine.getLiveMatchState());
  const [activeTab, setActiveTab] = useState<'SCORING' | 'SCORECARD' | 'OVERS' | 'COMMENTARY' | 'GRAPHS'>('SCORING');
  
  // Modals state
  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
  const [wicketType, setWicketType] = useState<'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket'>('Caught');
  const [fielderName, setFielderName] = useState('Player 04');
  const [dismissedBatter, setDismissedBatter] = useState(liveState.striker.name);
  const [newBatterName, setNewBatterName] = useState('Player 10');

  const [isEditDeliveryModalOpen, setIsEditDeliveryModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<BallDelivery | null>(null);
  const [editCommentaryText, setEditCommentaryText] = useState('');

  const [isDeclareResultOpen, setIsDeclareResultOpen] = useState(false);
  const [declaredWinner, setDeclaredWinner] = useState(liveState.battingTeam);
  const [declaredMargin, setDeclaredMargin] = useState('5 wickets');
  const [declaredPotm, setDeclaredPotm] = useState(liveState.striker.name);

  const [customCommentaryInput, setCustomCommentaryInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLiveState({ ...adminEngine.getLiveMatchState() });
  }, [matchId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleScore = (outcome: BallDelivery['outcome'], runs: number, extras: number, extraType?: BallDelivery['extraType']) => {
    const updated = adminEngine.recordBall({
      outcome,
      runs,
      extras,
      isExtra: !!extraType,
      extraType,
      isWicket: false,
      customCommentary: customCommentaryInput.trim() || undefined
    });
    setLiveState({ ...updated });
    setCustomCommentaryInput('');
    showToast(`Ball Recorded: ${outcome} (${runs + extras} runs)`);
  };

  const handleWicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = adminEngine.recordBall({
      outcome: 'WICKET',
      runs: 0,
      extras: 0,
      isWicket: true,
      wicketType,
      dismissedPlayer: dismissedBatter,
      fielder: wicketType === 'Caught' || wicketType === 'Run Out' || wicketType === 'Stumped' ? fielderName : undefined,
      newBatsmanName: newBatterName,
      customCommentary: customCommentaryInput.trim() || undefined
    });
    setLiveState({ ...updated });
    setIsWicketModalOpen(false);
    setCustomCommentaryInput('');
    showToast(`WICKET Recorded: ${wicketType}! ${dismissedBatter} out`);
  };

  const handleUndo = () => {
    const updated = adminEngine.undoLastBall();
    setLiveState({ ...updated });
    showToast('Last ball undone. Statistics recalculated.');
  };

  const handleSaveEditedCommentary = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDelivery) {
      editingDelivery.commentary = editCommentaryText;
      setIsEditDeliveryModalOpen(false);
      showToast('Delivery commentary updated.');
    }
  };

  const handleDeclareResult = (e: React.FormEvent) => {
    e.preventDefault();
    adminEngine.setMatchStatus(liveState.matchId, 'COMPLETED');
    setLiveState({
      ...adminEngine.getLiveMatchState(),
      status: 'COMPLETED',
      result: {
        winner: declaredWinner,
        margin: declaredMargin,
        playerOfTheMatch: declaredPotm,
        finalSummary: `${declaredWinner} won by ${declaredMargin}. Player of the Match: ${declaredPotm}.`
      }
    });
    setIsDeclareResultOpen(false);
    showToast('Match Result Finalized & Published to public site!');
  };

  // Group deliveries into overs for OVERS tab
  const oversGrouped: Record<number, BallDelivery[]> = {};
  liveState.deliveries.forEach(d => {
    if (!oversGrouped[d.overNumber]) oversGrouped[d.overNumber] = [];
    oversGrouped[d.overNumber].push(d);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-5 py-3 rounded-xl shadow-2xl font-mono text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-base font-black">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              OFFICIAL LIVE SCORING CONTROL DESK &bull; ROSHSPARK STADIUM
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            {liveState.battingTeam} vs {liveState.bowlingTeam}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Single Source of Truth &bull; Atomic state calculations &bull; Direct public synchronization
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleUndo}
            className="px-4 py-2 rounded-xl bg-[#161a22] hover:bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
            title="Undo the last recorded delivery and revert stats"
          >
            <span className="material-symbols-outlined text-base">undo</span>
            <span>UNDO LAST BALL</span>
          </button>

          <button
            onClick={() => setIsDeclareResultOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">sports_score</span>
            <span>Conclude Match</span>
          </button>

          <Link
            href={`/matches/${liveState.matchId}`}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            <span>User Match Center</span>
          </Link>
        </div>
      </div>

      {/* 1. SCOREBOARD HERO — SYNCHRONIZED ACROSS WEBSITE */}
      <div className="bg-gradient-to-r from-[#0d121c] via-[#0e1422] to-[#121826] rounded-3xl p-6 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Score & Chase Equation */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-bold uppercase">
                2ND INNINGS &bull; {liveState.battingTeam} BATTING
              </span>
              <span className="text-xs font-mono text-slate-400">
                Target: <strong>{liveState.target}</strong>
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tight">
                {liveState.totalScore}/{liveState.wickets}
              </span>
              <span className="text-lg sm:text-2xl font-bold text-slate-400 font-mono">
                ({liveState.currentOverBall} / {liveState.totalBalls / 6} ov)
              </span>
            </div>

            {/* Chasing Equation */}
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">RUNS REQUIRED</span>
                <span className="text-emerald-400 font-black text-base">{liveState.runsRequired} runs</span>
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-slate-400 block text-[10px] uppercase">BALLS REMAINING</span>
                <span className="text-white font-black text-base">{liveState.ballsRemaining} balls</span>
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-slate-400 block text-[10px] uppercase">REQ. RUN RATE (RRR)</span>
                <span className="text-amber-400 font-black text-base">{liveState.rrr}</span>
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-slate-400 block text-[10px] uppercase">CURRENT RUN RATE (CRR)</span>
                <span className="text-slate-300 font-black text-base">{liveState.crr}</span>
              </div>
            </div>
          </div>

          {/* Active Batters & Bowler Telemetry */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* Batter Striker & Non-Striker Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Striker */}
              <div className="p-3.5 rounded-2xl bg-[#141924] border border-emerald-500/40 font-mono text-xs relative">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                  <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> STRIKER *
                  </span>
                  <span>SR: {liveState.striker.strikeRate}</span>
                </div>
                <div className="text-base font-bold text-white truncate">
                  {liveState.striker.name}
                </div>
                <div className="text-emerald-400 font-black text-lg">
                  {liveState.striker.runs} <span className="text-xs text-slate-400 font-normal">({liveState.striker.balls}b)</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  4s: {liveState.striker.fours} &bull; 6s: {liveState.striker.sixes}
                </div>
              </div>

              {/* Non-Striker */}
              <div className="p-3.5 rounded-2xl bg-[#141924] border border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                  <span className="uppercase text-slate-400">NON-STRIKER</span>
                  <span>SR: {liveState.nonStriker.strikeRate}</span>
                </div>
                <div className="text-base font-bold text-white truncate">
                  {liveState.nonStriker.name}
                </div>
                <div className="text-white font-black text-lg">
                  {liveState.nonStriker.runs} <span className="text-xs text-slate-400 font-normal">({liveState.nonStriker.balls}b)</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  4s: {liveState.nonStriker.fours} &bull; 6s: {liveState.nonStriker.sixes}
                </div>
              </div>
            </div>

            {/* Current Bowler */}
            <div className="p-3.5 rounded-2xl bg-[#141924] border border-white/10 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">CURRENT BOWLER ({liveState.bowlingTeam})</span>
                <span className="text-base font-bold text-white">{liveState.currentBowler.name}</span>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-emerald-400">
                  {liveState.currentBowler.wickets} - {liveState.currentBowler.runsConceded}
                </div>
                <div className="text-[10px] text-slate-400">
                  {liveState.currentBowler.overs} ov &bull; Econ: {liveState.currentBowler.economy}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. BALL-BY-BALL SCORING CONTROLS */}
      <div className="bg-[#0c0f16] rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">DELIVERY INPUT CONSOLE</span>
            <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight">
              BALL-BY-BALL SCORING CONTROLS
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Next ball: <strong className="text-white">Delivery {liveState.ballsBowled + 1}</strong>
          </span>
        </div>

        {/* Custom Commentary Input Box */}
        <div className="space-y-1 font-mono text-xs">
          <label className="text-slate-400 text-[10px] uppercase block">
            CUSTOM BALL-BY-BALL COMMENTARY (OPTIONAL — LEAVE BLANK FOR AUTO-GENERATED COMMENTARY):
          </label>
          <input
            type="text"
            value={customCommentaryInput}
            onChange={e => setCustomCommentaryInput(e.target.value)}
            placeholder="e.g. Smashed through cover point! Player 08 times it to perfection."
            className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        {/* Scoring Buttons Grid */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            LEGAL RUN DELIVERIES:
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <button
              onClick={() => handleScore('DOT BALL', 0, 0)}
              className="py-4 rounded-2xl bg-[#141924] hover:bg-[#1a2130] border border-white/10 hover:border-slate-400 text-white font-mono text-sm font-black uppercase transition-all shadow-md active:scale-95"
            >
              DOT BALL (0)
            </button>
            <button
              onClick={() => handleScore('1 RUN', 1, 0)}
              className="py-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-black uppercase transition-all shadow-md active:scale-95"
            >
              1 RUN
            </button>
            <button
              onClick={() => handleScore('2 RUNS', 2, 0)}
              className="py-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-black uppercase transition-all shadow-md active:scale-95"
            >
              2 RUNS
            </button>
            <button
              onClick={() => handleScore('3 RUNS', 3, 0)}
              className="py-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-black uppercase transition-all shadow-md active:scale-95"
            >
              3 RUNS
            </button>
            <button
              onClick={() => handleScore('FOUR', 4, 0)}
              className="py-4 rounded-2xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/50 text-blue-300 font-mono text-sm font-black uppercase transition-all shadow-lg active:scale-95"
            >
              FOUR (4)
            </button>
            <button
              onClick={() => handleScore('SIX', 6, 0)}
              className="py-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/50 text-purple-200 font-mono text-sm font-black uppercase transition-all shadow-lg active:scale-95"
            >
              SIX (6)
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold pt-2">
            EXTRAS &amp; WICKETS:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => handleScore('WIDE', 0, 1, 'WIDE')}
              className="py-3.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-black uppercase transition-all active:scale-95"
            >
              WIDE (+1 Ex)
            </button>
            <button
              onClick={() => handleScore('NO BALL', 0, 1, 'NO BALL')}
              className="py-3.5 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-black uppercase transition-all active:scale-95"
            >
              NO BALL (+1 Ex)
            </button>
            <button
              onClick={() => handleScore('BYE', 0, 1, 'BYE')}
              className="py-3.5 rounded-2xl bg-[#141924] hover:bg-[#1e2536] border border-white/10 text-slate-300 font-mono text-xs font-black uppercase transition-all active:scale-95"
            >
              BYE (1B)
            </button>
            <button
              onClick={() => handleScore('LEG BYE', 0, 1, 'LEG BYE')}
              className="py-3.5 rounded-2xl bg-[#141924] hover:bg-[#1e2536] border border-white/10 text-slate-300 font-mono text-xs font-black uppercase transition-all active:scale-95"
            >
              LEG BYE (1LB)
            </button>
            <button
              onClick={() => {
                setDismissedBatter(liveState.striker.name);
                setIsWicketModalOpen(true);
              }}
              className="py-3.5 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 font-mono text-xs font-black uppercase transition-all shadow-xl active:scale-95 col-span-2 sm:col-span-1"
            >
              WICKET (W)
            </button>
          </div>
        </div>

        {/* Change Batter / Bowler Quick Pickers */}
        <div className="pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="text-slate-400 text-[10px] uppercase block mb-1">SWITCH STRIKER:</label>
            <input
              type="text"
              value={liveState.striker.name}
              onChange={e => {
                adminEngine.updateStriker(e.target.value);
                setLiveState({ ...adminEngine.getLiveMatchState() });
              }}
              className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[10px] uppercase block mb-1">SWITCH NON-STRIKER:</label>
            <input
              type="text"
              value={liveState.nonStriker.name}
              onChange={e => {
                adminEngine.updateNonStriker(e.target.value);
                setLiveState({ ...adminEngine.getLiveMatchState() });
              }}
              className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[10px] uppercase block mb-1">SWITCH CURRENT BOWLER:</label>
            <input
              type="text"
              value={liveState.currentBowler.name}
              onChange={e => {
                adminEngine.updateBowler(e.target.value);
                setLiveState({ ...adminEngine.getLiveMatchState() });
              }}
              className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. TABS: SCORING LOG & AUDIT / SCORECARD / OVERS / GRAPHS */}
      <div className="bg-[#0c0f16] rounded-3xl border border-white/[0.08] shadow-xl overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-white/[0.08] overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: 'SCORING', label: 'Recent Ball Feed' },
            { id: 'SCORECARD', label: 'Live Scorecard' },
            { id: 'OVERS', label: 'Overs Breakdown' },
            { id: 'COMMENTARY', label: 'Ball-by-Ball Commentary' },
            { id: 'GRAPHS', label: 'Match Graphs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-4 font-bold uppercase transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Recent Ball Feed */}
        {activeTab === 'SCORING' && (
          <div className="p-6 space-y-3 font-mono text-xs">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider pb-2">
              SHOWING LATEST DELIVERIES SCORING LOG (TOTAL: {liveState.deliveries.length} RECORDED)
            </div>
            {liveState.deliveries.slice(0, 10).map((del, idx) => (
              <div key={del.id || idx} className="p-3.5 rounded-2xl bg-[#121620] border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black text-emerald-400 font-black text-xs">
                    {del.overBall}
                  </span>
                  <div>
                    <div className="text-white font-bold">
                      {del.bowler} to {del.striker}: <span className="text-emerald-400">{del.outcome}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] font-sans truncate max-w-lg">
                      {del.commentary}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px] hidden sm:inline">{del.timestamp}</span>
                  <button
                    onClick={() => {
                      setEditingDelivery(del);
                      setEditCommentaryText(del.commentary);
                      setIsEditDeliveryModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#1a2130] text-slate-300 hover:text-white hover:bg-emerald-500 hover:text-black transition-colors"
                    title="Edit Commentary"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Live Scorecard Preview */}
        {activeTab === 'SCORECARD' && (
          <div className="p-6 space-y-6 font-mono text-xs">
            <div>
              <h4 className="text-sm font-bold text-white uppercase mb-3">Batting Scorecard — {liveState.battingTeam}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                      <th className="pb-2">BATTER</th>
                      <th className="pb-2 text-right">R</th>
                      <th className="pb-2 text-right">B</th>
                      <th className="pb-2 text-right">4s</th>
                      <th className="pb-2 text-right">6s</th>
                      <th className="pb-2 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="text-white">
                      <td className="py-2.5 font-bold text-emerald-400">{liveState.striker.name} *</td>
                      <td className="py-2.5 text-right font-black">{liveState.striker.runs}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.striker.balls}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.striker.fours}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.striker.sixes}</td>
                      <td className="py-2.5 text-right text-slate-300">{liveState.striker.strikeRate}</td>
                    </tr>
                    <tr className="text-white">
                      <td className="py-2.5 font-bold">{liveState.nonStriker.name}</td>
                      <td className="py-2.5 text-right font-black">{liveState.nonStriker.runs}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.nonStriker.balls}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.nonStriker.fours}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.nonStriker.sixes}</td>
                      <td className="py-2.5 text-right text-slate-300">{liveState.nonStriker.strikeRate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase mb-3">Bowling Figures — {liveState.bowlingTeam}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                      <th className="pb-2">BOWLER</th>
                      <th className="pb-2 text-right">O</th>
                      <th className="pb-2 text-right">M</th>
                      <th className="pb-2 text-right">R</th>
                      <th className="pb-2 text-right">W</th>
                      <th className="pb-2 text-right">ECON</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="text-white">
                      <td className="py-2.5 font-bold">{liveState.currentBowler.name}</td>
                      <td className="py-2.5 text-right text-slate-300">{liveState.currentBowler.overs}</td>
                      <td className="py-2.5 text-right text-slate-400">{liveState.currentBowler.maidens}</td>
                      <td className="py-2.5 text-right text-slate-300">{liveState.currentBowler.runsConceded}</td>
                      <td className="py-2.5 text-right font-black text-emerald-400">{liveState.currentBowler.wickets}</td>
                      <td className="py-2.5 text-right text-slate-300">{liveState.currentBowler.economy}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fall of Wickets */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase mb-2">Fall of Wickets</h4>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {liveState.fallOfWickets.map(fow => (
                  <span key={fow.wicket} className="px-2.5 py-1 rounded-lg bg-[#141924] border border-white/5 text-slate-300">
                    <strong className="text-white">{fow.score}/{fow.wicket}</strong> ({fow.player}, {fow.over} ov)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Overs Breakdown */}
        {activeTab === 'OVERS' && (
          <div className="p-6 space-y-4 font-mono text-xs">
            <div className="text-slate-400 text-[10px] uppercase tracking-wider">
              OVER-BY-OVER PROGRESSION ACROSS MATCH
            </div>

            <div className="space-y-3">
              {Object.keys(oversGrouped).sort((a, b) => Number(b) - Number(a)).map(overIdx => {
                const overDeliveries = oversGrouped[Number(overIdx)];
                const overTotalRuns = overDeliveries.reduce((sum, d) => sum + d.runs + d.extras, 0);
                const overWickets = overDeliveries.filter(d => d.isWicket).length;
                return (
                  <div key={overIdx} className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">OVER {Number(overIdx) + 1}</span>
                      <span className="text-emerald-400 font-bold">
                        {overTotalRuns} runs &bull; {overWickets} wicket{overWickets !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {overDeliveries.map((del, i) => (
                        <span 
                          key={i} 
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                            del.isWicket 
                              ? 'bg-red-500 text-white' 
                              : del.runs === 4 || del.runs === 6 
                              ? 'bg-emerald-500 text-black' 
                              : 'bg-black text-slate-300'
                          }`}
                        >
                          {del.isWicket ? 'W' : del.runs + del.extras}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Ball-by-Ball Commentary */}
        {activeTab === 'COMMENTARY' && (
          <div className="p-6 space-y-3 font-mono text-xs">
            {liveState.deliveries.map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black text-emerald-400 font-black">{d.overBall}</span>
                    <span className="font-bold text-white">{d.bowler} to {d.striker}</span>
                    <span className="text-emerald-400 font-bold">&bull; {d.outcome}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{d.timestamp}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs pt-1">{d.commentary}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Match Graphs */}
        {activeTab === 'GRAPHS' && (
          <div className="p-6 space-y-6 font-mono text-xs">
            <div>
              <h4 className="text-sm font-bold text-white uppercase mb-2">Manhattan Over-by-Over Chart</h4>
              <div className="h-48 bg-[#090b10] rounded-2xl p-4 border border-white/5 flex items-end gap-2 overflow-x-auto">
                {liveState.manhattanData.map(m => (
                  <div key={m.over} className="flex-1 min-w-[28px] flex flex-col items-center gap-1 group">
                    <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100">{m.runs}</span>
                    <div 
                      className={`w-full rounded-t-md transition-all ${m.wickets > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ height: `${Math.min(100, m.runs * 6)}%` }}
                    ></div>
                    <span className="text-[9px] text-slate-500">{m.over}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase mb-2">Chasing Trajectory (Worm Curve)</h4>
              <div className="p-4 bg-[#090b10] rounded-2xl border border-white/5 text-slate-400 text-xs">
                Score progressed to <strong className="text-white">{liveState.totalScore} runs</strong> after {liveState.currentOverBall} overs. Required {liveState.runsRequired} runs from {liveState.ballsRemaining} balls.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* WICKET MODAL */}
      {isWicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-[#121620] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsWicketModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <div>
              <span className="text-[10px] text-red-400 uppercase font-bold tracking-widest">WICKET DISMISSAL DETAILS</span>
              <h3 className="text-lg font-bold text-white mt-1">Record Fall of Wicket</h3>
            </div>

            <form onSubmit={handleWicketSubmit} className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">DISMISSED BATTER</label>
                <select
                  value={dismissedBatter}
                  onChange={e => setDismissedBatter(e.target.value)}
                  className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value={liveState.striker.name}>{liveState.striker.name} (Striker)</option>
                  <option value={liveState.nonStriker.name}>{liveState.nonStriker.name} (Non-Striker)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">DISMISSAL TYPE</label>
                <select
                  value={wicketType}
                  onChange={e => setWicketType(e.target.value as any)}
                  className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Caught">Caught</option>
                  <option value="Bowled">Bowled</option>
                  <option value="LBW">LBW</option>
                  <option value="Run Out">Run Out</option>
                  <option value="Stumped">Stumped</option>
                  <option value="Hit Wicket">Hit Wicket</option>
                </select>
              </div>

              {(wicketType === 'Caught' || wicketType === 'Run Out' || wicketType === 'Stumped') && (
                <div>
                  <label className="text-slate-400 text-[10px] uppercase block mb-1">FIELDER INVOLVED</label>
                  <input
                    type="text"
                    value={fielderName}
                    onChange={e => setFielderName(e.target.value)}
                    placeholder="e.g. Player 04"
                    className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">NEW INCOMING BATTER NAME</label>
                <input
                  type="text"
                  required
                  value={newBatterName}
                  onChange={e => setNewBatterName(e.target.value)}
                  placeholder="e.g. Player 10"
                  className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWicketModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1e2432] text-slate-300 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase shadow-lg"
                >
                  Confirm Wicket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMMENTARY MODAL */}
      {isEditDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-[#121620] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsEditDeliveryModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">EDIT COMMENTARY TEXT</span>
              <h3 className="text-lg font-bold text-white mt-1">Delivery {editingDelivery?.overBall}</h3>
            </div>

            <form onSubmit={handleSaveEditedCommentary} className="space-y-3">
              <textarea
                rows={3}
                value={editCommentaryText}
                onChange={e => setEditCommentaryText(e.target.value)}
                className="w-full bg-[#090b10] border border-white/10 rounded-xl p-3 text-white font-sans text-xs focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditDeliveryModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1e2432] text-slate-300 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase"
                >
                  Save Text
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONCLUDE MATCH RESULT MODAL */}
      {isDeclareResultOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-[#121620] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsDeclareResultOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <div>
              <span className="text-[10px] text-purple-400 uppercase font-bold tracking-widest">OFFICIAL RESULT PUBLISHER</span>
              <h3 className="text-lg font-bold text-white mt-1">Conclude Match &amp; Publish Result</h3>
            </div>

            <form onSubmit={handleDeclareResult} className="space-y-3">
              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">WINNING TEAM</label>
                <select
                  value={declaredWinner}
                  onChange={e => setDeclaredWinner(e.target.value)}
                  className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value={liveState.battingTeam}>{liveState.battingTeam}</option>
                  <option value={liveState.bowlingTeam}>{liveState.bowlingTeam}</option>
                  <option value="Match Tied">Match Tied</option>
                  <option value="No Result">No Result / Abandoned</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">WINNING MARGIN</label>
                <input
                  type="text"
                  value={declaredMargin}
                  onChange={e => setDeclaredMargin(e.target.value)}
                  placeholder="e.g. 5 wickets or 23 runs"
                  className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">PLAYER OF THE MATCH</label>
                <input
                  type="text"
                  value={declaredPotm}
                  onChange={e => setDeclaredPotm(e.target.value)}
                  placeholder="e.g. Player 08"
                  className="w-full bg-[#090b10] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeclareResultOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1e2432] text-slate-300 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase shadow-lg"
                >
                  Publish Final Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

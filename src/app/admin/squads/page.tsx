'use client';

import React, { useState } from 'react';
import { CENTRAL_PLAYERS, CentralPlayer } from '@/lib/centralData';
import { adminEngine } from '@/lib/adminStore';

interface SquadMember extends CentralPlayer {
  isCaptain?: boolean;
  isWicketkeeper?: boolean;
}

export default function AdminSquadsPage() {
  const matches = adminEngine.getMatches();
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || 'm-live-01');
  const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2'>('team1');

  const currentMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const teamName = selectedTeam === 'team1' ? currentMatch.team1 : currentMatch.team2;

  // Filter players for this team or default pool
  const teamPlayers = CENTRAL_PLAYERS.filter(p => p.teamName === teamName || (teamName === 'India' && p.teamName === 'India') || (teamName === 'Australia' && p.teamName === 'Australia'));
  const pool = teamPlayers.length >= 15 ? teamPlayers : CENTRAL_PLAYERS.slice(0, 16);

  const [playingXI, setPlayingXI] = useState<SquadMember[]>(() =>
    pool.slice(0, 11).map((p, idx) => ({
      ...p,
      isCaptain: idx === 0,
      isWicketkeeper: idx === 2
    }))
  );

  const [bench, setBench] = useState<SquadMember[]>(() =>
    pool.slice(11, 15).map(p => ({ ...p }))
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const moveToBench = (player: SquadMember) => {
    if (playingXI.length <= 1) {
      alert('Playing XI must have players');
      return;
    }
    setPlayingXI(playingXI.filter(p => p.id !== player.id));
    setBench([...bench, { ...player, isCaptain: false, isWicketkeeper: false }]);
  };

  const moveToPlayingXI = (player: SquadMember) => {
    if (playingXI.length >= 11) {
      alert('Playing XI already has 11 players! Swap or demote a player to bench first.');
      return;
    }
    setBench(bench.filter(p => p.id !== player.id));
    setPlayingXI([...playingXI, { ...player }]);
  };

  const toggleCaptain = (playerId: string) => {
    setPlayingXI(playingXI.map(p => ({
      ...p,
      isCaptain: p.id === playerId ? !p.isCaptain : false
    })));
  };

  const toggleWicketkeeper = (playerId: string) => {
    setPlayingXI(playingXI.map(p => ({
      ...p,
      isWicketkeeper: p.id === playerId ? !p.isWicketkeeper : false
    })));
  };

  const handleSaveLineup = () => {
    if (playingXI.length !== 11) {
      alert(`Playing XI must have exactly 11 players! Currently selected: ${playingXI.length}`);
      return;
    }
    const hasCaptain = playingXI.some(p => p.isCaptain);
    if (!hasCaptain) {
      alert('Please assign a Captain (C) to your Playing XI.');
      return;
    }
    adminEngine.logActivity('SQUAD_UPDATED', `Official Playing XI confirmed for ${teamName} in match ${currentMatch.title}`);
    showToast(`Official Playing XI for ${teamName} confirmed and locked!`);
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
            Squad & Playing XI Selection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pick Playing XI lineup, nominate match captain (C) and wicketkeeper (WK), and designate substitute bench.
          </p>
        </div>
        <button
          onClick={handleSaveLineup}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Lock & Publish Lineup
        </button>
      </div>

      {/* Match & Team Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div>
          <label className="block text-slate-400 mb-1.5 text-xs font-semibold">Select Match Fixture</label>
          <select
            value={selectedMatchId}
            onChange={e => setSelectedMatchId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
          >
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.series} • {m.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1.5 text-xs font-semibold">Select Team Squad</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedTeam('team1')}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all border ${
                selectedTeam === 'team1'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {currentMatch.team1} (Home)
            </button>
            <button
              onClick={() => setSelectedTeam('team2')}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all border ${
                selectedTeam === 'team2'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {currentMatch.team2} (Away)
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Column Layout: Playing XI vs Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playing XI Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Playing XI</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                playingXI.length === 11 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {playingXI.length}/11 Selected
              </span>
            </h2>
            <span className="text-[11px] text-slate-400">Click badges to toggle (C) Captain or (WK) Wicketkeeper</span>
          </div>

          <div className="space-y-2">
            {playingXI.map((player, index) => (
              <div
                key={player.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                    {index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                    {player.jersey}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      {player.name}
                      {player.isCaptain && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[10px]">
                          C
                        </span>
                      )}
                      {player.isWicketkeeper && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500 text-white font-black text-[10px]">
                          WK
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {player.role} • {player.battingStyle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCaptain(player.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                      player.isCaptain
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    (C)
                  </button>
                  <button
                    onClick={() => toggleWicketkeeper(player.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                      player.isWicketkeeper
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    (WK)
                  </button>
                  <button
                    onClick={() => moveToBench(player)}
                    className="p-1 text-slate-500 hover:text-amber-400 rounded hover:bg-slate-800"
                    title="Demote to Bench"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bench Reserves Column (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Bench Reserves</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-400">
                {bench.length}
              </span>
            </h2>
          </div>

          <div className="space-y-2">
            {bench.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No bench reserves. Demote players from Playing XI to populate.
              </div>
            ) : (
              bench.map(player => (
                <div
                  key={player.id}
                  className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/60 flex items-center justify-between hover:border-slate-700"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-400">
                      {player.jersey}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 text-xs">{player.name}</div>
                      <div className="text-[10px] text-slate-400">{player.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => moveToPlayingXI(player)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-all"
                  >
                    + XI
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { CENTRAL_PLAYERS, CentralPlayer, PlayerRole } from '@/lib/centralData';
import { adminEngine } from '@/lib/adminStore';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<CentralPlayer[]>(CENTRAL_PLAYERS);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    shortName: '',
    jersey: 18,
    role: 'Batter' as PlayerRole,
    teamName: 'India',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    age: 26,
    nationality: 'Indian'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPlayers = players.filter(p => {
    const matchesRole = roleFilter === 'ALL' || p.role === roleFilter;
    const matchesTeam = teamFilter === 'ALL' || p.teamName === teamFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortName.toLowerCase().includes(search.toLowerCase()) ||
      p.jersey.toString().includes(search);
    return matchesRole && matchesTeam && matchesSearch;
  });

  const handleDeletePlayer = (id: string, name: string) => {
    if (confirm(`Remove player "${name}" from stadium roster?`)) {
      setPlayers(players.filter(p => p.id !== id));
      adminEngine.logActivity('PLAYER_DELETED', `Player "${name}" deleted from roster`);
      showToast(`Player "${name}" removed`);
    }
  };

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CentralPlayer = {
      id: `p-${Date.now()}`,
      name: newPlayer.name,
      shortName: newPlayer.shortName || newPlayer.name.split(' ')[0],
      jersey: Number(newPlayer.jersey),
      role: newPlayer.role,
      teamId: newPlayer.teamName.toLowerCase().slice(0, 3),
      teamName: newPlayer.teamName,
      age: Number(newPlayer.age),
      dob: '1998-05-15',
      nationality: newPlayer.nationality,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      battingStyle: newPlayer.battingStyle,
      bowlingStyle: newPlayer.bowlingStyle,
      stadiumStats: {
        matches: 0,
        innings: 0,
        runs: 0,
        highestScore: '0',
        average: 0,
        strikeRate: 0,
        centuries: 0,
        fifties: 0,
        fours: 0,
        sixes: 0,
        oversBowled: 0,
        wickets: 0,
        runsConceded: 0,
        economy: 0,
        bowlingAverage: 0,
        bestFigures: '0/0',
        maidens: 0,
        dotBalls: 0,
        catches: 0,
        runOuts: 0,
        stumpings: 0,
        allRounderRating: 50
      },
      recentForm: [],
      achievements: ['Registered at RoshSpark Cricket Stadium']
    };

    setPlayers([created, ...players]);
    adminEngine.logActivity('PLAYER_ADDED', `Player "${created.name}" (#${created.jersey}) added to ${created.teamName}`);
    setShowAddModal(false);
    showToast(`Player "${created.name}" added successfully!`);
  };

  const roleBadge = (role: PlayerRole) => {
    switch (role) {
      case 'Batter':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Batter</span>;
      case 'Bowler':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Bowler</span>;
      case 'All-rounder':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">All-rounder</span>;
      case 'Wicketkeeper':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Wicketkeeper</span>;
    }
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
            Player Roster & Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage player credentials, jersey allocations, and official performance profiles at RoshSpark Stadium.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Player
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Search by player name or jersey #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="Batter">Batters</option>
            <option value="Bowler">Bowlers</option>
            <option value="All-rounder">All-rounders</option>
            <option value="Wicketkeeper">Wicketkeepers</option>
          </select>
        </div>

        <div>
          <select
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Teams</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="England">England</option>
            <option value="South Africa">South Africa</option>
          </select>
        </div>
      </div>

      {/* Players Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Player</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4">Style</th>
              <th className="py-3 px-4">RoshSpark Stats (Runs/Wkts)</th>
              <th className="py-3 px-4">Average</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">
                  No players found matching your query.
                </td>
              </tr>
            ) : (
              filteredPlayers.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-400">
                        {p.jersey}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">Age: {p.age} • {p.nationality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{roleBadge(p.role)}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-200">{p.teamName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300">{p.battingStyle}</div>
                    <div className="text-[11px] text-slate-500">{p.bowlingStyle}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-200 font-bold">
                      {p.stadiumStats.runs} runs / {p.stadiumStats.wickets} wkts
                    </div>
                    <div className="text-[11px] text-slate-400">{p.stadiumStats.matches} matches played</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-emerald-400 font-bold">{p.stadiumStats.average}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDeletePlayer(p.id, p.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Player"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Register New Player
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPlayerSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jasprit Bumrah"
                    value={newPlayer.name}
                    onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Jersey #</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    value={newPlayer.jersey}
                    onChange={e => setNewPlayer({ ...newPlayer, jersey: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Role</label>
                  <select
                    value={newPlayer.role}
                    onChange={e => setNewPlayer({ ...newPlayer, role: e.target.value as PlayerRole })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Batter">Batter</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Team</label>
                  <select
                    value={newPlayer.teamName}
                    onChange={e => setNewPlayer({ ...newPlayer, teamName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="England">England</option>
                    <option value="South Africa">South Africa</option>
                    <option value="RoshSpark Titans">RoshSpark Titans</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Batting Style</label>
                  <input
                    type="text"
                    value={newPlayer.battingStyle}
                    onChange={e => setNewPlayer({ ...newPlayer, battingStyle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Bowling Style</label>
                  <input
                    type="text"
                    value={newPlayer.bowlingStyle}
                    onChange={e => setNewPlayer({ ...newPlayer, bowlingStyle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Age</label>
                  <input
                    type="number"
                    value={newPlayer.age}
                    onChange={e => setNewPlayer({ ...newPlayer, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nationality</label>
                  <input
                    type="text"
                    value={newPlayer.nationality}
                    onChange={e => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                >
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

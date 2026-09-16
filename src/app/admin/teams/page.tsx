'use client';

import React, { useState } from 'react';
import { CENTRAL_TEAMS, Team } from '@/lib/centralData';
import { adminEngine } from '@/lib/adminStore';

interface AdminTeamItem extends Team {
  squadCount: number;
  matchesPlayed: number;
  winsAtStadium: number;
  captain: string;
  coach: string;
}

export default function AdminTeamsPage() {
  const initialTeams: AdminTeamItem[] = [
    {
      id: 't-ind',
      name: 'India',
      shortName: 'IND',
      color: '#1d4ed8',
      secondaryColor: '#f97316',
      squadCount: 16,
      matchesPlayed: 24,
      winsAtStadium: 18,
      captain: 'Player 08',
      coach: 'Rahul Dravid'
    },
    {
      id: 't-aus',
      name: 'Australia',
      shortName: 'AUS',
      color: '#eab308',
      secondaryColor: '#15803d',
      squadCount: 15,
      matchesPlayed: 19,
      winsAtStadium: 11,
      captain: 'Player 03',
      coach: 'Andrew McDonald'
    },
    {
      id: 't-eng',
      name: 'England',
      shortName: 'ENG',
      color: '#dc2626',
      secondaryColor: '#1e3a8a',
      squadCount: 15,
      matchesPlayed: 14,
      winsAtStadium: 8,
      captain: 'Jos Buttler',
      coach: 'Brendon McCullum'
    },
    {
      id: 't-sa',
      name: 'South Africa',
      shortName: 'SA',
      color: '#15803d',
      secondaryColor: '#eab308',
      squadCount: 15,
      matchesPlayed: 12,
      winsAtStadium: 7,
      captain: 'Aiden Markram',
      coach: 'Rob Walter'
    },
    {
      id: 't-rst',
      name: 'RoshSpark Titans',
      shortName: 'RST',
      color: '#10b981',
      secondaryColor: '#064e3b',
      squadCount: 18,
      matchesPlayed: 32,
      winsAtStadium: 25,
      captain: 'Player 01',
      coach: 'Gary Kirsten'
    },
    {
      id: 't-msp',
      name: 'Mumbai Spark',
      shortName: 'MSP',
      color: '#0284c7',
      secondaryColor: '#f59e0b',
      squadCount: 18,
      matchesPlayed: 30,
      winsAtStadium: 21,
      captain: 'Player 05',
      coach: 'Mark Boucher'
    }
  ];

  const [teams, setTeams] = useState<AdminTeamItem[]>(initialTeams);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    shortName: '',
    color: '#10b981',
    captain: '',
    coach: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminTeamItem = {
      id: `t-${Date.now()}`,
      name: newTeam.name,
      shortName: newTeam.shortName.toUpperCase(),
      color: newTeam.color,
      squadCount: 15,
      matchesPlayed: 0,
      winsAtStadium: 0,
      captain: newTeam.captain || 'To be nominated',
      coach: newTeam.coach || 'Head Coach'
    };
    setTeams([...teams, created]);
    adminEngine.logActivity('TEAM_CREATED', `Team "${created.name}" (${created.shortName}) registered in RoshSpark database`);
    setShowAddModal(false);
    setNewTeam({ name: '', shortName: '', color: '#10b981', captain: '', coach: '' });
    showToast(`Team "${created.name}" registered successfully!`);
  };

  const handleDeleteTeam = (id: string, name: string) => {
    if (confirm(`Remove team "${name}" from tournament database?`)) {
      setTeams(teams.filter(t => t.id !== id));
      adminEngine.logActivity('TEAM_DELETED', `Team "${name}" removed from database`);
      showToast(`Team "${name}" deleted`);
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
            Team Directory & Franchises
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage participating international teams and domestic franchises playing at RoshSpark Cricket Stadium.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New Team
        </button>
      </div>

      {/* Quick Search */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search teams by name or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filteredTeams.length}</span> registered teams
        </div>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map(team => {
          const winRate = team.matchesPlayed > 0 ? ((team.winsAtStadium / team.matchesPlayed) * 100).toFixed(0) : '0';
          return (
            <div
              key={team.id}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-md"
                      style={{ backgroundColor: `${team.color}25`, color: team.color, border: `1px solid ${team.color}50` }}
                    >
                      {team.shortName}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                        {team.name}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Captain: <span className="text-slate-200 font-medium">{team.captain}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Team"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Team Details & Stats at RoshSpark */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">Squad</div>
                    <div className="text-sm font-bold text-white mt-0.5">{team.squadCount} players</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">RoshSpark Mat</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{team.matchesPlayed}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400">Win Rate</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">{winRate}%</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Head Coach: <span className="text-slate-300">{team.coach}</span></span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }}></span>
                    Kit Color
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Register New Team
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Team Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Zealand, Chennai Kings"
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Short Code (3-4 chars)</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. NZ"
                    value={newTeam.shortName}
                    onChange={e => setNewTeam({ ...newTeam, shortName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Primary Kit Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newTeam.color}
                      onChange={e => setNewTeam({ ...newTeam, color: e.target.value })}
                      className="w-10 h-9 rounded bg-slate-950 border border-slate-800 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={newTeam.color}
                      onChange={e => setNewTeam({ ...newTeam, color: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Captain Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kane Williamson"
                  value={newTeam.captain}
                  onChange={e => setNewTeam({ ...newTeam, captain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Head Coach</label>
                <input
                  type="text"
                  placeholder="e.g. Gary Stead"
                  value={newTeam.coach}
                  onChange={e => setNewTeam({ ...newTeam, coach: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
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
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

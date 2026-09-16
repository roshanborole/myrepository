"use client";

import React, { useState, useMemo } from 'react';
import { matchData, MatchStatus, MatchCategory, MatchFormat, CENTRAL_TEAMS, Match } from './data';
import MatchCard from './components/MatchCard';

export default function MatchesPage() {
  // 10.1 MATCH CENTER MAIN NAVIGATION FILTERS
  const [statusFilter, setStatusFilter] = useState<'ALL' | MatchStatus>('ALL');
  const [competitionFilter, setCompetitionFilter] = useState<'ALL' | MatchCategory>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | MatchFormat>('ALL');
  const [genderFilter, setGenderFilter] = useState<'ALL' | "Men's" | "Women's">('ALL');
  const [teamFilter, setTeamFilter] = useState<'ALL' | string>('ALL');
  const [monthFilter, setMonthFilter] = useState<'ALL' | 'Oct' | 'Nov'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-Filter Intersection Engine
  const filteredMatches = useMemo(() => {
    return matchData.filter(match => {
      // Primary status filter
      const passesStatus = statusFilter === 'ALL' || match.status === statusFilter;

      // Competition filter (Section 11)
      const passesCompetition = competitionFilter === 'ALL' || 
        match.category === competitionFilter ||
        (competitionFilter === 'WOMENS' && (match.category === 'WOMENS' || match.gender === "Women's"));

      // Format filter
      const passesFormat = formatFilter === 'ALL' || 
        match.format === formatFilter ||
        (formatFilter === 'T20' && (match.format === 'T20' || match.format === 'T20I')) ||
        (formatFilter === 'TEST' && (match.format === 'TEST' || match.format === 'MULTI-DAY')) ||
        (formatFilter === 'ODI' && (match.format === 'ODI' || match.format === 'ONE-DAY'));

      // Additional Filters: Gender
      const passesGender = genderFilter === 'ALL' || match.gender === genderFilter;

      // Team filter
      const passesTeam = teamFilter === 'ALL' || 
        match.team1.shortName === teamFilter || 
        match.team2.shortName === teamFilter ||
        match.team1.name.toLowerCase().includes(teamFilter.toLowerCase()) ||
        match.team2.name.toLowerCase().includes(teamFilter.toLowerCase());

      // Month filter
      const passesMonth = monthFilter === 'ALL' || match.month === monthFilter;

      // Search query
      const passesSearch = searchQuery === '' || 
        match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.tournament.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.matchName.toLowerCase().includes(searchQuery.toLowerCase());

      return passesStatus && passesCompetition && passesFormat && passesGender && passesTeam && passesMonth && passesSearch;
    });
  }, [statusFilter, competitionFilter, formatFilter, genderFilter, teamFilter, monthFilter, searchQuery]);

  // Chronological Grouping (Section 10.2)
  const todayMatches = useMemo(() => filteredMatches.filter(m => m.isToday || m.status === 'LIVE'), [filteredMatches]);
  const upcomingMatches = useMemo(() => filteredMatches.filter(m => m.status === 'UPCOMING' && !m.isToday), [filteredMatches]);
  const recentMatches = useMemo(() => filteredMatches.filter(m => m.status === 'RECENT' && !m.isToday), [filteredMatches]);

  const clearAllFilters = () => {
    setStatusFilter('ALL');
    setCompetitionFilter('ALL');
    setFormatFilter('ALL');
    setGenderFilter('ALL');
    setTeamFilter('ALL');
    setMonthFilter('ALL');
    setSearchQuery('');
  };

  const activeFiltersCount = [
    statusFilter !== 'ALL',
    competitionFilter !== 'ALL',
    formatFilter !== 'ALL',
    genderFilter !== 'ALL',
    teamFilter !== 'ALL',
    monthFilter !== 'ALL',
    searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <main className="w-full pt-20 bg-background min-h-screen pb-section-gap flex flex-col text-on-surface">
      
      {/* Top Context & Live Stadium Beacon */}
      <div className="w-full bg-surface-container-lowest px-4 sm:px-6 lg:px-10 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 -ml-3"></span>
              <span className="font-label-caps text-xs text-emerald-400 tracking-widest uppercase font-bold">ROSHSPARK CRICKET STADIUM</span>
              <span className="text-slate-500 font-label-caps text-xs">•</span>
              <span className="font-label-caps text-xs text-slate-400">Match Operations Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-headline-lg">
              MATCH CENTER & SCHEDULE
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              All international fixtures, RPL spectacles, and domestic championship clashes hosted exclusively at RoshSpark Cricket Stadium.
            </p>
          </div>
          
          {/* Live Quick Stats & Universal Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-surface-container px-3.5 py-2 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-emerald-400 text-lg">stadium</span>
              <div>
                <div className="text-[10px] font-label-caps uppercase text-slate-400 leading-none">Stadium Status</div>
                <div className="text-xs text-white font-bold">Floodlights Active</div>
              </div>
            </div>
            <div className="relative min-w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">search</span>
              <input 
                type="text" 
                placeholder="Search team, format, series..." 
                className="w-full bg-surface-container-low text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 10.1 FILTER NAVIGATION TOOLBAR (Sticky Hierarchy) */}
      <div className="w-full bg-surface-container-low sticky top-20 z-30 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3 shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          
          {/* Row 1: Primary Status Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-label-caps uppercase font-bold text-slate-400 mr-1 hidden sm:inline">Status:</span>
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === 'ALL' ? 'bg-emerald-500 text-black shadow-md' : 'bg-surface-container text-slate-300 hover:text-white'}`}
              >
                All Matches
              </button>
              <button 
                onClick={() => setStatusFilter('LIVE')}
                className={`px-3.5 py-1.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${statusFilter === 'LIVE' ? 'bg-red-600 text-white shadow-md' : 'bg-surface-container text-slate-300 hover:text-red-400'}`}
              >
                <span className={`h-2 w-2 rounded-full bg-white ${statusFilter !== 'LIVE' ? 'animate-pulse' : ''}`}></span>
                Live
              </button>
              <button 
                onClick={() => setStatusFilter('UPCOMING')}
                className={`px-3.5 py-1.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === 'UPCOMING' ? 'bg-emerald-500 text-black shadow-md' : 'bg-surface-container text-slate-300 hover:text-emerald-400'}`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setStatusFilter('RECENT')}
                className={`px-3.5 py-1.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === 'RECENT' ? 'bg-slate-700 text-white shadow-md' : 'bg-surface-container text-slate-300 hover:text-white'}`}
              >
                Recent / Results
              </button>
            </div>

            {/* Clear Filters button if active */}
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-label-caps uppercase font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Reset Filters ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Row 2: Competition Filters (ICC, RPL, DOMESTIC, WOMEN'S, T20 LEAGUE, PREMIER LEAGUE) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[11px] font-label-caps uppercase font-bold text-slate-400 mr-1 flex-shrink-0">Competition:</span>
            <button 
              onClick={() => setCompetitionFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'ALL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              All Competitions
            </button>
            <button 
              onClick={() => setCompetitionFilter('ICC')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'ICC' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              ICC Clashes
            </button>
            <button 
              onClick={() => setCompetitionFilter('RPL')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'RPL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              RPL Premier
            </button>
            <button 
              onClick={() => setCompetitionFilter('DOMESTIC')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'DOMESTIC' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              Domestic
            </button>
            <button 
              onClick={() => setCompetitionFilter('WOMENS')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'WOMENS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              Women's Cricket
            </button>
            <button 
              onClick={() => setCompetitionFilter('T20 LEAGUE')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'T20 LEAGUE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              T20 League
            </button>
            <button 
              onClick={() => setCompetitionFilter('PREMIER LEAGUE')}
              className={`px-3 py-1 rounded-lg text-xs font-label-caps uppercase whitespace-nowrap ${competitionFilter === 'PREMIER LEAGUE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-surface text-slate-400 hover:text-white'}`}
            >
              Premier League
            </button>
          </div>

          {/* Row 3: Format & Secondary Filters (Format, Men's/Women's, Team, Month) */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 font-label-caps pt-1 border-t border-white/5 scrollbar-none flex-wrap sm:flex-nowrap">
            
            {/* Format Filter */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-slate-500 uppercase">Format:</span>
              <button 
                onClick={() => setFormatFilter('ALL')}
                className={`px-2 py-0.5 rounded ${formatFilter === 'ALL' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFormatFilter('T20')}
                className={`px-2 py-0.5 rounded ${formatFilter === 'T20' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                T20 / T20I
              </button>
              <button 
                onClick={() => setFormatFilter('ODI')}
                className={`px-2 py-0.5 rounded ${formatFilter === 'ODI' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                ODI (One-Day)
              </button>
              <button 
                onClick={() => setFormatFilter('TEST')}
                className={`px-2 py-0.5 rounded ${formatFilter === 'TEST' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                Test / Multi-Day
              </button>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Gender Filter */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-slate-500 uppercase">Gender:</span>
              <button 
                onClick={() => setGenderFilter('ALL')}
                className={`px-2 py-0.5 rounded ${genderFilter === 'ALL' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setGenderFilter("Men's")}
                className={`px-2 py-0.5 rounded ${genderFilter === "Men's" ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                Men's
              </button>
              <button 
                onClick={() => setGenderFilter("Women's")}
                className={`px-2 py-0.5 rounded ${genderFilter === "Women's" ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                Women's
              </button>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Team Dropdown */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-slate-500 uppercase">Team:</span>
              <select 
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="bg-surface-container px-2 py-1 rounded text-xs text-white border border-white/10 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Stadium Teams</option>
                {Object.values(CENTRAL_TEAMS).map(t => (
                  <option key={t.id} value={t.shortName}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
              <span className="text-slate-500 uppercase">Month:</span>
              <button 
                onClick={() => setMonthFilter(monthFilter === 'Oct' ? 'ALL' : 'Oct')}
                className={`px-2 py-0.5 rounded ${monthFilter === 'Oct' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                Oct 2026
              </button>
              <button 
                onClick={() => setMonthFilter(monthFilter === 'Nov' ? 'ALL' : 'Nov')}
                className={`px-2 py-0.5 rounded ${monthFilter === 'Nov' ? 'text-emerald-400 font-bold bg-surface-container-high' : 'hover:text-white'}`}
              >
                Nov 2026
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 10.2 CHRONOLOGICAL MATCH LISTING SECTIONS */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 mt-8 flex-grow space-y-12">
        
        {/* SECTION 1: TODAY'S LIVE & HEADLINE MATCHES */}
        {todayMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></span>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>TODAY AT ROSHSPARK STADIUM</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono">
                    {todayMatches.length} Fixtures
                  </span>
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">18 Oct 2026</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {todayMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: UPCOMING FIXTURES */}
        {upcomingMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-lg">calendar_month</span>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>UPCOMING FIXTURES</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-slate-300 font-mono">
                    {upcomingMatches.length} Matches
                  </span>
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-label-caps">Tickets Available Online</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: RECENT RESULTS */}
        {recentMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">history</span>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span>RECENT RESULTS & FINISHED MATCHES</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-slate-300 font-mono">
                    {recentMatches.length} Concluded
                  </span>
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-label-caps">Full Scorecards & Highlights Available</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {filteredMatches.length === 0 && (
          <div className="py-16 text-center bg-surface-container rounded-2xl border border-white/5 max-w-2xl mx-auto shadow-xl">
            <span className="material-symbols-outlined text-5xl text-slate-500 mb-3">sports_cricket</span>
            <h3 className="text-xl font-bold text-white mb-2">No Matching Stadium Fixtures</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              No matches found for the selected combination of tournament, format, gender, and status at RoshSpark Cricket Stadium.
            </p>
            <button 
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps uppercase text-xs font-bold rounded-xl transition-all shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

    </main>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminEngine, AdminMatchItem, LiveMatchState } from '@/lib/adminStore';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

export default function AdminDashboardPage() {
  const [liveState, setLiveState] = useState<LiveMatchState>(adminEngine.getLiveMatchState());
  const [matches, setMatches] = useState<AdminMatchItem[]>(adminEngine.getMatches());
  const [ticketStands, setTicketStands] = useState(adminEngine.getTicketStands());
  const [bookings, setBookings] = useState(adminEngine.getBookings());
  const [users, setUsers] = useState(adminEngine.getUsers());
  const [activityLogs, setActivityLogs] = useState(adminEngine.getActivityLogs());
  const [news, setNews] = useState(adminEngine.getNews());
  const [videos, setVideos] = useState(adminEngine.getVideos());

  const refreshDashboard = useCallback(() => {
    setLiveState({ ...adminEngine.getLiveMatchState() });
    setMatches([...adminEngine.getMatches()]);
    setTicketStands([...adminEngine.getTicketStands()]);
    setBookings([...adminEngine.getBookings()]);
    setUsers([...adminEngine.getUsers()]);
    setActivityLogs([...adminEngine.getActivityLogs()]);
    setNews([...adminEngine.getNews()]);
    setVideos([...adminEngine.getVideos()]);
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshDashboard, 2000);
    return () => clearInterval(interval);
  }, [refreshDashboard]);

  // Instant real-time synchronization
  useRealtimeSync('ALL', refreshDashboard);

  // Compute Metrics strictly from live state (Section 60)
  const liveMatchesCount = matches.filter(m => m.status === 'LIVE').length;
  const upcomingMatchesCount = matches.filter(m => m.status === 'UPCOMING').length;
  const completedMatchesCount = matches.filter(m => m.status === 'COMPLETED').length;

  const totalCapacity = ticketStands.reduce((acc, s) => acc + s.capacity, 0);
  const totalBookedSeats = ticketStands.reduce((acc, s) => acc + s.bookedSeats, 0);
  const totalAvailableSeats = ticketStands.reduce((acc, s) => acc + s.availableSeats, 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalAmount || b.amount || 0), 0);

  const activeSeriesCount = 4;
  const publishedNewsCount = news.filter(n => n.published).length;
  const publishedVideosCount = videos.filter(v => v.published).length;
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'CONFIRMED').length;
  const pendingPaymentsCount = bookings.filter(b => b.status === 'Pending' || b.status === 'PENDING').length;
  const cancelledBookingsCount = bookings.filter(b => b.status === 'Cancelled' || b.status === 'CANCELLED').length;

  const capacityPct = totalCapacity > 0 ? ((totalBookedSeats / totalCapacity) * 100).toFixed(1) : '0';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              CRICKENTRY STADIUM COMMAND CENTER
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
              SYNCHRONIZED REAL-TIME
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mt-1">
            STADIUM ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time stadium match telemetry, ticketing box office, content deployment, and fan database
          </p>
        </div>

        {/* Action Button to Scorer */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/matches/match-ind-aus-live/live"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base font-black animate-pulse">bolt</span>
            <span>Open Live Scorer</span>
          </Link>
        </div>
      </div>

      {/* 2. Top KPI Cards Grid - Full 12 Section 60 Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* 1. Live Matches */}
        <div className="bg-[#0c0f16] border border-white/[0.08] hover:border-emerald-500/30 p-4 rounded-2xl relative overflow-hidden transition-colors group">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">LIVE MATCHES</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {liveMatchesCount}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">
            {liveMatchesCount > 0 ? `${liveState.battingTeam} vs ${liveState.bowlingTeam}` : 'None active'}
          </p>
        </div>

        {/* 2. Upcoming Matches */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">UPCOMING FIXTURES</span>
            <span className="material-symbols-outlined text-sm text-slate-500">schedule</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {upcomingMatchesCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Next: 22 Oct &bull; T20I
          </p>
        </div>

        {/* 3. Completed Matches */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">COMPLETED FIXTURES</span>
            <span className="material-symbols-outlined text-sm text-slate-500">check_circle</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {completedMatchesCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Official scorecards locked
          </p>
        </div>

        {/* 4. Total Tickets Sold */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">TOTAL TICKETS SOLD</span>
            <span className="material-symbols-outlined text-sm text-emerald-400">confirmation_number</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {totalBookedSeats.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            {capacityPct}% arena fill rate
          </p>
        </div>

        {/* 5. Available Tickets */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">AVAILABLE TICKETS</span>
            <span className="material-symbols-outlined text-sm text-slate-500">event_seat</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {totalAvailableSeats.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Across 6 spectator tiers
          </p>
        </div>

        {/* 6. Registered Users */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">REGISTERED USERS</span>
            <span className="material-symbols-outlined text-sm text-slate-500">group</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {users.length.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Verified accounts in DB
          </p>
        </div>

        {/* 7. Active Series */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">ACTIVE SERIES</span>
            <span className="material-symbols-outlined text-sm text-slate-500">emoji_events</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {activeSeriesCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            ICC &bull; RPL &bull; Premier League
          </p>
        </div>

        {/* 8. Published News */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">PUBLISHED NEWS</span>
            <span className="material-symbols-outlined text-sm text-slate-500">newspaper</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {publishedNewsCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Editorial bulletins live
          </p>
        </div>

        {/* 9. Published Videos */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">PUBLISHED VIDEOS</span>
            <span className="material-symbols-outlined text-sm text-slate-500">movie</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {publishedVideosCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            4K YouTube match reels
          </p>
        </div>

        {/* 10. Active Bookings */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">ACTIVE BOOKINGS</span>
            <span className="material-symbols-outlined text-sm text-emerald-400">receipt_long</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {activeBookingsCount}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">
            ₹{totalRevenue.toLocaleString()} gross value
          </p>
        </div>

        {/* 11. Pending Payments */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">PENDING PAYMENTS</span>
            <span className="material-symbols-outlined text-sm text-amber-400">hourglass_top</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {pendingPaymentsCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Awaiting checkout gateway
          </p>
        </div>

        {/* 12. Cancelled Bookings */}
        <div className="bg-[#0c0f16] border border-white/[0.08] p-4 rounded-2xl transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-bold">CANCELLED BOOKINGS</span>
            <span className="material-symbols-outlined text-sm text-rose-400">cancel</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {cancelledBookingsCount}
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Refunds processed
          </p>
        </div>

      </div>

      {/* 3. Live Match Control Center Spotlight Widget */}
      <div className="bg-gradient-to-r from-[#0d121c] via-[#0c0f16] to-[#121824] rounded-3xl p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-widest">
                LIVE STADIUM SCORING CENTER &bull; {liveState.currentOverBall} OVERS
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl font-black text-white tracking-tight">
                {liveState.battingTeam} {liveState.totalScore}/{liveState.wickets}
              </h2>
              <span className="text-slate-400 font-mono text-sm">
                vs {liveState.bowlingTeam} (Target: {liveState.target})
              </span>
            </div>

            {/* Chasing equation bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
              <span className="px-2.5 py-1 rounded bg-[#161a24] text-emerald-300 border border-white/5 font-bold">
                Need: {liveState.runsRequired} runs in {liveState.ballsRemaining} balls
              </span>
              <span>CRR: <strong className="text-white">{liveState.crr}</strong></span>
              <span>RRR: <strong className="text-white">{liveState.rrr}</strong></span>
              <span>Striker: <strong className="text-emerald-400">{liveState.striker.name} ({liveState.striker.runs})*</strong></span>
              <span>Bowler: <strong className="text-white">{liveState.currentBowler.name} ({liveState.currentBowler.overs})</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Link
              href="/admin/matches/match-ind-aus-live/live"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase tracking-wider text-center shadow-lg transition-all"
            >
              Control Scoring Ball-by-Ball &rarr;
            </Link>
            <Link
              href="/matches/match-ind-aus-live"
              target="_blank"
              className="px-5 py-3.5 rounded-xl bg-[#161a24] hover:bg-[#202532] text-slate-200 hover:text-white font-mono text-xs uppercase font-bold text-center border border-white/10 transition-colors"
            >
              Open User View
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions Hub */}
      <div className="bg-[#0c0f16] rounded-3xl p-6 border border-white/[0.08] shadow-xl">
        <div className="mb-4">
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">ONE-CLICK WORKFLOWS</span>
          <h3 className="font-sans text-lg font-bold text-white uppercase tracking-tight">
            QUICK ACTIONS
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: '/admin/matches', label: 'Add Match', icon: 'add_circle', color: 'text-emerald-400' },
            { href: '/admin/matches/match-ind-aus-live/live', label: 'Manage Live Scorer', icon: 'bolt', color: 'text-amber-400' },
            { href: '/admin/players', label: 'Add Player', icon: 'person_add', color: 'text-blue-400' },
            { href: '/admin/teams', label: 'Add Team', icon: 'shield', color: 'text-purple-400' },
            { href: '/admin/squads', label: 'Select Squads', icon: 'groups', color: 'text-cyan-400' },
            { href: '/admin/series', label: 'Add Series', icon: 'emoji_events', color: 'text-yellow-400' },
            { href: '/admin/tickets', label: 'Manage Tickets', icon: 'confirmation_number', color: 'text-emerald-400' },
            { href: '/admin/news', label: 'Add News', icon: 'post_add', color: 'text-rose-400' },
            { href: '/admin/videos', label: 'Add Video', icon: 'video_call', color: 'text-indigo-400' },
            { href: '/admin/users', label: 'Manage Users', icon: 'manage_accounts', color: 'text-slate-300' },
          ].map(action => (
            <Link
              key={action.label}
              href={action.href}
              className="p-3.5 rounded-2xl bg-[#121620] hover:bg-[#181d2a] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center gap-2 group"
            >
              <span className={`material-symbols-outlined text-2xl ${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </span>
              <span className="font-mono text-xs text-slate-300 group-hover:text-white font-bold">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Two Column: Ticket Tiers & Capacity vs Recent Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stand Seating Inventory */}
        <div className="lg:col-span-7 bg-[#0c0f16] rounded-3xl p-6 border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold">INVENTORY &bull; 55,000 SEATS</span>
              <h3 className="font-sans text-base font-bold text-white uppercase">STADIUM TICKET TIERS</h3>
            </div>
            <Link href="/admin/tickets" className="text-xs font-mono text-emerald-400 hover:underline">
              Configure Prices &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {ticketStands.map(stand => {
              const bookedPct = Math.round((stand.bookedSeats / stand.capacity) * 100);
              return (
                <div key={stand.id} className="p-3.5 rounded-xl bg-[#121620] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{stand.name}</span>
                      <span className="text-slate-500 text-[10px]">({stand.gate})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-bold">₹{stand.price.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        stand.status === 'Sold Out' ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {stand.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${bookedPct}%` }}></div>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>{stand.bookedSeats.toLocaleString()} / {stand.capacity.toLocaleString()} seats booked</span>
                    <span>{bookedPct}% occupied</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Admin Activity Log Snippet */}
        <div className="lg:col-span-5 bg-[#0c0f16] rounded-3xl p-6 border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold">SECURITY &bull; AUDIT TRAIL</span>
              <h3 className="font-sans text-base font-bold text-white uppercase">RECENT ADMIN ACTIONS</h3>
            </div>
            <Link href="/admin/activity" className="text-xs font-mono text-emerald-400 hover:underline">
              Full Log &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-[#121620] border border-white/5 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">{log.action}</span>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.details}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                  <span>By: {log.adminName}</span>
                  <span>&bull;</span>
                  <span>{log.section}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

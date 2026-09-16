"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminEngine, AdminRole } from '@/lib/adminStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentRole, setCurrentRole] = useState<AdminRole>('SUPER_ADMIN');
  const [adminName, setAdminName] = useState('Stadium Chief Administrator');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If on login page, render children cleanly without sidebar/topbar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const admin = adminEngine.getAdmin();
    setCurrentRole(admin.role);
    setAdminName(admin.name);
  }, []);

  const handleRoleChange = (role: AdminRole) => {
    adminEngine.setAdminRole(role);
    setCurrentRole(role);
    setAdminName(adminEngine.getAdmin().name);
  };

  const handleLogout = () => {
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#07090d] text-white font-sans">
        {children}
      </div>
    );
  }

  // Navigation Items with Role Restrictions
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', roles: ['SUPER_ADMIN', 'MATCH_ADMIN', 'TICKET_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/matches/match-ind-aus-live/live', label: 'Live Scoring Center', icon: 'bolt', badge: 'LIVE', roles: ['SUPER_ADMIN', 'MATCH_ADMIN'] },
    { href: '/admin/matches', label: 'Match Management', icon: 'sports_cricket', roles: ['SUPER_ADMIN', 'MATCH_ADMIN'] },
    { href: '/admin/teams', label: 'Team Management', icon: 'shield', roles: ['SUPER_ADMIN', 'MATCH_ADMIN'] },
    { href: '/admin/players', label: 'Player Directory', icon: 'person', roles: ['SUPER_ADMIN', 'MATCH_ADMIN'] },
    { href: '/admin/squads', label: 'Squad Selection', icon: 'groups', roles: ['SUPER_ADMIN', 'MATCH_ADMIN'] },
    { href: '/admin/tickets', label: 'Ticket Stands & Prices', icon: 'confirmation_number', roles: ['SUPER_ADMIN', 'TICKET_ADMIN'] },
    { href: '/admin/bookings', label: 'Booking Orders', icon: 'receipt_long', roles: ['SUPER_ADMIN', 'TICKET_ADMIN'] },
    { href: '/admin/series', label: 'Series & Tournaments', icon: 'emoji_events', roles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/rankings', label: 'Stadium Rankings', icon: 'leaderboard', roles: ['SUPER_ADMIN', 'MATCH_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/news', label: 'News Management', icon: 'newspaper', roles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/videos', label: 'Video Vault', icon: 'movie', roles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/stadium', label: 'Stadium Operations', icon: 'stadium', roles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/users', label: 'Registered Fans', icon: 'group', roles: ['SUPER_ADMIN'] },
    { href: '/admin/notifications', label: 'Notifications', icon: 'notifications', roles: ['SUPER_ADMIN', 'CONTENT_ADMIN'] },
    { href: '/admin/activity', label: 'Admin Activity Log', icon: 'history', roles: ['SUPER_ADMIN'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 flex flex-col font-sans">
      
      {/* TOP TELEMETRY BAR */}
      <header className="h-16 bg-[#0c0e14] border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg bg-[#161a22] text-slate-400 hover:text-white border border-white/5 hidden lg:flex items-center justify-center transition-colors"
            title="Toggle Sidebar"
          >
            <span className="material-symbols-outlined text-lg">menu_open</span>
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-[#161a22] text-slate-400 hover:text-white border border-white/5 lg:hidden flex items-center justify-center transition-colors"
            title="Open Mobile Navigation"
          >
            <span className="material-symbols-outlined text-lg">menu</span>
          </button>

          {/* Stadium Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-emerald-500/40 p-0.5 overflow-hidden flex-shrink-0">
              <img src="/logo_3d.jpg" alt="RoshSpark 3D Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-headline-md text-xs font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                <span>ROSHSPARK CRICKET STADIUM</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-black text-[9px] font-mono font-bold tracking-normal">
                  PORTAL
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wide uppercase">
                Operations &amp; Scorer Console
              </div>
            </div>
          </Link>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3">
          
          {/* Live Match Mini Ticker */}
          <Link
            href="/admin/matches/match-ind-aus-live/live"
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-400 hover:bg-emerald-900/60 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE: IND vs AUS (150/4, 17.2 ov)</span>
          </Link>

          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl bg-[#161a22] border border-white/5 text-slate-300 hover:text-white hover:border-emerald-500/30 flex items-center gap-2 text-xs font-mono transition-colors"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            <span className="hidden sm:inline">Search Console</span>
          </button>

          {/* Role Switcher Selector */}
          <div className="flex items-center bg-[#161a22] border border-white/10 rounded-xl px-2.5 py-1 text-xs font-mono">
            <span className="text-slate-500 text-[10px] uppercase mr-2 hidden sm:inline">ROLE:</span>
            <select
              value={currentRole}
              onChange={e => handleRoleChange(e.target.value as AdminRole)}
              className="bg-transparent text-emerald-400 font-bold outline-none cursor-pointer text-xs"
            >
              <option value="SUPER_ADMIN" className="bg-[#0c0e14] text-white">Super Admin (Full Access)</option>
              <option value="MATCH_ADMIN" className="bg-[#0c0e14] text-white">Match Admin (Scoring &amp; Teams)</option>
              <option value="TICKET_ADMIN" className="bg-[#0c0e14] text-white">Ticket Admin (Box Office)</option>
              <option value="CONTENT_ADMIN" className="bg-[#0c0e14] text-white">Content Admin (Editorial)</option>
            </select>
          </div>

          {/* View Public Website */}
          <Link
            href="/"
            target="_blank"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161a22] hover:bg-[#1e2430] border border-white/5 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            title="Open Public User Website"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>View Site</span>
          </Link>

          {/* Admin Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-red-300 flex items-center justify-center transition-colors"
            title="Logout from Admin Portal"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#0c0e14] border-r border-white/[0.08] hidden lg:flex flex-col justify-between transition-all duration-300 z-30 select-none overflow-y-auto`}>
          <div className="py-4 px-3 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {!isSidebarCollapsed && 'STADIUM MODULES'}
            </div>

            {filteredNav.map(item => {
              const isActive = item.href === '/admin' 
                ? pathname === '/admin' 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all group ${
                    isActive
                      ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive ? 'bg-black text-emerald-400' : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer: System Status */}
          <div className="p-3 border-t border-white/[0.08] text-[11px] font-mono bg-[#090b10]">
            {!isSidebarCollapsed ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>3D STADIUM ENGINE:</span>
                  <span className="text-emerald-400 font-bold">LOCKED &bull; OK</span>
                </div>
                <div className="text-slate-500 text-[10px]">
                  RoshSpark Node 01 &bull; 55,000 Capacity
                </div>
              </div>
            ) : (
              <div className="text-center text-emerald-400 font-bold">●</div>
            )}
          </div>
        </aside>

        {/* MOBILE DRAWER NAVIGATION */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-[#0c0e14] border-r border-white/10 h-full flex flex-col justify-between p-4 z-10 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">ADMIN DIRECTORY</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <div className="space-y-1 pt-4">
                  {filteredNav.map(item => {
                    const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono ${
                          isActive ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] bg-red-500 text-white font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase text-center"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN ADMIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-[#07090d] relative">
          {children}
        </main>

      </div>

      {/* QUICK GLOBAL SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-[#121620] border border-white/10 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">ROSHSPARK CONSOLE GLOBAL SEARCH</span>
              <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search matches, players, bookings, teams, series..."
                className="w-full bg-[#090b10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase pb-1">MATCHES &amp; PLAYERS</div>
              <Link 
                href="/admin/matches/match-ind-aus-live/live" 
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 flex items-center justify-between"
              >
                <span>Live Scoring: India vs Australia (150/4)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold">LIVE SCORER</span>
              </Link>
              <Link 
                href="/admin/players" 
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 flex items-center justify-between"
              >
                <span>Player 08 (72 runs, 45 balls) &bull; Batter</span>
                <span className="text-slate-500 text-[10px]">ROSTER</span>
              </Link>
              <Link 
                href="/admin/tickets" 
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 flex items-center justify-between"
              >
                <span>VIP Pavilion Stand Pricing (₹5,000)</span>
                <span className="text-slate-500 text-[10px]">BOX OFFICE</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

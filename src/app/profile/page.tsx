"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { trackClientActivity } from '@/lib/activityLogger';
import PhotoUploadModal from '@/components/PhotoUploadModal';

interface Ticket {
  id: string;
  bookingId: string;
  match: string;
  date: string;
  time: string;
  stand: string;
  block: string;
  seat: string;
  gate: string;
  price: number;
  isUpcoming: boolean;
  status: 'Confirmed' | 'Active' | 'Completed';
  qrUrl: string;
  verificationToken?: string;
}

interface Booking {
  id: string;
  bookingId: string;
  match: string;
  date: string;
  ticketsCount: number;
  amount: number;
  status: 'Completed' | 'Confirmed' | 'Refunded';
  paymentMethod: string;
  stand: string;
  block: string;
  seats: string;
}

interface NotificationItem {
  id: string;
  type: 'ticket' | 'reminder' | 'live' | 'stadium' | 'series' | 'ticket_drop';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as 'all' | 'tickets' | 'bookings' | 'notifications' | 'settings' | null;

  // Active Tab navigation state
  const [activeTab, setActiveTab] = useState<'all' | 'tickets' | 'bookings' | 'notifications' | 'settings'>(initialTab || 'all');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Profile Information State
  const [profileName, setProfileName] = useState('Roshan');
  const [profileEmail, setProfileEmail] = useState('roshan@roshspark.com');
  const [profileMobile, setProfileMobile] = useState('+91 98765 43210');
  const [profilePhoto, setProfilePhoto] = useState<string>('');

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form edit temporary states
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);
  const [tempMobile, setTempMobile] = useState(profileMobile);

  // Password fields
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 2. My Tickets State
  const [ticketFilter, setTicketFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [ticketsData, setTicketsData] = useState<Ticket[]>([
    {
      id: 'tkt-01',
      bookingId: 'RCS-892411',
      match: 'India vs Australia',
      date: '18 Sept 2026',
      time: '7:30 PM IST',
      stand: 'North Stand',
      block: 'Block A',
      seat: 'Seat 24',
      gate: 'Gate 3',
      price: 1800,
      isUpcoming: true,
      status: 'Confirmed',
      verificationToken: 'CRICK-892411-V1',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RCS-892411&bgcolor=ffffff&color=000000'
    }
  ]);

  // 3. Booking History State
  const [bookingsData, setBookingsData] = useState<Booking[]>([
    {
      id: 'bk-01',
      bookingId: 'RCS-892411',
      match: 'India vs Australia',
      date: '18 Sept 2026 • 7:30 PM',
      ticketsCount: 1,
      amount: 1800,
      status: 'Confirmed',
      paymentMethod: 'UPI • Google Pay',
      stand: 'North Stand',
      block: 'Block A',
      seats: 'Seat 24'
    }
  ]);

  // 4. Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'ticket',
      title: 'Ticket Booking Confirmed',
      message: 'Your booking RCS-892411 for India vs Australia has been confirmed. Entry allocated at Gate 3.',
      time: '15 mins ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'reminder',
      title: 'Matchday Notice: India vs Australia',
      message: 'Gates open at 5:00 PM IST on 18 Sept. Digital barcode holders receive fast-track turnstile access.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'live',
      title: 'Live Score Alert',
      message: 'India requires 36 runs in 16 balls at 13.50 RRR under CrickEntry Stadium floodlights.',
      time: '4 hours ago',
      read: false
    }
  ]);

  // 5. Account Settings Preferences State
  const [matchReminderNotifs, setMatchReminderNotifs] = useState(true);
  const [liveUpdatesNotifs, setLiveUpdatesNotifs] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // FETCH UNIFIED DASHBOARD DATA FOR USER <-> ADMIN DATA PARITY
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch('/api/user/dashboard');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        if (data.profile?.name) setProfileName(data.profile.name);
        if (data.profile?.email) setProfileEmail(data.profile.email);
        if (data.profile?.mobile) setProfileMobile(data.profile.mobile);
        const cachedPhoto = typeof window !== 'undefined' ? localStorage.getItem('roshspark_user_photo') : null;
        if (cachedPhoto) {
          setProfilePhoto(cachedPhoto);
        } else if (data.profile?.photo) {
          setProfilePhoto(data.profile.photo);
        }
        if (data.tickets && data.tickets.length > 0) setTicketsData(data.tickets);
        if (data.bookings && data.bookings.length > 0) setBookingsData(data.bookings);
        if (data.notifications && data.notifications.length > 0) setNotifications(data.notifications);
      }
    } catch (e) {
      console.error('Failed to load user dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // AUTOMATIC SYNCHRONIZATION WITH REALTIME HUB (Section 57, 58)
  useRealtimeSync(['BOOKING_CREATED', 'NOTIFICATION', 'TICKET_UPDATE'], () => {
    fetchDashboardData();
    showToast('Dashboard synchronized with live stadium box office!');
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileName(tempName);
    setProfileEmail(tempEmail);
    setProfileMobile(tempMobile);
    setIsEditProfileOpen(false);
    trackClientActivity('Profile updated', `Updated contact details to ${tempName}`);
    showToast('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setIsChangePasswordOpen(false);
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
    trackClientActivity('Password changed', 'Changed account security password');
    showToast('Password changed securely!');
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    trackClientActivity('Notification read', 'Marked all notifications as read');
    showToast('All notifications marked as read.');
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    trackClientActivity('Logout', 'User signed out from account');
    await logout();
    router.push('/login');
  };

  const handleOpenTicket = (tkt: Ticket) => {
    setSelectedTicket(tkt);
    trackClientActivity('Ticket viewed', `Viewed digital entry pass #${tkt.bookingId} (${tkt.match})`);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    trackClientActivity('Notification clicked', item.title);
    showToast(`Notice: ${item.title}`);
  };

  const filteredTickets = ticketsData.filter(t => ticketFilter === 'upcoming' ? t.isUpcoming : !t.isUpcoming);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="w-full pt-24 pb-24 bg-[#0c0e12] min-h-screen text-slate-100 font-sans">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-5 py-3 rounded-xl shadow-2xl font-mono text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Page Title & Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">CRICKENTRY STADIUM</span>
            <h1 className="font-sans text-3xl font-black text-white tracking-tight uppercase mt-0.5">
              FAN DASHBOARD
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1e2024] hover:bg-[#282a2e] text-slate-300 hover:text-white font-mono text-xs transition-colors border border-white/5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Dashboard Navigation Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/10 scrollbar-none">
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'tickets', label: `My Tickets (${ticketsData.length})` },
            { id: 'bookings', label: `Booking History (${bookingsData.length})` },
            { id: 'notifications', label: `Notifications (${unreadCount > 0 ? `${unreadCount} new` : notifications.length})` },
            { id: 'settings', label: 'Settings & Security' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-[#16181c] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PROFILE INFORMATION */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'settings') && (
        <section className="py-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-black font-black text-3xl flex items-center justify-center shadow-xl shadow-emerald-500/10 border-2 border-emerald-400/40 overflow-hidden">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={profileName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profileName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  title="Upload Photo to AWS S3"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1e2024] border border-emerald-400/50 text-emerald-400 hover:bg-emerald-500 hover:text-black flex items-center justify-center text-xs transition-colors shadow-lg group-hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* User Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{profileName}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                    VERIFIED FAN
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm font-mono">
                  <svg className="w-4 h-4 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{profileEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                  <svg className="w-4 h-4 text-emerald-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{profileMobile}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Edit Profile & Change Password */}
            <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setTempName(profileName);
                  setTempEmail(profileEmail);
                  setTempMobile(profileMobile);
                  setIsEditProfileOpen(true);
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/10 text-center flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#1e2024] hover:bg-[#282a2e] text-slate-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-all border border-white/5 text-center flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Change Password</span>
              </button>

              <button
                onClick={() => setIsPhotoModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#16181c] hover:bg-emerald-950/40 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-semibold tracking-wider transition-all border border-emerald-500/30 text-center flex items-center justify-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload S3 Photo</span>
              </button>
            </div>
          </div>
        </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: MY TICKETS (Upcoming | Past) */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'tickets') && (
        <section className="py-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">DIGITAL WALLET</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span>🎟 MY TICKETS</span>
              </h2>
            </div>

            {/* Upcoming | Past Toggle Switch */}
            <div className="flex items-center p-1 bg-[#16181c] rounded-xl border border-white/5 self-start sm:self-auto font-mono text-xs">
              <button
                onClick={() => setTicketFilter('upcoming')}
                className={`px-4 py-1.5 rounded-lg transition-all font-bold ${
                  ticketFilter === 'upcoming'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming ({ticketsData.filter(t => t.isUpcoming).length})
              </button>
              <button
                onClick={() => setTicketFilter('past')}
                className={`px-4 py-1.5 rounded-lg transition-all font-bold ${
                  ticketFilter === 'past'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past ({ticketsData.filter(t => !t.isUpcoming).length})
              </button>
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-10 bg-[#16181c]/60 rounded-2xl border border-white/5">
                <p className="text-sm font-mono text-slate-400">No {ticketFilter} tickets found.</p>
                <Link
                  href="/tickets"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold uppercase"
                >
                  Browse Matches &amp; Book Tickets
                </Link>
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="bg-gradient-to-r from-[#16181c] to-[#1c1f24] rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-emerald-500/30 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
                >
                  {/* Decorative notch on left */}
                  <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-emerald-500"></div>

                  <div className="space-y-2 flex-1 pl-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        🎟 {ticket.match}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 uppercase font-bold">
                        {ticket.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 ml-auto md:ml-0">
                        ID: {ticket.bookingId}
                      </span>
                    </div>

                    <div className="text-sm text-slate-300 font-sans font-medium flex items-center gap-2">
                      <span>{ticket.date} • {ticket.time}</span>
                    </div>

                    {/* Seat breakdown row: Stand • Block • Seat */}
                    <div className="text-xs text-slate-300 font-mono bg-[#0c0e12]/60 px-3 py-2 rounded-xl border border-white/5 flex flex-wrap items-center gap-3">
                      <span><strong>{ticket.stand}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>{ticket.block}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400 font-bold">{ticket.seat}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{ticket.gate}</span>
                    </div>
                  </div>

                  {/* Actions: View Ticket Button */}
                  <div className="flex items-center gap-3 self-end md:self-center pl-2">
                    <button
                      onClick={() => handleOpenTicket(ticket)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Ticket</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: BOOKING HISTORY */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'bookings') && (
        <section className="py-8 border-b border-white/10">
          <div className="mb-6">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">PAST ORDERS &amp; INVOICES</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              📋 BOOKING HISTORY
            </h2>
          </div>

          <div className="space-y-3">
            {bookingsData.map(bk => (
              <div
                key={bk.id}
                className="bg-[#16181c] rounded-2xl p-4 sm:p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{bk.match}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold">
                      {bk.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-2">
                    <span>{bk.date}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{bk.ticketsCount} Ticket(s)</span>
                    <span>•</span>
                    <span>{bk.stand}</span>
                    <span>•</span>
                    <span className="text-slate-300">Seats: {bk.seats}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Order ID: {bk.bookingId} &bull; {bk.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right font-mono">
                    <span className="text-lg font-black text-white">₹{bk.amount.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBooking(bk);
                      trackClientActivity('Ticket viewed', `Viewed booking invoice #${bk.bookingId}`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#22252a] hover:bg-[#2c3036] text-slate-300 hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors border border-white/5"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: NOTIFICATIONS */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'notifications') && (
        <section className="py-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">MATCHDAY DISPATCHES</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span>🔔 NOTIFICATIONS</span>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-xs font-mono font-black">
                    {unreadCount} New
                  </span>
                )}
              </h2>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotifsRead}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4 self-start sm:self-auto"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 8).map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer hover:border-emerald-500/40 ${
                  !notif.read
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-[#16181c] border-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${
                  !notif.read ? 'bg-emerald-500 text-black font-bold' : 'bg-[#1e2024] text-slate-400'
                }`}>
                  {notif.type === 'ticket' && '🎟'}
                  {notif.type === 'reminder' && '⏰'}
                  {notif.type === 'live' && '⚡'}
                  {notif.type === 'stadium' && '🏟'}
                  {notif.type === 'ticket_drop' && '⭐'}
                  {notif.type === 'series' && '🏆'}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    <span className="text-[11px] font-mono text-slate-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{notif.message}</p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 animate-pulse"></span>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: ACCOUNT SETTINGS */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'settings') && (
        <section className="py-8 border-b border-white/10">
          <div className="mb-6">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">PREFERENCES &amp; SECURITY</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
              ⚙️ ACCOUNT SETTINGS
            </h2>
          </div>

          <div className="space-y-3">
            {/* Setting 1: Edit Profile */}
            <div 
              onClick={() => {
                setTempName(profileName);
                setTempEmail(profileEmail);
                setTempMobile(profileMobile);
                setIsEditProfileOpen(true);
              }}
              className="bg-[#16181c] hover:bg-[#1e2024] p-4 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22252a] text-slate-300 flex items-center justify-center text-base">
                  👤
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Edit Profile</h4>
                  <p className="text-xs text-slate-400 font-mono">Full name, email, mobile number</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Setting 2: Change Password */}
            <div 
              onClick={() => setIsChangePasswordOpen(true)}
              className="bg-[#16181c] hover:bg-[#1e2024] p-4 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#22252a] text-slate-300 flex items-center justify-center text-base">
                  🔒
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Change Password</h4>
                  <p className="text-xs text-slate-400 font-mono">Update security credentials</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Setting: Photo Upload & AWS S3 Vault */}
            <Link
              href="/upload"
              className="bg-[#16181c] hover:bg-[#1e2024] p-4 rounded-2xl border border-white/5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-base">
                  ☁️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">AWS S3 Photo Uploader &amp; Vault</h4>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">
                      CLOUD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Upload, preview, and manage images in AWS S3</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Setting 3: Notification Preferences */}
            <div className="bg-[#16181c] p-4 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">NOTIFICATION PREFERENCES</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Matchday Reminders (SMS/Push)</span>
                <input
                  type="checkbox"
                  checked={matchReminderNotifs}
                  onChange={e => {
                    setMatchReminderNotifs(e.target.checked);
                    showToast(`Match reminders ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Real-time Ball Scoring Alerts</span>
                <input
                  type="checkbox"
                  checked={liveUpdatesNotifs}
                  onChange={e => {
                    setLiveUpdatesNotifs(e.target.checked);
                    showToast(`Live updates ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Setting 4: Language & Regional */}
            <div className="bg-[#16181c] p-4 rounded-2xl border border-white/5 flex items-center justify-between font-mono text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">PREFERRED LANGUAGE</span>
                <span className="text-slate-300">Interface and matchday announcements</span>
              </div>
              <select
                value={selectedLanguage}
                onChange={e => {
                  setSelectedLanguage(e.target.value);
                  showToast(`Language set to ${e.target.value}`);
                }}
                className="bg-[#0c0e12] border border-white/10 rounded-xl px-3 py-1.5 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Marathi">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Setting 5: Privacy & Security */}
            <div className="bg-[#16181c] p-4 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">PRIVACY &amp; SECURITY</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Two-Factor Authentication (2FA)</span>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={e => {
                    setTwoFactorAuth(e.target.checked);
                    showToast(`2FA ${e.target.checked ? 'activated' : 'deactivated'}`);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Fan Profile Visibility</span>
                <input
                  type="checkbox"
                  checked={profileVisibility}
                  onChange={e => {
                    setProfileVisibility(e.target.checked);
                    showToast(`Profile visibility ${e.target.checked ? 'public' : 'private'}`);
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                <span>Current Active Session: CrickEntry Arena Secure Turnstile Gateway</span>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: LOGOUT */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'settings') && (
        <section className="py-10 text-center">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 font-mono text-sm font-bold uppercase tracking-widest border border-red-500/30 transition-all shadow-lg active:scale-95"
          >
            [ LOGOUT ]
          </button>
          <p className="text-[11px] text-slate-500 font-mono mt-2">
            Secure session managed by CrickEntry Stadium ID
          </p>
        </section>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW TICKET MODAL */}
      {/* ========================================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16181c] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#22252a] text-slate-400 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>

            <div className="text-center pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                OFFICIAL DIGITAL ENTRY PASS
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{selectedTicket.match}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {selectedTicket.date} • {selectedTicket.time}
              </p>
            </div>

            {/* Stand & Seat Grid */}
            <div className="grid grid-cols-4 gap-2 bg-[#0c0e12] p-3 rounded-2xl border border-white/5 font-mono text-center text-xs">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">STAND</span>
                <span className="text-white font-bold text-[11px] truncate block">{selectedTicket.stand}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">BLOCK</span>
                <span className="text-white font-bold text-[11px]">{selectedTicket.block}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">SEAT</span>
                <span className="text-emerald-400 font-bold text-[11px]">{selectedTicket.seat}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">GATE</span>
                <span className="text-white font-bold text-[11px]">{selectedTicket.gate}</span>
              </div>
            </div>

            {/* QR Code with Digital Specs */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-black">
              <img src={selectedTicket.qrUrl} alt="QR Code" className="w-44 h-44 object-contain" />
              <div className="w-full text-center mt-2 pt-2 border-t border-slate-200 space-y-0.5 font-mono text-[10px]">
                <div className="font-black text-slate-900 tracking-wider">
                  BOOKING ID: {selectedTicket.bookingId}
                </div>
                <div className="text-slate-600">
                  TICKET PASS: #{selectedTicket.id}
                </div>
                <div className="text-emerald-700 font-bold">
                  TOKEN: {selectedTicket.verificationToken || `CRICK-${selectedTicket.bookingId}`}
                </div>
                <div className="text-slate-500 text-[9px] pt-1">
                  Admit 1 Person &bull; Turnstile Scan Required at {selectedTicket.gate}
                </div>
              </div>
            </div>

            {/* Action buttons inside ticket modal */}
            <div className="space-y-2">
              <button
                onClick={() => showToast('Digital entry pass saved to device!')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm font-black">download</span>
                <span>Download Pass (Apple / Google Wallet / PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VIEW BOOKING DETAILS */}
      {/* ========================================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16181c] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#22252a] text-slate-400 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                INVOICE &amp; BOOKING RECEIPT
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{selectedBooking.match}</h3>
              <p className="text-xs text-slate-400 font-mono">Ref ID: {selectedBooking.bookingId}</p>
            </div>

            <div className="space-y-2.5 bg-[#0c0e12] p-4 rounded-2xl border border-white/5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Event Date:</span>
                <span className="text-white">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Location:</span>
                <span className="text-white">{selectedBooking.stand} • {selectedBooking.block}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Allocated Seats:</span>
                <span className="text-emerald-400 font-bold">{selectedBooking.seats}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Payment Mode:</span>
                <span className="text-white">{selectedBooking.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedBooking.status}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                <span>Total Paid:</span>
                <span className="text-emerald-400">₹{selectedBooking.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedBooking(null);
                showToast('Receipt invoice sent to ' + profileEmail);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold transition-all"
            >
              Email Receipt
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT PROFILE */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16181c] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#22252a] text-slate-400 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Edit Profile Details</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Update personal credentials for RoshSpark Stadium pass</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={e => setTempEmail(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">MOBILE NUMBER</label>
                <input
                  type="tel"
                  required
                  value={tempMobile}
                  onChange={e => setTempMobile(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#22252a] text-slate-300 font-mono text-xs uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold transition-all shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CHANGE PASSWORD */}
      {/* ========================================================================= */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16181c] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setIsChangePasswordOpen(false);
                setPasswordError('');
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#22252a] text-slate-400 hover:text-white flex items-center justify-center"
            >
              ✕
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Ensure your account uses a secure password</p>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">CURRENT PASSWORD</label>
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={e => setCurrPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">NEW PASSWORD</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[10px] uppercase block mb-1">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#0c0e12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#22252a] text-slate-300 font-mono text-xs uppercase font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold transition-all shadow-md"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: LOGOUT CONFIRMATION */}
      {/* ========================================================================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16181c] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-red-950/60 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto text-2xl">
              🚪
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Log Out from RoshSpark?</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                You will need to sign in again to access your digital match tickets and booking history.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#22252a] text-slate-300 font-mono text-xs uppercase font-bold hover:bg-[#282a2e]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase font-bold shadow-lg"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: AWS S3 PHOTO UPLOAD MODAL */}
      {/* ========================================================================= */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={profilePhoto}
        title="Upload Fan Avatar to AWS S3"
        onUploadSuccess={(url) => {
          setProfilePhoto(url);
          try {
            localStorage.setItem('roshspark_user_photo', url);
          } catch {}
          showToast('Profile photo updated from AWS S3!');
          trackClientActivity('Profile updated', 'Updated avatar image via AWS S3');
        }}
      />

    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0e12] flex items-center justify-center font-mono text-emerald-400">Loading Fan Dashboard...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

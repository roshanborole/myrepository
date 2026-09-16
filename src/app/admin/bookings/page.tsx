'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminBooking } from '@/lib/adminStore';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setBookings(adminEngine.getBookings());
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      (b.userName || b.user || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.matchName || b.match || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.standName || b.stand || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCancelBooking = (bookingId: string) => {
    if (confirm(`Are you sure you want to cancel booking #${bookingId} and issue an automatic refund?`)) {
      const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b);
      setBookings(updated);
      adminEngine.logActivity('BOOKING_CANCELLED', `Booking #${bookingId} cancelled and refund initiated`);
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }
      showToast(`Booking #${bookingId} cancelled & refunded`);
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

  const statusBadge = (st: AdminBooking['status']) => {
    switch (st) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CONFIRMED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">CANCELLED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">PENDING</span>;
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
            Fan Ticket Bookings & Pass Verifier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, verify QR turnstile admissions, monitor transactions, and process refunds for RoshSpark Stadium matchgoers.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Bookings</div>
          <div className="text-2xl font-black text-white mt-1">{bookings.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-emerald-400 font-medium">Confirmed Passes</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {bookings.filter(b => b.status === 'CONFIRMED').length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Total Gross Value</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-rose-400 font-medium">Cancelled & Refunded</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {bookings.filter(b => b.status === 'CANCELLED').length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-2">
          {(['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search booking ID, fan name, stand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-3 px-4">Booking ID</th>
              <th className="py-3 px-4">Fan Name</th>
              <th className="py-3 px-4">Match</th>
              <th className="py-3 px-4">Stand / Seats</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Booking Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-400">{b.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{b.userName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200">{b.matchName}</div>
                    <div className="text-[11px] text-slate-400">{b.matchDate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium">{b.standName}</div>
                    <div className="text-[11px] text-slate-500">{b.seatsCount} Ticket(s)</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white">₹{(b.totalAmount || b.amount).toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-400">{b.bookingDate}</span>
                  </td>
                  <td className="py-3 px-4">{statusBadge(b.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Digital Pass
                      </button>
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-1 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded transition-colors"
                          title="Cancel & Refund"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Digital Ticket Modal with simulated QR */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  RoshSpark Official Match Pass
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Stadium Ticket Card */}
            <div className="rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border border-emerald-500/30 p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  ROSHSPARK CRICKET STADIUM
                </span>
                {statusBadge(selectedBooking.status)}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{selectedBooking.matchName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedBooking.matchDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Stand Tier</span>
                  <div className="font-bold text-slate-200">{selectedBooking.standName}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Quantity</span>
                  <div className="font-bold text-slate-200">{selectedBooking.seatsCount} Seats</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Pass Holder</span>
                  <div className="font-bold text-slate-200">{selectedBooking.userName}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Total Paid</span>
                  <div className="font-bold text-emerald-400 font-mono">₹{(selectedBooking.totalAmount || selectedBooking.amount).toLocaleString()}</div>
                </div>
              </div>

              {/* Turnstile QR Simulated Matrix */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg">
                <div className="w-32 h-32 bg-slate-950 flex flex-col items-center justify-center rounded p-2 text-center text-white">
                  <div className="w-full h-full border-2 border-emerald-400 border-dashed rounded flex flex-col items-center justify-center p-1">
                    <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2v1h-2z" />
                    </svg>
                    <span className="text-[9px] font-mono text-emerald-400 mt-1">{selectedBooking.qrCode}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-800 mt-2">Scan at RoshSpark Gate Turnstiles</span>
              </div>

              <div className="text-[10px] text-center text-slate-500">
                Booking Reference: {selectedBooking.id}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {selectedBooking.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
                >
                  Cancel & Issue Refund
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { adminEngine, AdminTicketStand } from '@/lib/adminStore';

export default function AdminTicketsPage() {
  const [stands, setStands] = useState<AdminTicketStand[]>([]);
  const [editingStand, setEditingStand] = useState<AdminTicketStand | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('15%');
  const [activePromos, setActivePromos] = useState([
    { code: 'ROSHSPARK10', discount: '10% OFF', usage: 142, status: 'Active' },
    { code: 'VIPCHAMBER', discount: '₹500 Flat OFF', usage: 68, status: 'Active' },
    { code: 'EARLYBIRD', discount: '15% OFF', usage: 310, status: 'Expired' }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setStands(adminEngine.getTicketStands());
  }, []);

  const totalSeats = stands.reduce((sum, s) => sum + (s.totalSeats ?? s.capacity ?? 0), 0);
  const totalSold = stands.reduce((sum, s) => sum + (s.soldSeats ?? s.bookedSeats ?? 0), 0);
  const totalRevenue = stands.reduce((sum, s) => sum + ((s.soldSeats ?? s.bookedSeats ?? 0) * s.price), 0);
  const maxPotentialRevenue = stands.reduce((sum, s) => sum + ((s.totalSeats ?? s.capacity ?? 0) * s.price), 0);

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStand) return;
    adminEngine.updateTicketPrice(editingStand.id, editingStand.price, editingStand.status);
    setStands([...adminEngine.getTicketStands()]);
    setEditingStand(null);
    showToast(`Stand "${editingStand.name}" updated successfully!`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setActivePromos([
      { code: promoCode.toUpperCase().trim(), discount: promoDiscount, usage: 0, status: 'Active' },
      ...activePromos
    ]);
    adminEngine.logActivity('PROMO_CREATED', `Promotional coupon "${promoCode.toUpperCase()}" launched (${promoDiscount})`);
    setPromoCode('');
    showToast(`Promo code created!`);
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
            Ticket Stands & Dynamic Pricing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure seat tiers, stand pricing, real-time inventory caps, and promotional discounts for RoshSpark Stadium.
          </p>
        </div>
      </div>

      {/* Analytics KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Stadium Capacity</div>
          <div className="text-2xl font-black text-white mt-1">{totalSeats.toLocaleString()} seats</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Fixed official bowl capacity</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Tickets Sold</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalSold.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{((totalSold / totalSeats) * 100).toFixed(1)}% occupancy</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Realized Gross Revenue</div>
          <div className="text-2xl font-black text-emerald-300 mt-1">₹{(totalRevenue / 10000000).toFixed(2)} Cr</div>
          <div className="text-[11px] text-slate-400 mt-0.5">₹{totalRevenue.toLocaleString()} INR</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Max Potential Revenue</div>
          <div className="text-2xl font-black text-white mt-1">₹{(maxPotentialRevenue / 10000000).toFixed(2)} Cr</div>
          <div className="text-[11px] text-slate-400 mt-0.5">At 100% sellout capacity</div>
        </div>
      </div>

      {/* Stands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stands.map(stand => {
          const cap = stand.totalSeats ?? stand.capacity ?? 0;
          const booked = stand.soldSeats ?? stand.bookedSeats ?? 0;
          const pct = cap > 0 ? Math.round((booked / cap) * 100) : 0;
          return (
            <div
              key={stand.id}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      {stand.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    stand.status === 'AVAILABLE' || stand.status === 'Available'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : stand.status === 'SELLING_FAST' || stand.status === 'Filling Fast'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {stand.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-black text-white font-mono">₹{stand.price.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">Per ticket (incl. GST)</div>
                  </div>
                  <button
                    onClick={() => setEditingStand({ ...stand })}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Edit Tier
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Inventory Allocation</span>
                    <span className="font-mono text-slate-300 font-bold">{booked.toLocaleString()} / {cap.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-mono">
                    {pct}% booked ({cap - booked} remaining)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Revenue: <strong className="text-slate-200">₹{((booked * stand.price) / 100000).toFixed(1)}L</strong></span>
                <span className="text-[11px] text-emerald-400 font-medium">Digital Pass Valid</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promotional Discount Code Section */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Promotional Coupons & Special Offers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create discount promo codes for online ticket checkout.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreatePromo} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Coupon code (e.g. FINALS20)"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white uppercase placeholder-slate-500"
          />
          <input
            type="text"
            required
            placeholder="Discount (e.g. 20% OFF or ₹200 OFF)"
            value={promoDiscount}
            onChange={e => setPromoDiscount(e.target.value)}
            className="w-full sm:w-48 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-all"
          >
            Create Promo
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {activePromos.map((p, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-mono font-bold text-emerald-400 text-xs">{p.code}</div>
                <div className="text-[11px] text-slate-400">{p.discount} • {p.usage} redeemed</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Stand Modal */}
      {editingStand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Modify Stand: {editingStand.name}
              </h2>
              <button
                onClick={() => setEditingStand(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePrice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ticket Price (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={100}
                    max={50000}
                    value={editingStand.price}
                    onChange={e => setEditingStand({ ...editingStand, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2.5 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Stand Status</label>
                <select
                  value={editingStand.status}
                  onChange={e => setEditingStand({ ...editingStand, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="AVAILABLE">AVAILABLE (Open for purchase)</option>
                  <option value="SELLING_FAST">SELLING FAST (Urgency banner)</option>
                  <option value="SOLD_OUT">SOLD OUT (Halt sales)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>Total Capacity: <strong className="text-white">{(editingStand.totalSeats ?? editingStand.capacity ?? 0).toLocaleString()} seats</strong></div>
                <div>Currently Booked: <strong className="text-emerald-400">{(editingStand.soldSeats ?? editingStand.bookedSeats ?? 0).toLocaleString()} seats</strong></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStand(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

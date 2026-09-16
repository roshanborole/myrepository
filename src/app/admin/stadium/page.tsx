'use client';

import React, { useState } from 'react';
import { adminEngine } from '@/lib/adminStore';

export default function AdminStadiumPage() {
  const [pitchCondition, setPitchCondition] = useState('Hard surface with even grass cover, favoring fast bowlers in first 6 overs');
  const [floodlightStatus, setFloodlightStatus] = useState('ACTIVE - 3,200 LUX (100% OPERATIONAL)');
  const [outfieldCondition, setOutfieldCondition] = useState('Lightning fast bermuda grass surface');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSpecs = (e: React.FormEvent) => {
    e.preventDefault();
    adminEngine.logActivity('STADIUM_CONFIG_UPDATED', 'Ground curator updated pitch and outfield parameters');
    showToast('Stadium ground specs saved to match database!');
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
            Stadium Operations & Facility Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official infrastructure parameters, pitch curation telemetry, and facility management for ROSHSPARK CRICKET STADIUM.
          </p>
        </div>
      </div>

      {/* 3D Stadium Lock Notice */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <h2 className="text-xs font-bold text-emerald-300">
            3D Stadium Digital Twin: Verified & Locked
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            The Interactive 3D Stadium Model (geometry, seating blocks, pitch orientation, materials, floodlights, and camera paths) is final and strictly protected across all digital interfaces.
          </p>
        </div>
      </div>

      {/* Primary Stadium Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Official Bowl Capacity</div>
          <div className="text-2xl font-black text-white mt-1">55,000</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">All-seater tier arrangement</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Straight Boundary</div>
          <div className="text-2xl font-black text-white mt-1">75.0 m</div>
          <div className="text-[10px] text-slate-400 mt-0.5">ICC Class 1 approved</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Square Boundaries</div>
          <div className="text-2xl font-black text-white mt-1">68.0 m</div>
          <div className="text-[10px] text-slate-400 mt-0.5">East & West perimeter</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Broadcast Illumination</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">3,200 Lux</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Zero-flicker 4K HDR compliant</div>
        </div>
      </div>

      {/* Curator & Operations Form */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Head Curator Ground Dossier & Match-Day Telemetry
        </h2>

        <form onSubmit={handleSaveSpecs} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Center Pitch Report</label>
              <textarea
                rows={3}
                value={pitchCondition}
                onChange={e => setPitchCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Outfield & Grass Condition</label>
              <textarea
                rows={3}
                value={outfieldCondition}
                onChange={e => setOutfieldCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Floodlight Array Status</label>
            <input
              type="text"
              value={floodlightStatus}
              onChange={e => setFloodlightStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20"
            >
              Update Ground Telemetry
            </button>
          </div>
        </form>
      </div>

      {/* Facilities & Ground Records Dual Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facilities Directory */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Stadium Infrastructure & Facilities
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Home & Away Team Dressing Suites</span>
              <span className="text-emerald-400 font-semibold">Operational</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Ultra-HD Broadcast & Media Center</span>
              <span className="text-emerald-400 font-semibold">12 Studios Active</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Level-1 Emergency Trauma Care Suite</span>
              <span className="text-emerald-400 font-semibold">Equipped</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Sub-surface Air-Vacuum Drainage</span>
              <span className="text-emerald-400 font-semibold">100 mm/hr rate</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Spectator Parking Lots (A, B, C, D)</span>
              <span className="text-emerald-400 font-semibold">8,500 Vehicles</span>
            </div>
          </div>
        </div>

        {/* Historic Ground Records */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Official RoshSpark Stadium Records
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Highest Team Total:</span>
              <span className="font-mono font-bold text-white">238/3 (20 ov) by India</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Lowest Team Total:</span>
              <span className="font-mono font-bold text-rose-400">89 all out (14.3 ov)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Highest Individual Innings:</span>
              <span className="font-mono font-bold text-emerald-400">118* (54b) Player 08</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Best Bowling Figures:</span>
              <span className="font-mono font-bold text-emerald-400">5/18 (4.0 ov) Player 03</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Highest Successful Run Chase:</span>
              <span className="font-mono font-bold text-white">212/4 (19.4 ov)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Stadium3D from '@/components/Stadium3D';
import StadiumMap from '@/components/StadiumMap';
import { STADIUM_STAND_PRICES } from '@/lib/centralData';
import { trackClientActivity } from '@/lib/activityLogger';

export default function StadiumPage() {
  const [selectedStand, setSelectedStand] = useState<string>('VIP Pavilion');
  const [seatSearchStand, setSeatSearchStand] = useState<string>('North Stand');
  const [seatSearchBlock, setSeatSearchBlock] = useState<string>('A');
  const [seatSearchSeat, setSeatSearchSeat] = useState<string>('12');
  const [foundSeatResult, setFoundSeatResult] = useState<{ stand: string; gate: string; directions: string } | null>(null);

  const handleFindMySeat = (e: React.FormEvent) => {
    e.preventDefault();
    const standInfo = STADIUM_STAND_PRICES[seatSearchStand] || { gate: 'Gate 3', desc: 'Main Concourse' };
    setSelectedStand(seatSearchStand);
    setFoundSeatResult({
      stand: seatSearchStand,
      gate: standInfo.gate,
      directions: `Enter via ${standInfo.gate}. Take Staircase ${seatSearchBlock}, proceed to Level 2, Row 12, Seat ${seatSearchSeat}. Restrooms & Concierge are directly behind Section ${seatSearchBlock}.`
    });
    trackClientActivity('Find My Seat used', `Located seat: ${seatSearchStand} • Block ${seatSearchBlock} • Seat ${seatSearchSeat}`);
  };

  return (
    <main className="w-full pt-20 bg-[#080a0e] relative text-on-surface pb-24">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-emerald-500/10 via-emerald-600/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-10 right-1/4 translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-emerald-400/10 via-emerald-700/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 flex flex-col gap-10">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-label-caps text-xs tracking-widest uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ICC CATEGORY-1 APPROVED • DIGITAL TWIN ARENA</span>
            </div>
            <h1 className="font-headline-lg text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
              ROSHSPARK CRICKET STADIUM
            </h1>
            <p className="font-body-md text-slate-400 text-sm md:text-base mt-2 max-w-3xl">
              Experience the world's most advanced floodlit cricket amphitheatre featuring 55,000 capacity seating, 3,200 lux illumination arrays, and high-precision pitch telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            <div className="bg-surface-container border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">stadium</span>
              <div>
                <div className="font-label-caps text-[10px] uppercase text-slate-400">CAPACITY</div>
                <div className="font-headline-md text-sm text-white font-bold">55,000 SEATS</div>
              </div>
            </div>
            <div className="bg-surface-container border border-emerald-500/30 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">light_mode</span>
              <div>
                <div className="font-label-caps text-[10px] uppercase text-emerald-400">FLOODLIGHTS</div>
                <div className="font-headline-md text-sm text-emerald-300 font-bold">3,200 LUX</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D STADIUM VIEWPORT (Using the Approved, Untouched 3D Stadium Model Component) */}
        <div className="relative w-full rounded-3xl border border-emerald-500/30 bg-[#0a0d12] overflow-hidden shadow-2xl group">
          <div className="relative w-full h-[460px] md:h-[540px] lg:h-[600px] overflow-hidden">
            {/* Live Three.js 3D Stadium Model */}
            <Stadium3D />
            
            {/* HUD Badges Over 3D Scene */}
            <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
              <div className="flex items-center gap-2 pointer-events-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-label-caps text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>3D STADIUM MODEL ONLINE</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-slate-300 font-label-caps text-xs">
                  <span className="material-symbols-outlined text-sm text-emerald-400">sensors</span>
                  <span>14 PITCH NODES ACTIVE</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 pointer-events-auto">
                <Link
                  href="/tickets" 
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span className="material-symbols-outlined text-base">confirmation_number</span>
                  Book Match Seats
                </Link>
              </div>
            </div>

            {/* Bottom Floating Telemetry */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="p-3.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-6 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div>
                    <div className="font-headline-md text-xs font-bold text-white tracking-wide">ROSHSPARK CRICKET STADIUM</div>
                    <div className="font-label-caps text-[10px] text-emerald-400">LAT 18.9220° N, 72.8346° E • FLOODLIGHT GRID: 100% READY</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-white/10 text-xs font-mono text-slate-300">
                  <span>WIND: <strong className="text-white">12 KM/H SW</strong></span>
                  <span>HUMIDITY: <strong className="text-white">54%</strong></span>
                  <span>TURF: <strong className="text-emerald-400">TIFWAY 419 BERMUDA</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stadium Map & Find My Seat Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Interactive Map */}
          <div className="lg:col-span-7 bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div>
                <h3 className="font-headline-md font-bold text-xl text-white">Interactive Stadium Map</h3>
                <p className="text-xs text-slate-400">Click any stand to inspect gate access, view perspective, and amenities</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                {selectedStand}
              </span>
            </div>

            <div className="w-full aspect-square max-w-[460px] mx-auto bg-surface-container-low rounded-2xl p-4 border border-white/5 flex items-center justify-center">
              <StadiumMap 
                selectedStand={selectedStand} 
                interactive={true} 
                onStandClick={(stand) => setSelectedStand(stand)} 
              />
            </div>

            {/* Stand Detail Card */}
            {selectedStand && STADIUM_STAND_PRICES[selectedStand] && (
              <div className="mt-6 p-4 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline-md font-bold text-lg text-white">{selectedStand}</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                      {STADIUM_STAND_PRICES[selectedStand].gate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{STADIUM_STAND_PRICES[selectedStand].desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-400 font-label-caps block">STANDARD PRICE</span>
                  <span className="font-headline-md font-black text-emerald-400 text-xl">
                    ₹{STADIUM_STAND_PRICES[selectedStand].price}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Find My Seat Tool */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/5 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-label-caps text-xs uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-base">explore</span>
                <span>WAYFINDING SYSTEM</span>
              </div>
              <h3 className="font-headline-md font-bold text-2xl text-white mb-2">Find My Seat</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Have a ticket? Enter your Stand, Block, and Seat number for immediate turnstile directions and nearest gate entrance.
              </p>

              <form onSubmit={handleFindMySeat} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-400 text-[10px] uppercase font-label-caps block mb-1">SELECT STAND</label>
                  <select 
                    value={seatSearchStand} 
                    onChange={e => setSeatSearchStand(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(STADIUM_STAND_PRICES).map(stand => (
                      <option key={stand} value={stand}>{stand}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-label-caps block mb-1">BLOCK</label>
                    <input 
                      type="text" 
                      value={seatSearchBlock} 
                      onChange={e => setSeatSearchBlock(e.target.value.toUpperCase())}
                      className="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. A"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] uppercase font-label-caps block mb-1">SEAT NUMBER</label>
                    <input 
                      type="text" 
                      value={seatSearchSeat} 
                      onChange={e => setSeatSearchSeat(e.target.value)}
                      className="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 mt-2 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm font-bold">navigation</span>
                  LOCATE SEAT &amp; TURNSTILE
                </button>
              </form>

              {foundSeatResult && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 animate-in fade-in">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400 font-label-caps text-xs font-bold">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>ROUTE COMPUTED: {foundSeatResult.stand} • {foundSeatResult.gate}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {foundSeatResult.directions}
                  </p>
                </div>
              )}
            </div>

            {/* Stadium Overview & Location */}
            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 shadow-xl text-xs font-mono space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400 font-label-caps uppercase text-[10px]">ADDRESS &amp; GPS</span>
                <span className="text-white font-bold">Marine Promenade Sector 4</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400 font-label-caps uppercase text-[10px]">METRO LINK</span>
                <span className="text-emerald-400">RoshSpark Metro Station (Exit 2)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-label-caps uppercase text-[10px]">PARKING SLOTS</span>
                <span className="text-white font-bold">6,500 Multi-tier Bays</span>
              </div>
            </div>
          </div>

        </div>

        {/* Stadium Facilities Grid */}
        <div className="bg-surface-container rounded-3xl p-6 sm:p-10 border border-white/5 shadow-xl">
          <h3 className="font-headline-md font-bold text-2xl text-white mb-2">Stadium Amenities &amp; Facilities</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-8 max-w-2xl">
            Designed for seamless fan comfort, safety, and matchday immersion across every concourse.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'local_parking',
                title: 'Multi-Level Parking',
                desc: 'Designated parking for 6,500 vehicles with EV supercharging bays and priority entry for pavilion ticket holders.'
              },
              {
                icon: 'wc',
                title: 'Restrooms & Lounges',
                desc: 'Air-conditioned hygienic restrooms every 60 meters equipped with touchless fixtures and baby-care stations.'
              },
              {
                icon: 'medical_services',
                title: 'First Aid & Paramedics',
                desc: 'Full-time emergency medical rooms with on-site cardiac ambulances stationed at Gate 1, Gate 4, and Gate 6.'
              },
              {
                icon: 'support_agent',
                title: 'Help Desk & Lost & Found',
                desc: '24/7 spectator concierge assistance booths located inside all entry turnstiles.'
              },
              {
                icon: 'wifi',
                title: 'Ultra-High-Speed 5G WiFi',
                desc: 'High-density MIMO antennas ensuring instantaneous video replay streaming and live telemetry for all 55,000 fans.'
              }
            ].map(fac => (
              <div key={fac.title} className="p-5 rounded-2xl bg-surface-container-low border border-white/5 hover:border-emerald-500/30 transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">{fac.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">{fac.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{fac.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

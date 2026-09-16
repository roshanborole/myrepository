"use client";

import { useState } from 'react';
import Link from 'next/link';
import { getAllVideos } from './data';

const CATEGORIES = [
  "All Videos",
  "Match Highlights",
  "Best Moments",
  "Player Interviews",
  "Stadium Tour",
  "Behind the Scenes",
  "Best Catches",
  "Best Sixes",
  "Best Wickets"
];

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Videos");
  const [searchQuery, setSearchQuery] = useState("");
  
  const allVideos = getAllVideos();
  
  const filteredVideos = allVideos.filter(v => {
    const matchCat = selectedCategory === "All Videos" || v.categories.includes(selectedCategory) || v.category === selectedCategory;
    const searchVal = searchQuery.toLowerCase().trim();
    const matchSearch = !searchVal || 
      v.title.toLowerCase().includes(searchVal) || 
      v.description.toLowerCase().includes(searchVal) || 
      v.category.toLowerCase().includes(searchVal);
      
    return matchCat && matchSearch;
  });

  return (
    <main className="w-full pt-20 bg-[#0c0e12] min-h-screen">
      <div className="flex flex-col w-full relative">
        {/* Ambient Lighting Glows */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-96 right-10 w-[30rem] h-[30rem] bg-slate-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* 1. Header & Search / Filters Area */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-6 w-full relative z-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#282a2e] text-emerald-400 shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">OFFICIAL ROSHSPARK VIDEO VAULT • 4K HDR BROADCAST</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="font-sans text-4xl md:text-[40px] text-white font-bold tracking-tight uppercase">
                  ROSHSPARK BROADCAST <span className="text-emerald-400">& VIDEO VAULT</span>
                </h1>
                <p className="font-sans text-base text-slate-300 max-w-2xl mt-2">
                  Official match highlights, slow-motion wicket cams, multi-angle floodlit replays, curator pitch telemetry, and exclusive backstage access.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0c0e12] text-white placeholder:text-slate-400 font-sans text-sm pl-11 pr-4 py-3 rounded-xl outline-none border border-white/10 focus:border-emerald-400/50 focus:bg-[#1e2024] transition-all shadow-inner" 
                  placeholder="Search library, bowler tags, replays..." 
                />
              </div>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-mono text-xs tracking-wider uppercase font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500 text-emerald-950 shadow-md' 
                      : 'bg-[#1e2024] text-slate-300 hover:text-white hover:bg-[#282a2e]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. MAIN CURATED VIDEOS REPOSITORY GRID */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 w-full relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">EXPEDITION & ARCHIVES</span>
              <h3 className="font-sans text-2xl text-white font-bold tracking-tight uppercase mt-1">
                {selectedCategory === 'All Videos' ? 'CURATED HIGHLIGHTS & STADIUM ACCESS' : `${selectedCategory.toUpperCase()} REPOSITORY`}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#1e2024] text-slate-300 font-mono text-xs">
                Showing {filteredVideos.length} videos
              </span>
            </div>
          </div>

          {/* Dynamic Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.length === 0 ? (
              <div className="col-span-full py-16 text-center flex flex-col items-center justify-center bg-[#1e2024]/40 rounded-xl border border-white/5">
                <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <p className="font-sans text-base text-white font-medium">No videos found matching your filter.</p>
                <p className="font-sans text-sm text-slate-400 mt-1">Try selecting &apos;All Videos&apos; or modifying your search keyword.</p>
                <button 
                  onClick={() => { setSelectedCategory('All Videos'); setSearchQuery(''); }} 
                  className="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-emerald-950 font-mono text-xs uppercase font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredVideos.map(v => (
                <Link 
                  key={v.id} 
                  href={`/videos/${v.id}`}
                  className="group bg-[#1e2024] rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col cursor-pointer border border-white/5 hover:border-emerald-500/40"
                >
                  {/* Thumbnail Frame */}
                  <div className="relative aspect-video w-full bg-[#0c0e12] overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={v.title} src={v.poster} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Category & Duration Badge */}
                    <div className="absolute top-3 left-3 bg-[#333539]/90 text-emerald-400 px-2.5 py-1 rounded font-mono text-[10px] tracking-wider uppercase font-bold backdrop-blur border border-white/5">
                      {v.category} • {v.duration}
                    </div>

                    {/* Center Emerald Play Button with hover scale */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-emerald-950 flex items-center justify-center shadow-lg group-hover:ring-4 group-hover:ring-emerald-500/40">
                        <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>

                    {/* Meta Bottom left */}
                    <div className="absolute bottom-3 left-3 text-xs font-mono text-slate-300">
                      {v.views} • {v.date}
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur">
                      4K HDR
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <span className="font-mono text-[11px] text-emerald-400 uppercase tracking-widest font-semibold">{v.category}</span>
                      <h4 className="font-sans text-base text-white font-semibold group-hover:text-emerald-400 transition-colors mt-1 line-clamp-2">
                        {v.title}
                      </h4>
                    </div>
                    <p className="font-sans text-sm text-slate-400 line-clamp-2">
                      {v.description}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* 3. OTT Subscription CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-20 w-full relative z-10">
          <div className="relative rounded-2xl bg-gradient-to-r from-[#1a1c20] via-[#1e2024] to-[#282a2e] p-8 md:p-12 overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute right-0 top-0 -mt-8 -mr-8 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 w-fit">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">ROSHSPARK DIGITAL ALL-ACCESS PASS</span>
                </div>
                <h3 className="font-sans text-2xl md:text-3xl text-white font-bold tracking-tight uppercase">
                  NEVER MISS A BALL UNDER THE LIGHTS
                </h3>
                <p className="font-sans text-base text-slate-300">
                  Stream live matchdays in pure uncompressed 4K, toggle between 8 synchronized stadium cameras in real-time, and tune into the boundary stump microphone feed.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {[
                    "Uncompressed 4K 60FPS Bitrate",
                    "8 Dedicated In-Ground Cams",
                    "Direct Pitch Microphone Feeds",
                    "Ad-Free Post-Match Conferences"
                  ].map(feature => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-white">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-full lg:w-auto bg-[#0c0e12]/90 p-6 md:p-8 rounded-xl flex flex-col items-center text-center gap-4 shadow-xl min-w-[280px] border border-white/5">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">SEASON PASS TIER</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans text-3xl font-extrabold text-white">$14.99</span>
                  <span className="text-slate-400 text-sm font-mono">/ month</span>
                </div>
                <button 
                  onClick={() => alert('RoshSpark 30-Day Digital Pass membership activated!')}
                  className="w-full py-3.5 px-6 rounded-lg bg-emerald-500 text-emerald-950 font-mono text-xs uppercase font-bold tracking-wider shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
                >
                  Activate 30-Day Digital Pass
                </button>
                <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">Cancel anytime • Instant 4K access</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

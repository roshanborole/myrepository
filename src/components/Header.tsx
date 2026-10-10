"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { floodlightStore } from '@/store/floodlight';

export default function Header() {
  const [isOn, setIsOn] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    return floodlightStore.subscribe(setIsOn);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/matches', label: 'Matches' },
    { href: '/series', label: 'Series' },
    { href: '/tickets', label: 'Tickets' },
    { href: '/news', label: 'News' },
    { href: '/videos', label: 'Videos' },
    { href: '/stadium', label: 'Stadium' },
    { href: '/upload', label: 'Upload' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-obsidian/90 backdrop-blur-md" data-purpose="top-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand Logo & Stadium Name */}
        <div className="flex items-center space-x-3.5" data-purpose="brand-id">
          <Link href="/" className="relative group cursor-pointer style-3d-model perspective-[1000px]">
            <div className="transform-gpu transition-all duration-500 hover:-rotate-y-12 hover:rotate-x-12 hover:scale-105 shadow-2xl shadow-emeraldGlow/20 rounded-xl overflow-hidden border-2 border-emerald-900/50 bg-black">
              <img src="/logo_3d.jpg" alt="RoshSpark 3D Logo" className="h-14 sm:h-16 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity block" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emeraldGlow/10 via-transparent to-white/20 mix-blend-overlay pointer-events-none"></div>
            </div>
          </Link>
          <div className="hidden xl:flex flex-col">
            <span className="font-headline-md text-xs font-black tracking-widest text-white uppercase">ROSHSPARK</span>
            <span className="font-label-caps text-[10px] tracking-wider text-emeraldGlow uppercase">CRICKET STADIUM</span>
          </div>
        </div>
        
        {/* Desktop Navigation (All Items in order) */}
        <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-mono tracking-wider">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
              
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 transition-colors duration-200 group py-1 ${
                  isActive ? 'text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emeraldGlow shadow-subtle-green"></span>
                )}
                <span>{link.label.toUpperCase()}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Right Stadium Status & Quick Action Telemetry Indicator */}
        <div className="flex items-center space-x-3 sm:space-x-4" data-purpose="telemetry-beacon">
          {/* Floodlight Status Badge */}
          <div 
            onClick={floodlightStore.toggle} 
            role="button"
            tabIndex={0}
            title="Toggle Stadium Floodlights"
            className={`cursor-pointer flex items-center space-x-2 px-2.5 sm:px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono transition-colors ${isOn ? "bg-emerald-950/40 border-emerald-500/30 text-emeraldGlow" : "bg-slate-900 border-slate-700 text-slate-500"}`}
          >
            <span className={`relative flex h-2 w-2 ${!isOn && "opacity-0"}`}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emeraldGlow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emeraldGlow"></span>
            </span>
            <span className="tracking-wide hidden xs:inline">{isOn ? "FLOODLIGHTS ON" : "FLOODLIGHTS OFF"}</span>
            <span className="tracking-wide xs:hidden">{isOn ? "LIGHTS ON" : "OFF"}</span>
          </div>

          {/* S3 Photo Uploader Quick Action */}
          <Link
            href="/upload"
            aria-label="Upload Photo to AWS S3"
            title="AWS S3 Photo Uploader & Vault"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 group ${
              pathname.startsWith('/upload')
                ? 'border-emerald-500/60 bg-emerald-950/70 text-emerald-400 ring-1 ring-emerald-500/40'
                : 'border-white/10 bg-[#16181c] hover:border-emerald-500/50 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400'
            }`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </Link>

          {/* Small clean profile icon on right side */}
          <Link
            href="/profile"
            aria-label="Profile Dashboard"
            title="Profile Dashboard - Roshan"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 group ${
              pathname.startsWith('/profile')
                ? 'border-emerald-500/60 bg-emerald-950/70 text-emerald-400 ring-1 ring-emerald-500/40'
                : 'border-white/10 bg-[#16181c] hover:border-emerald-500/50 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400'
            }`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile & Tablet Horizontal Scroll Navigation Strip */}
      <div className="lg:hidden w-full border-t border-white/[0.04] bg-black/60 px-4 py-2 overflow-x-auto scrollbar-none">
        <nav aria-label="Mobile Navigation" className="flex items-center space-x-5 text-xs font-mono tracking-wider min-w-max">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === link.href 
              : pathname.startsWith(link.href);
              
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 py-1 px-1 transition-colors whitespace-nowrap ${
                  isActive ? 'text-emeraldGlow font-semibold border-b border-emeraldGlow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emeraldGlow"></span>
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

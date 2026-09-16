import React from 'react';
import Link from 'next/link';
import { Match } from '../data';

export default function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';
  const isRecent = match.status === 'RECENT';
  const isBreak = match.breakType || match.status === 'BREAK';

  return (
    <div className="group relative bg-surface-container rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-surface-container-high border border-white/5 hover:border-emerald-500/40 flex flex-col justify-between overflow-hidden">
      
      {/* Clickable Overlay Link to Dedicated Match Center */}
      <Link 
        href={`/matches/${match.id}`} 
        className="absolute inset-0 z-10 rounded-2xl" 
        aria-label={`Open Match Center for ${match.team1.name} vs ${match.team2.name}`}
      />

      {/* 10.3 TOP HEADER: Competition Category, Match Number, Format, Gender & Status */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 relative z-20 pointer-events-none flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isLive && (
            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-label-caps text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-lg shadow-red-600/30 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-white"></span> LIVE
            </span>
          )}
          {isBreak && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-label-caps text-[11px] font-bold uppercase">
              {match.breakType || 'INNINGS BREAK'}
            </span>
          )}
          {isRecent && (
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-slate-300 font-label-caps text-[11px] font-semibold uppercase">
              COMPLETED
            </span>
          )}
          {isUpcoming && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-label-caps text-[11px] font-bold uppercase">
              UPCOMING
            </span>
          )}

          <span className="font-label-caps text-xs text-slate-300 font-medium">
            <span className="text-emerald-400 font-bold">{match.category}</span>
            {match.gender && <span> • {match.gender}</span>}
            {match.matchNumber && <span> • {match.matchNumber}</span>}
            <span> • {match.format}</span>
          </span>
        </div>
        
        <div className="text-right text-[11px] font-mono text-slate-400">
          <span>{match.dateShort}</span> • <span className="text-white font-bold">{match.time}</span>
        </div>
      </div>

      {/* 10.3 MAIN BODY: Teams, Short Names, Scores, Overs, Wickets */}
      <div className="space-y-4 my-2 flex-grow relative z-20 pointer-events-none">
        
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl ${match.team1.color || 'bg-blue-600'} text-white flex items-center justify-center font-headline-md font-black text-sm shadow-md border border-white/10`}>
              {match.team1.shortName}
            </div>
            <div>
              <div className="font-headline-md text-base text-white font-bold flex items-center gap-2">
                {match.team1.name}
                {isLive && match.team1Score && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-label-caps font-bold">Batting</span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-label-caps">{match.matchName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-headline-lg text-2xl font-black ${isLive ? 'text-emerald-400' : 'text-white'}`}>
              {match.team1Score || (isUpcoming ? 'vs' : '-')}
            </div>
            {match.team1Overs && (
              <div className="text-xs text-slate-400 font-mono">{match.team1Overs}</div>
            )}
          </div>
        </div>
        
        {/* Team 2 */}
        <div className={`flex items-center justify-between ${isLive && !match.team2Score ? 'opacity-70' : ''}`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl ${match.team2.color || 'bg-amber-500'} text-white flex items-center justify-center font-headline-md font-black text-sm shadow-md border border-white/10`}>
              {match.team2.shortName}
            </div>
            <div>
              <div className="font-headline-md text-base text-white font-bold">
                {match.team2.name}
              </div>
              <span className="text-[11px] text-slate-400 font-label-caps">RoshSpark Cricket Stadium</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-headline-md text-2xl font-black ${isLive && match.team2Score ? 'text-emerald-400' : 'text-slate-200'}`}>
              {match.team2Score || (isLive ? 'Yet to bat' : isUpcoming ? '' : '-')}
            </div>
            {match.team2Overs && (
              <div className="text-xs text-slate-400 font-mono">{match.team2Overs}</div>
            )}
          </div>
        </div>

        {/* 10.3 & 10.4 Toss & Target Equation / Result Summary */}
        {match.resultSummary && (
          <div className="bg-surface-container-high/70 p-3 rounded-xl border border-white/5 text-center">
            <span className={`text-xs font-label-caps font-bold ${isLive ? 'text-emerald-400' : 'text-slate-200'}`}>
              {match.resultSummary}
            </span>
          </div>
        )}

        {/* Toss Indicator */}
        {match.info.toss && !match.resultSummary && (
          <div className="bg-surface-container-high/40 px-3 py-2 rounded-lg border border-white/5 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-emerald-400">toll</span>
            <span className="truncate">{match.info.toss}</span>
          </div>
        )}

        {/* 10.3 & 54 Ticket Availability & Price for Upcoming Matches */}
        {isUpcoming && match.ticketsStartingPrice && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs font-label-caps">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="material-symbols-outlined text-emerald-400 text-sm">confirmation_number</span>
              <span>Tickets Available</span>
            </div>
            <span className="text-emerald-400 font-bold font-mono">From ₹{match.ticketsStartingPrice}</span>
          </div>
        )}
      </div>

      {/* 10.3 CARD FOOTER: Strictly ROSHSPARK CRICKET STADIUM & Actions */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3 relative z-30">
        <div className="flex items-center gap-1.5 text-[11px] font-label-caps text-slate-400 truncate">
          <span className="material-symbols-outlined text-[15px] text-emerald-400">location_on</span>
          <span className="truncate uppercase font-bold text-white tracking-wide">ROSHSPARK CRICKET STADIUM</span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Direct Buy Tickets Flow */}
          {isUpcoming && (
            <Link 
              href={`/tickets/${match.id}`} 
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-bold uppercase transition-all shadow-md flex items-center gap-1"
            >
              <span>BUY TICKETS</span>
            </Link>
          )}
          <Link 
            href={`/matches/${match.id}`} 
            className="px-3.5 py-1.5 rounded-xl bg-surface-container-highest hover:bg-surface-container text-white font-label-caps text-xs font-bold uppercase transition-colors flex items-center gap-1"
          >
            <span>{isLive ? 'Match Center' : isRecent ? 'Scorecard' : 'Preview'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

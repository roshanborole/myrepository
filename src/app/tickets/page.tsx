import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CENTRAL_MATCHES } from '@/lib/centralData';

export default async function TicketsPage() {
  let dbMatches: any[] = [];
  try {
    dbMatches = await prisma.match.findMany({
      where: {
        status: 'UPCOMING'
      },
      orderBy: {
        date: 'asc'
      }
    });
  } catch {
    dbMatches = [];
  }

  // Combine DB matches and central upcoming matches, eliminating duplicates
  const centralUpcoming = CENTRAL_MATCHES.filter(m => m.status === 'UPCOMING').map(m => ({
    id: m.id,
    team1: m.team1.name,
    team2: m.team2.name,
    format: m.format,
    type: m.category,
    date: new Date(m.datetime.includes('Oct') ? '2026-10-22T19:30:00' : '2026-10-25T19:00:00'),
    startingPrice: m.ticketsStartingPrice || 800
  }));

  const dbMatchesMapped = dbMatches.map(m => ({
    id: m.id,
    team1: m.team1,
    team2: m.team2,
    format: m.format,
    type: m.type,
    date: new Date(m.date),
    startingPrice: 800
  }));

  const matchMap = new Map<string, typeof centralUpcoming[0]>();
  for (const m of dbMatchesMapped) {
    matchMap.set(m.id, m);
  }
  for (const m of centralUpcoming) {
    matchMap.set(m.id, m);
  }
  const allMatches = Array.from(matchMap.values());

  return (
    <main className="w-full min-h-screen pt-24 pb-16 bg-background text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2 text-emerald-400 font-label-caps text-xs tracking-widest uppercase">
            <span className="material-symbols-outlined text-base">confirmation_number</span>
            <span>OFFICIAL BOX OFFICE • ROSHSPARK CRICKET STADIUM</span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-5xl font-extrabold text-white mb-3">
            TICKETS &amp; HOSPITALITY
          </h1>
          <p className="font-body-md text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Secure verified grandstand seats, corporate suites, and VIP pavilion hospitality for world-class cricket action.
          </p>
        </div>

        {/* Stands Price Reference Banner */}
        <div className="mb-10 bg-surface-container rounded-2xl p-5 border border-white/5 shadow-xl">
          <h3 className="font-label-caps text-xs uppercase text-slate-400 font-bold mb-3 tracking-wider text-center sm:text-left">
            STAND PRICING GUIDE (ALL FIXTURES)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { name: 'VIP Pavilion', price: '₹5,000', badge: 'Luxury' },
              { name: 'Premium Stand', price: '₹3,000', badge: 'Corner' },
              { name: 'North Stand', price: '₹1,800', badge: 'Bowler Arm' },
              { name: 'South Stand', price: '₹1,500', badge: 'Dugout' },
              { name: 'East Stand', price: '₹1,200', badge: 'Square' },
              { name: 'West Stand', price: '₹1,000', badge: 'Replay' },
            ].map(stand => (
              <div key={stand.name} className="p-3 rounded-xl bg-surface-container-low border border-white/5">
                <span className="text-[10px] font-label-caps text-slate-400 block">{stand.name}</span>
                <span className="font-headline-md font-bold text-emerald-400 text-base">{stand.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMatches.map(match => (
            <div 
              key={match.id} 
              className="group bg-surface-container rounded-3xl p-6 shadow-xl border border-white/5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-caps text-[11px] text-emerald-400 font-bold uppercase bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                    {match.type.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {match.format}
                  </span>
                </div>
                
                <h3 className="font-headline-md text-2xl font-bold text-white mb-4">
                  {match.team1} vs {match.team2}
                </h3>
                
                <div className="space-y-2 text-xs font-mono text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">📅</span>
                    <span>{match.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">⏰</span>
                    <span>{match.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} IST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">🏟️</span>
                    <span>RoshSpark Cricket Stadium</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-label-caps block">STARTING FROM</span>
                  <span className="font-headline-md text-xl font-bold text-emerald-400">₹{match.startingPrice}</span>
                </div>

                <Link 
                  href={`/tickets/${match.id}`}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-label-caps text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
                >
                  SELECT SEATS
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

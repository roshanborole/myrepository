import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/app/actions/auth';
import Link from 'next/link';
import StadiumMap from '@/components/StadiumMap';
import DownloadTicketButtons from './DownloadTicketButtons';
import { getMatchById } from '@/lib/centralData';

interface TicketItem {
  id: string;
  stand: string;
  block: string | null;
  seat: string;
  price: number;
  entryGate?: string | null;
  match: {
    team1: string;
    team2: string;
    date: Date;
  };
}

export default async function ConfirmationPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ matchId: string }>,
  searchParams: Promise<{ bookingId?: string }>
}) {
  const { matchId } = await params;
  const { bookingId = `RCS-${Math.random().toString(36).substring(2, 8).toUpperCase()}` } = await searchParams;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}&bgcolor=ffffff&color=000000`;

  const user = await getSessionUser();

  let tickets: TicketItem[] = [];
  try {
    if (user) {
      const dbTickets = await prisma.ticket.findMany({
        where: {
          userId: user.id,
          matchId,
          qrCode: bookingId,
          status: 'BOOKED'
        },
        include: {
          match: true
        }
      });
      tickets = dbTickets.map(t => ({
        id: t.id,
        stand: t.stand,
        block: t.block,
        seat: t.seat,
        price: t.price,
        entryGate: t.entryGate,
        match: {
          team1: t.match.team1,
          team2: t.match.team2,
          date: t.match.date
        }
      }));
    }
  } catch {
    tickets = [];
  }

  // Fallback demo ticket if DB tickets aren't found
  if (tickets.length === 0) {
    const centralMatch = getMatchById(matchId);
    tickets = [
      {
        id: "demo-t1",
        stand: "VIP Pavilion",
        block: "A",
        seat: "3-4",
        price: 5000,
        entryGate: "Gate 1",
        match: {
          team1: centralMatch ? centralMatch.team1.name : "India",
          team2: centralMatch ? centralMatch.team2.name : "Australia",
          date: new Date('2026-10-22T19:30:00')
        }
      }
    ];
  }

  const match = tickets[0].match;

  // Group tickets by stand
  const ticketsByStand: Record<string, TicketItem[]> = tickets.reduce((acc: Record<string, TicketItem[]>, ticket: TicketItem) => {
    if (!acc[ticket.stand]) acc[ticket.stand] = [];
    acc[ticket.stand].push(ticket);
    return acc;
  }, {});

  return (
    <main className="w-full pt-28 pb-16 bg-background min-h-screen">
      <div className="flex flex-col w-full px-4 sm:px-6 max-w-xl mx-auto gap-8 items-center">
        
        {/* Success Banner */}
        <div className="w-full bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3 text-emerald-300">
          <span className="material-symbols-outlined text-2xl text-emerald-400">check_circle</span>
          <div>
            <div className="font-bold text-sm text-white">Booking Confirmed & Verified!</div>
            <div className="text-xs text-emerald-400">Your digital ticket is ready for entry at RoshSpark Cricket Stadium.</div>
          </div>
        </div>

        {Object.entries(ticketsByStand).map(([stand, standTickets]: [string, TicketItem[]]) => {
          const gate = standTickets[0].entryGate || 'Gate 1';
          const blocks = Array.from(new Set(standTickets.map(t => t.block))).join(', ');
          const seats = standTickets.map(t => t.seat).join(', ');
          const ticketPrice = standTickets.reduce((sum, t) => sum + t.price, 0);
          const convenienceFee = 50;
          const totalAmount = ticketPrice + convenienceFee;

          return (
            <div key={stand} className="w-full flex flex-col items-center gap-6 ticket-container">
              
              {/* Digital Ticket Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 relative overflow-hidden w-full text-black">
                
                {/* Decorative cutouts for ticket style */}
                <div className="absolute top-[38%] -translate-y-1/2 -left-5 w-10 h-10 bg-background rounded-full border-r border-white/10"></div>
                <div className="absolute top-[38%] -translate-y-1/2 -right-5 w-10 h-10 bg-background rounded-full border-l border-white/10"></div>
                <div className="absolute top-[38%] -translate-y-1/2 left-6 right-6 h-px border-t-2 border-dashed border-black/20"></div>

                <div className="text-center mb-6 pb-4">
                  <span className="font-label-caps text-[11px] tracking-[0.2em] text-emerald-700 uppercase font-black block mb-1">
                    ROSHSPARK CRICKET STADIUM
                  </span>
                  <h1 className="font-headline-lg text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {match.team1} vs {match.team2}
                  </h1>
                  <p className="text-slate-600 text-xs font-mono font-semibold mt-1">
                    📅 {new Date(match.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • ⏰ {new Date(match.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} IST
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-5">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-left">
                    <div>
                      <div className="font-label-caps text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">STAND</div>
                      <div className="font-headline-md text-sm sm:text-base font-bold text-slate-900">{stand}</div>
                    </div>
                    <div>
                      <div className="font-label-caps text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">BLOCK</div>
                      <div className="font-headline-md text-sm sm:text-base font-bold text-slate-900">{blocks}</div>
                    </div>
                    <div>
                      <div className="font-label-caps text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">ROW</div>
                      <div className="font-headline-md text-sm sm:text-base font-bold text-slate-900">12</div>
                    </div>
                    <div>
                      <div className="font-label-caps text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">SEAT</div>
                      <div className="font-headline-md text-sm sm:text-base text-emerald-700 font-mono font-bold">
                        {seats}
                      </div>
                    </div>
                    <div>
                      <div className="font-label-caps text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">GATE</div>
                      <div className="font-headline-md text-sm sm:text-base font-bold text-slate-900">{gate}</div>
                    </div>
                  </div>

                  {/* Pricing Bar */}
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Total Paid (incl. fee)</span>
                      <span className="font-headline-md text-lg font-black text-slate-900">₹{totalAmount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Booking ID</span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded text-xs">{bookingId}</span>
                    </div>
                  </div>

                  {/* QR Code & Map location */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-2 pt-2 border-t border-slate-100">
                    <div className="flex-1 w-full max-w-[200px]">
                      <span className="font-label-caps text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Stand Location</span>
                      <div className="bg-slate-100 rounded-xl p-2 border border-slate-200">
                        <StadiumMap 
                          selectedStand={stand} 
                          highlightedSeats={standTickets.map(t => `${t.block}${t.seat}`)} 
                          interactive={false} 
                        />
                      </div>
                    </div>
                    
                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <div className="w-28 h-28 flex items-center justify-center p-1.5 bg-white rounded-xl shadow-sm border border-slate-200">
                        <img 
                          src={qrCodeUrl}
                          alt={`QR Code for Booking ${bookingId}`}
                          width={100}
                          height={100}
                          className="rounded mix-blend-multiply"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Scan at {gate}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        <DownloadTicketButtons />
        
      </div>
    </main>
  );
}

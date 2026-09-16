import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PrintTicketButton from './PrintTicketButton';

export default async function ConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;

  const tickets = await prisma.ticket.findMany({
    where: { qrCode: bookingId },
    include: {
      match: true,
      user: true,
    }
  });

  if (!tickets || tickets.length === 0) {
    notFound();
  }

  const match = tickets[0].match;
  const stand = tickets[0].stand;
  const gate = tickets[0].entryGate;
  const matchDate = new Date(match.date);
  
  // Use a public API for QR code generation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}&bgcolor=1e2024&color=54e98a`;

  return (
    <main className="w-full pt-32 pb-section-gap bg-background min-h-screen">
      <div className="flex flex-col w-full px-container-padding max-w-2xl mx-auto gap-8">
        
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2 shadow-[0_0_20px_rgba(46,204,113,0.3)]">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h1 className="font-display-md text-display-md text-on-surface text-center">Booking Confirmed!</h1>
          <p className="font-body-md text-on-surface-variant text-center">Your tickets have been successfully booked.</p>
        </div>

        <div className="bg-surface-container rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative">
          
          {/* Ticket Header */}
          <div className="bg-primary/10 p-8 text-center relative border-b border-white/5 border-dashed">
            <div className="absolute left-[-20px] bottom-[-20px] w-10 h-10 bg-background rounded-full border border-white/10 border-t-0 border-r-0 rotate-45"></div>
            <div className="absolute right-[-20px] bottom-[-20px] w-10 h-10 bg-background rounded-full border border-white/10 border-l-0 border-t-0 -rotate-45"></div>
            
            <h2 className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase mb-4">RoshSpark Cricket Stadium</h2>
            <h3 className="font-display-sm text-display-sm text-on-surface">
              {match.team1} <span className="text-on-surface-variant font-light text-2xl px-2">VS</span> {match.team2}
            </h3>
            <p className="font-body-md text-on-surface-variant mt-2">
              {matchDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} • {matchDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>

          {/* Ticket Details */}
          <div className="p-8 pb-12 flex flex-col gap-6 relative">
            <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="font-label-caps text-xs text-on-surface-variant uppercase">Booking ID</span>
                <span className="font-mono text-on-surface font-bold">{bookingId}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-label-caps text-xs text-on-surface-variant uppercase">Gate</span>
                <span className="font-headline-md text-primary">{gate}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">Stand</span>
              <span className="font-headline-md text-on-surface uppercase tracking-widest">{stand}</span>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase border-b border-white/10 pb-2">Seats ({tickets.length})</span>
              <div className="flex flex-wrap gap-2">
                {tickets.map(t => {
                  const [row, seatNum] = t.seat.includes('-') ? t.seat.split('-') : ['?', t.seat];
                  return (
                    <div key={t.id} className="bg-surface-container-highest px-4 py-2 rounded-lg border border-white/5 font-mono text-sm text-on-surface">
                      Block {t.block} • Row {row} • Seat {seatNum}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* QR Code */}
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              <div className="bg-[#1e2024] p-4 rounded-2xl border border-[#54e98a]/30 shadow-[0_0_30px_rgba(84,233,138,0.1)] inline-block">
                <img 
                  src={qrCodeUrl}
                  alt={`QR Code for Booking ${bookingId}`}
                  width={200}
                  height={200}
                  className="rounded-lg mix-blend-screen opacity-90"
                />
              </div>
              <p className="font-mono text-xs text-primary/70 tracking-widest uppercase">Scan at Gate</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link 
            href="/tickets"
            className="flex-1 bg-surface-container-highest hover:bg-surface-container-low text-on-surface font-headline-md py-4 rounded-xl transition-all flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            Browse More Matches
          </Link>
          <PrintTicketButton />
        </div>
        
      </div>
    </main>
  );
}

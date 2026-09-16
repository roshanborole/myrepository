'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import BackButton from '@/components/BackButton';
import StadiumMap from '@/components/StadiumMap';

type Props = {
  matchId: string;
  matchDetails: { team1: string; team2: string; date: Date };
  stand: string;
  bookedSeats: string[];
};

export default function SeatLayout({ matchId, matchDetails, stand, bookedSeats }: Props) {
  const router = useRouter();
  const { state, setMatch, setStand, toggleSeat, totalPrice, serviceFee, grandTotal } = useBooking();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (state.matchId !== matchId || state.stand !== stand) {
      setMatch(matchId);
      setStand(stand);
    }
  }, [matchId, stand, state.matchId, state.stand, setMatch, setStand]);

  const getPrice = () => {
    if (stand.includes('VIP')) return 3000;
    if (stand.includes('Premium')) return 2000;
    if (stand.includes('East') || stand.includes('West')) return 1000;
    return 800; // North/South default
  };

  const basePrice = getPrice();
  const blocks = ['A', 'B'];
  const seatsPerBlock = 8;

  if (!mounted) return null;

  const highlightedSeats = state.seats.map(s => `${s.block}${s.seat}`);

  return (
    <main className="w-full pt-32 pb-section-gap bg-background min-h-screen relative">
      <div className="flex flex-col w-full px-container-padding max-w-5xl mx-auto gap-8">
        
        {/* Map and Seats */}
        <div className="w-full flex flex-col gap-8 pb-24">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="font-display-md text-display-md text-on-surface uppercase tracking-widest">{stand}</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Map Area */}
            <div className="bg-surface-container rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center relative shadow-inner overflow-hidden min-h-[400px]">
              <div className="absolute top-4 left-4 font-label-caps text-on-surface-variant uppercase tracking-widest text-xs z-10">Stadium View</div>
              <StadiumMap 
                selectedStand={stand} 
                highlightedSeats={highlightedSeats} 
                interactive={false} 
              />
            </div>

            {/* Seat Selection Area */}
            <div className="bg-surface-container rounded-3xl p-8 border border-white/5 shadow-xl flex flex-col">
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-headline-md text-primary">₹{basePrice} / seat</span>
              </div>

              {/* Legend */}
              <div className="flex gap-4 mb-8 text-xs font-label-caps uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-on-surface">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-on-surface">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-on-surface-variant">Sold</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="flex flex-col gap-8 items-center bg-surface-container-low p-6 rounded-2xl border border-white/5 flex-grow">
                {blocks.map((block) => (
                  <div key={block} className="flex justify-between gap-4 w-full max-w-[300px]">
                    
                    <div className="flex gap-3">
                      {Array.from({ length: seatsPerBlock / 2 }).map((_, i) => {
                        const seatNum = i + 1; // 1 to 4
                        const seatId = `${block}${seatNum}`;
                        const fullId = `${block}-${seatNum}`; 
                        const isBooked = bookedSeats.includes(fullId);
                        const isSelected = state.seats.some(s => s.block === block && s.seat === seatNum.toString());

                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat({ stand, block, row: '12', seat: seatNum.toString(), price: basePrice })}
                            className={`w-10 h-10 rounded-t-lg rounded-b text-xs font-mono font-bold transition-all flex items-center justify-center border-b-2
                              ${isBooked 
                                ? 'bg-red-500/20 border-red-500/50 text-red-500 cursor-not-allowed opacity-70' 
                                : isSelected 
                                  ? 'bg-blue-500 border-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' 
                                  : 'bg-primary/20 border-primary/50 text-primary hover:bg-primary/40 hover:border-primary'}
                            `}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>

                    <div className="w-8 flex justify-center items-center">
                      <div className="w-px h-full bg-white/10 rounded-full"></div>
                    </div>

                    <div className="flex gap-3">
                      {Array.from({ length: seatsPerBlock / 2 }).map((_, i) => {
                        const seatNum = i + 5; // 5 to 8
                        const seatId = `${block}${seatNum}`;
                        const fullId = `${block}-${seatNum}`; 
                        const isBooked = bookedSeats.includes(fullId);
                        const isSelected = state.seats.some(s => s.block === block && s.seat === seatNum.toString());

                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat({ stand, block, row: '12', seat: seatNum.toString(), price: basePrice })}
                            className={`w-10 h-10 rounded-t-lg rounded-b text-xs font-mono font-bold transition-all flex items-center justify-center border-b-2
                              ${isBooked 
                                ? 'bg-red-500/20 border-red-500/50 text-red-500 cursor-not-allowed opacity-70' 
                                : isSelected 
                                  ? 'bg-blue-500 border-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' 
                                  : 'bg-primary/20 border-primary/50 text-primary hover:bg-primary/40 hover:border-primary'}
                            `}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="mt-4 w-full max-w-[300px] h-10 bg-surface-container-highest/80 rounded border border-white/5 flex items-center justify-center text-xs text-on-surface-variant tracking-[0.4em] uppercase font-bold relative overflow-hidden">
                  🏏 Pitch Direction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Proceed Bar */}
      {state.seats.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface-container/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-6 z-50 min-w-max animate-in slide-in-from-bottom-8">
          <div className="flex flex-col">
             <span className="text-on-surface-variant text-sm font-label-caps uppercase tracking-wider">Selected Seat{state.seats.length > 1 ? 's' : ''}</span>
             <span className="text-on-surface font-bold text-lg">{state.seats.map(s => `${s.block}${s.seat}`).join(', ')}</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex flex-col">
             <span className="text-on-surface-variant text-sm font-label-caps uppercase tracking-wider">Ticket Price</span>
             <span className="text-primary font-bold text-lg">₹{state.seats.reduce((sum, s) => sum + s.price, 0)}</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <button 
            onClick={() => router.push(`/tickets/${matchId}/checkout`)}
            className="bg-primary text-on-primary font-headline-md text-body-md px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(46,204,113,0.3)] hover:shadow-[0_0_30px_rgba(46,204,113,0.5)] transition-all uppercase tracking-widest font-bold"
          >
            PROCEED TO PAY
          </button>
        </div>
      )}
    </main>
  );
}

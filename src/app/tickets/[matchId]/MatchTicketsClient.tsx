'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking, SeatSelection } from '@/context/BookingContext';
import InteractiveStadium3D from '@/components/InteractiveStadium3D';
import { trackClientActivity } from '@/lib/activityLogger';

type Props = {
  matchId: string;
  matchDetails: { team1: string; team2: string; date: Date };
  bookedSeats: string[];
};

type SeatAnchor = {
  stand: string;
  block: string;
  row: string;
  seat: string;
  price: number;
};

// Stand Pitch Side mapping
const STAND_PITCH_SIDE: Record<string, string> = {
  'North Stand': "Behind Bowler's Arm • North Pavilion End",
  'South Stand': "Media Box & Pavilion End • Direct Pitch Line",
  'East Stand': "Deep Mid-Wicket / Cover Boundary • East Arc",
  'West Stand': "Square Leg / Point Boundary • West Arc",
  'VIP Pavilion': "Grand VIP Suites • Elevated Pitch View",
  'Premium Stand': "Corner View Club • 45° Pitch Sightline",
};

/**
 * Consecutive Seat Selection Algorithm with strict user priority:
 * 1. Right side in the same row
 * 2. Left side in the same row
 * 3. Lower rows (closer to the pitch)
 * 4. Upper rows (higher vantage point)
 * 5. Nearest available cluster of N seats
 */
function selectSeatsByPriority({
  count,
  startSeat,
  bookedSeats,
}: {
  count: number;
  startSeat: SeatAnchor;
  bookedSeats: string[];
}): SeatSelection[] {
  const stand = startSeat.stand || 'North Stand';
  const block = startSeat.block || 'A';
  const startRow = parseInt(startSeat.row, 10) || 1;
  const startCol = parseInt(startSeat.seat, 10) || 1;
  const price = startSeat.price || 800;

  const isVipOrPremium = stand.includes('VIP') || stand.includes('Premium');
  const maxRow = isVipOrPremium ? 6 : 8;
  const maxSeat = isVipOrPremium ? 10 : 15;

  const isSeatAvailable = (r: number, c: number, b: string = block) => {
    if (r < 1 || r > maxRow) return false;
    if (c < 1 || c > maxSeat) return false;
    const fullId = `${stand}-${b}-${r}-${c}`;
    const simpleId = `${stand}-${b}-${c}`;
    return !bookedSeats.includes(fullId) && !bookedSeats.includes(simpleId);
  };

  const createSeat = (r: number, c: number, b: string = block): SeatSelection => ({
    stand,
    block: b,
    row: r.toString(),
    seat: c.toString(),
    price,
    id: `${stand}-${b}-${r}-${c}`,
  });

  // Priority 1: Right side in same row
  let rightOk = true;
  const rightSeats: SeatSelection[] = [];
  for (let i = 0; i < count; i++) {
    const c = startCol + i;
    if (isSeatAvailable(startRow, c)) {
      rightSeats.push(createSeat(startRow, c));
    } else {
      rightOk = false;
      break;
    }
  }
  if (rightOk && rightSeats.length === count) return rightSeats;

  // Priority 2: Left side in same row
  let leftOk = true;
  const leftSeats: SeatSelection[] = [];
  for (let i = 0; i < count; i++) {
    const c = startCol - i;
    if (isSeatAvailable(startRow, c)) {
      leftSeats.push(createSeat(startRow, c));
    } else {
      leftOk = false;
      break;
    }
  }
  if (leftOk && leftSeats.length === count) {
    return leftSeats.sort((a, b) => parseInt(a.seat, 10) - parseInt(b.seat, 10));
  }

  // Helper to find a span of consecutive seats in row r
  const findRowSpan = (r: number): SeatSelection[] | null => {
    // Check right-aligned from startCol in row r
    let rRightOk = true;
    const rRightSeats: SeatSelection[] = [];
    for (let i = 0; i < count; i++) {
      const c = startCol + i;
      if (isSeatAvailable(r, c)) {
        rRightSeats.push(createSeat(r, c));
      } else {
        rRightOk = false;
        break;
      }
    }
    if (rRightOk && rRightSeats.length === count) return rRightSeats;

    // Check left-aligned from startCol in row r
    let rLeftOk = true;
    const rLeftSeats: SeatSelection[] = [];
    for (let i = 0; i < count; i++) {
      const c = startCol - i;
      if (isSeatAvailable(r, c)) {
        rLeftSeats.push(createSeat(r, c));
      } else {
        rLeftOk = false;
        break;
      }
    }
    if (rLeftOk && rLeftSeats.length === count) {
      return rLeftSeats.sort((a, b) => parseInt(a.seat, 10) - parseInt(b.seat, 10));
    }

    // Check best available consecutive window closest to startCol in row r
    let bestSpan: SeatSelection[] | null = null;
    let minDiff = Infinity;
    for (let sc = 1; sc <= maxSeat - count + 1; sc++) {
      let spanOk = true;
      const spanSeats: SeatSelection[] = [];
      for (let j = 0; j < count; j++) {
        if (isSeatAvailable(r, sc + j)) {
          spanSeats.push(createSeat(r, sc + j));
        } else {
          spanOk = false;
          break;
        }
      }
      if (spanOk && spanSeats.length === count) {
        const diff = Math.abs(sc + (count - 1) / 2 - startCol);
        if (diff < minDiff) {
          minDiff = diff;
          bestSpan = spanSeats;
        }
      }
    }
    return bestSpan;
  };

  // Priority 3: Lower rows (closer to the pitch)
  for (let r = startRow - 1; r >= 1; r--) {
    const span = findRowSpan(r);
    if (span) return span;
  }

  // Priority 4: Upper rows (higher vantage point)
  for (let r = startRow + 1; r <= maxRow; r++) {
    const span = findRowSpan(r);
    if (span) return span;
  }

  // Priority 5: Fallback - Closest available cluster of N seats
  const candidates: { seat: SeatSelection; dist: number }[] = [];
  for (let r = 1; r <= maxRow; r++) {
    for (let c = 1; c <= maxSeat; c++) {
      if (isSeatAvailable(r, c)) {
        const dr = Math.abs(r - startRow);
        const dc = Math.abs(c - startCol);
        candidates.push({
          seat: createSeat(r, c),
          dist: dc * dc + dr * dr * 10,
        });
      }
    }
  }

  candidates.sort((a, b) => a.dist - b.dist);
  return candidates
    .slice(0, count)
    .map(c => c.seat)
    .sort((a, b) => {
      if (a.row !== b.row) return parseInt(a.row, 10) - parseInt(b.row, 10);
      return parseInt(a.seat, 10) - parseInt(b.seat, 10);
    });
}

export default function MatchTicketsClient({ matchId, matchDetails, bookedSeats }: Props) {
  const router = useRouter();
  const { state, setMatch, setSeats, clearSeats, serviceFee, grandTotal } = useBooking();

  // Ticket count state (defaults to 5)
  const [ticketCount, setTicketCount] = useState<number>(5);
  // Modal visibility: starts open so user chooses ticket count first
  const [showQuantityModal, setShowQuantityModal] = useState<boolean>(true);

  // Keep track of the last clicked anchor seat
  const lastAnchorRef = useRef<SeatAnchor | null>(null);

  // Initialize matchId on mount
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current || state.matchId !== matchId) {
      initializedRef.current = true;
      setMatch(matchId);
      clearSeats();
      trackClientActivity('Ticket booking started', `${matchDetails.team1} vs ${matchDetails.team2} (${matchDetails.date.toDateString()})`);
    }
  }, [matchId, state.matchId, setMatch, clearSeats, matchDetails]);

  // Core auto-selection handler
  const performAutoSelect = useCallback((count: number, anchor: SeatAnchor) => {
    lastAnchorRef.current = anchor;
    const selected = selectSeatsByPriority({
      count,
      startSeat: anchor,
      bookedSeats,
    });
    setSeats(selected);
  }, [bookedSeats, setSeats]);

  // Handle user changing ticket quantity via stepper or direct input
  const updateTicketCount = useCallback((newCount: number) => {
    const clamped = Math.max(1, Math.min(10, newCount));
    setTicketCount(clamped);

    // If seats are already selected on the map, re-allocate with new quantity
    if (state.seats.length > 0 && lastAnchorRef.current) {
      performAutoSelect(clamped, lastAnchorRef.current);
    }
  }, [state.seats.length, performAutoSelect]);

  // When user clicks "Proceed" in the modal
  const handleConfirmQuantity = () => {
    setShowQuantityModal(false);
    trackClientActivity('Number of people selected', `Selected ${ticketCount} attendees/tickets`);
  };

  // When user clicks a seat on the 3D map
  const handleSeatClick = useCallback((seatData: any) => {
    const anchor: SeatAnchor = {
      stand: seatData.stand,
      block: seatData.block,
      row: seatData.row.toString(),
      seat: seatData.seat.toString(),
      price: seatData.price || 800,
    };
    trackClientActivity('Stand selected', `${anchor.stand} • Block ${anchor.block}`);
    performAutoSelect(ticketCount, anchor);
  }, [ticketCount, performAutoSelect]);

  // Pitch side orientation for selected seats
  const selectedPitchSide = React.useMemo(() => {
    if (state.seats.length > 0) {
      const standName = state.seats[0].stand;
      return STAND_PITCH_SIDE[standName] || "Direct Pitch Line • Oval Ground View";
    }
    return null;
  }, [state.seats]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] min-h-[700px] flex flex-col bg-[#05070a] overflow-hidden">

      {/* 1. Modal: Ticket Quantity Selector (Displays first) */}
      {showQuantityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-surface-container/95 border border-primary/30 rounded-3xl p-8 shadow-[0_0_80px_rgba(46,204,113,0.18)] flex flex-col items-center text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-3xl mb-4 shadow-[0_0_24px_rgba(46,204,113,0.25)]">
              🎟️
            </div>

            <h2 className="font-headline-lg text-2xl text-white font-bold tracking-tight mb-2">
              How many tickets do you need?
            </h2>
            <p className="text-on-surface-variant text-sm max-w-sm mb-8">
              Choose your group size. You will then click any seat on the 3D stadium map to automatically reserve <span className="text-primary font-semibold">consecutive seats together</span>.
            </p>

            {/* Stepper Selector */}
            <div className="flex items-center justify-center gap-6 mb-8 w-full max-w-xs">
              <button
                type="button"
                id="btn-decrease-tickets"
                onClick={() => updateTicketCount(ticketCount - 1)}
                disabled={ticketCount <= 1}
                className="w-14 h-14 rounded-2xl bg-surface-container-highest border border-white/10 text-white text-2xl font-bold flex items-center justify-center transition-all hover:bg-white/10 hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              >
                −
              </button>

              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ticketCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) updateTicketCount(val);
                  }}
                  className="w-24 text-center font-headline-lg text-4xl font-extrabold text-white bg-transparent border-b-2 border-primary focus:outline-none focus:border-white transition-colors"
                />
                <span className="text-[11px] font-label-caps uppercase tracking-wider text-primary font-bold mt-1">
                  Tickets
                </span>
              </div>

              <button
                type="button"
                id="btn-increase-tickets"
                onClick={() => updateTicketCount(ticketCount + 1)}
                disabled={ticketCount >= 10}
                className="w-14 h-14 rounded-2xl bg-surface-container-highest border border-white/10 text-white text-2xl font-bold flex items-center justify-center transition-all hover:bg-white/10 hover:border-primary/50 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              >
                +
              </button>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xs">
              {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateTicketCount(num)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold font-mono transition-all
                    ${ticketCount === num
                      ? 'bg-primary text-black shadow-md shadow-primary/30 scale-105'
                      : 'bg-surface-container-highest text-on-surface-variant hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              id="btn-proceed-modal"
              onClick={handleConfirmQuantity}
              className="w-full py-4 rounded-2xl bg-primary text-black font-headline-md font-bold tracking-wide uppercase shadow-[0_0_30px_rgba(46,204,113,0.35)] hover:shadow-[0_0_40px_rgba(46,204,113,0.55)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Header Bar with Live Quantity Controls */}
      <div className="z-10 bg-surface-container/90 backdrop-blur-md px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-lg text-white font-bold tracking-wide flex items-center gap-2">
            <span>{matchDetails.team1} vs {matchDetails.team2}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono">
              LIVE SEAT SELECTION
            </span>
          </h1>
          <p className="text-xs text-on-surface-variant">
            RoshSpark Cricket Stadium • Full 3D Seating Map
          </p>
        </div>

        {/* Floating Ticket Quantity Modifier */}
        <div className="flex items-center gap-3 bg-surface-container-highest/90 px-4 py-1.5 rounded-2xl border border-white/10 shadow-inner">
          <span className="text-xs font-label-caps uppercase tracking-wider text-on-surface-variant">
            Tickets:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateTicketCount(ticketCount - 1)}
              disabled={ticketCount <= 1}
              className="w-7 h-7 rounded-lg bg-surface-container border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-6 text-center font-mono font-bold text-white text-base">
              {ticketCount}
            </span>
            <button
              type="button"
              onClick={() => updateTicketCount(ticketCount + 1)}
              disabled={ticketCount >= 10}
              className="w-7 h-7 rounded-lg bg-surface-container border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main 3D Stadium Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <InteractiveStadium3D
          bookedSeats={bookedSeats}
          selectedSeats={state.seats}
          onSeatToggle={handleSeatClick}
          basePrice={800}
        />

        {/* Floating Instruction Banner when 0 seats selected */}
        {state.seats.length === 0 && !showQuantityModal && (
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none animate-bounce">
            <div className="bg-primary/95 text-black px-6 py-2.5 rounded-2xl font-headline-md font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2">
              <span>👇</span>
              <span>Click any available green seat on the map to reserve {ticketCount} consecutive seats</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Booking Summary Footer (When seats are selected) */}
      {state.seats.length > 0 && (
        <div className="z-30 bg-surface-container/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-white font-headline-md text-base font-bold">
                {state.seats[0].stand}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono font-bold">
                {state.seats.length} Tickets Selected
              </span>
            </div>

            {/* Selected Seats List */}
            <div className="text-xs text-slate-300 font-mono flex flex-wrap items-center gap-1.5">
              <span>Seats:</span>
              {state.seats.map((s, idx) => (
                <span
                  key={s.id || idx}
                  className="bg-primary/15 text-primary px-2 py-0.5 rounded-md border border-primary/25 font-bold"
                >
                  {s.block}{s.seat} (R{s.row})
                </span>
              ))}
            </div>

            {/* Pitch Side Indication */}
            {selectedPitchSide && (
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span>📍 PITCH SIDE:</span>
                <span className="text-slate-200 font-semibold">{selectedPitchSide}</span>
              </div>
            )}
          </div>

          {/* Pricing & Checkout Proceed */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-on-surface-variant font-mono">
                ₹{state.seats[0]?.price || 800} × {state.seats.length} + ₹{serviceFee} fee
              </div>
              <div className="text-2xl font-extrabold text-white font-mono leading-tight">
                ₹{grandTotal.toLocaleString()}
              </div>
            </div>

            <button
              type="button"
              id="btn-proceed-to-pay"
              onClick={() => router.push(`/tickets/${matchId}/checkout`)}
              className="px-8 py-3.5 rounded-2xl bg-primary text-black font-headline-md font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(46,204,113,0.4)] hover:shadow-[0_0_40px_rgba(46,204,113,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Proceed to Pay</span>
              <span className="text-base">→</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

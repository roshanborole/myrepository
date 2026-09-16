'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SeatSelection = {
  stand: string;
  block: string;
  row: string;
  seat: string;
  price: number;
  id?: string;
};

type BookingState = {
  matchId: string | null;
  stand: string | null;
  seats: SeatSelection[];
  serviceFeeRate: number;
};

type BookingContextType = {
  state: BookingState;
  setMatch: (matchId: string) => void;
  setStand: (stand: string) => void;
  toggleSeat: (seat: SeatSelection) => void;
  setSeats: (seats: SeatSelection[]) => void;
  clearSeats: () => void;
  clearAll: () => void;
  totalPrice: number;
  serviceFee: number;
  grandTotal: number;
};

const initialState: BookingState = {
  matchId: null,
  stand: null,
  seats: [],
  serviceFeeRate: 0.05,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('roshspark_booking');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved booking state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('roshspark_booking', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setMatch = (matchId: string) => {
    setState(prev => ({ ...prev, matchId, stand: null, seats: [] }));
  };

  const setStand = (stand: string) => {
    setState(prev => ({ ...prev, stand, seats: [] }));
  };

  const toggleSeat = (seat: SeatSelection) => {
    setState(prev => {
      const exists = prev.seats.find(s => (s.id && s.id === seat.id) || (s.stand === seat.stand && s.row === seat.row && s.seat === seat.seat && s.block === seat.block));
      if (exists) {
        return { ...prev, seats: prev.seats.filter(s => !((s.id && s.id === seat.id) || (s.stand === seat.stand && s.row === seat.row && s.seat === seat.seat && s.block === seat.block))) };
      } else {
        return { ...prev, seats: [...prev.seats, seat] };
      }
    });
  };

  const setSeats = (seats: SeatSelection[]) => {
    setState(prev => ({ ...prev, seats }));
  };

  const clearSeats = () => setState(prev => ({ ...prev, seats: [] }));
  const clearAll = () => setState(initialState);

  const totalPrice = state.seats.reduce((sum, seat) => sum + seat.price, 0);
  const serviceFee = totalPrice * state.serviceFeeRate;
  const grandTotal = totalPrice + serviceFee;

  return (
    <BookingContext.Provider value={{
      state,
      setMatch,
      setStand,
      toggleSeat,
      setSeats,
      clearSeats,
      clearAll,
      totalPrice,
      serviceFee,
      grandTotal,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
